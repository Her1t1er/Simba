package com.simba.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simba.model.*;
import com.simba.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository, 
                      BranchRepository branchRepository, InventoryRepository inventoryRepository, 
                      UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.branchRepository = branchRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Branches
        if (branchRepository.count() == 0) {
            List<String> branchNames = Arrays.asList(
                "Simba Centenary", "Simba Gishushu", "Simba Kimironko", "Simba Kicukiro",
                "Simba Kigali Height", "Simba UTC", "Simba Gacuriro", "Simba Gikondo",
                "Simba sonatube", "Simba Kisimenti", "Simba Rebero", "Simba Nyamirambo", "Simba Musanze"
            );
            for (String name : branchNames) {
                branchRepository.save(new Branch(name));
            }
            System.out.println("Branches seeded successfully!");
        }

        // 2. Load Products from JSON
        if (productRepository.count() == 0) {
            // Check multiple paths (Local vs Docker)
            String[] possiblePaths = {
                "src/main/resources/data/simba_products.json",
                "../src/data/simba_products.json",
                "src/data/simba_products.json"
            };
            
            File file = null;
            String foundPath = null;
            for (String path : possiblePaths) {
                File f = new File(path);
                if (f.exists()) {
                    file = f;
                    foundPath = path;
                    break;
                }
            }

            if (file == null) {
                System.out.println("JSON data file not found in any of the search locations.");
            } else {
                System.out.println("Loading products from: " + foundPath);
                byte[] jsonData = Files.readAllBytes(Paths.get(foundPath));
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(jsonData);
                JsonNode productsNode = root.get("products");

                for (JsonNode node : productsNode) {
                    String categoryName = node.get("category").asText();
                    Category category = categoryRepository.findByName(categoryName);
                    if (category == null) {
                        category = categoryRepository.save(new Category(categoryName));
                    }

                    Product product = new Product();
                    if (node.has("id")) product.setId(node.get("id").asLong());
                    product.setName(node.get("name").asText());
                    product.setPrice(node.get("price").asDouble());
                    product.setUnit(node.get("unit").asText());
                    product.setImage(node.get("image").asText());
                    product.setInStock(node.has("inStock") ? node.get("inStock").asBoolean() : true);
                    product.setCategory(category);
                    productRepository.save(product);

                    // Add to inventory for all branches
                    for (Branch branch : branchRepository.findAll()) {
                        Inventory inv = new Inventory();
                        inv.setBranch(branch);
                        inv.setProduct(product);
                        inv.setInStock(true);
                        inventoryRepository.save(inv);
                    }
                }
                System.out.println("Products seeded successfully!");
            }
        }

        // 3. Create or Update Managers for ALL branches
        List<Branch> allBranches = branchRepository.findAll();
        for (Branch branch : allBranches) {
            // Generate email based on branch name (e.g., "Simba Centenary" -> "centenary@simba.rw")
            String namePart = branch.getName().toLowerCase().replace("simba ", "").replace(" ", "");
            String email = namePart + "@simba.rw";
            
            // Special case for the original demo manager email if needed, but the pattern above handles it
            if (branch.getName().equals("Simba Centenary")) {
                // Keep the original manager@simba.rw as an alias or primary
                createOrEnableManager("manager@simba.rw", "Centenary Manager", branch);
            }
            
            createOrEnableManager(email, branch.getName() + " Manager", branch);
        }

        System.out.println("Data seeding process completed!");
    }

    private void createOrEnableManager(String email, String name, Branch branch) {
        Optional<User> managerOpt = userRepository.findByEmail(email);
        if (managerOpt.isEmpty()) {
            User manager = new User();
            manager.setName(name);
            manager.setEmail(email);
            manager.setPassword("{noop}password123");
            manager.setRole("MANAGER");
            manager.setProvider("LOCAL");
            manager.setEnabled(true);
            manager.setManagedBranch(branch);
            userRepository.save(manager);
            System.out.println("Manager created for: " + branch.getName() + " (" + email + ")");
        } else {
            User manager = managerOpt.get();
            boolean changed = false;
            if (!manager.isEnabled()) {
                manager.setEnabled(true);
                changed = true;
            }
            if (manager.getManagedBranch() == null) {
                manager.setManagedBranch(branch);
                changed = true;
            }
            if (changed) userRepository.save(manager);
        }
    }
}
