package com.simba.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simba.model.*;
import com.simba.repository.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.io.InputStream;
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
    private final ResourceLoader resourceLoader;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository, 
                      BranchRepository branchRepository, InventoryRepository inventoryRepository, 
                      UserRepository userRepository, ResourceLoader resourceLoader) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.branchRepository = branchRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
        this.resourceLoader = resourceLoader;
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
        String[] possiblePaths = {
            "classpath:data/simba_products.json",
            "file:src/main/resources/data/simba_products.json",
            "file:../src/data/simba_products.json",
            "file:backend/src/main/resources/data/simba_products.json"
        };
        
        Resource resource = null;
        for (String path : possiblePaths) {
            Resource r = resourceLoader.getResource(path);
            if (r.exists()) {
                resource = r;
                break;
            }
        }

        if (resource == null) {
            System.out.println("JSON data file not found in any of the search locations (Resources).");
        } else {
            System.out.println("Checking products from resource: " + resource.getDescription());
            try (InputStream is = resource.getInputStream()) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(is);
                JsonNode productsNode = root.get("products");

                int addedCount = 0;
                for (JsonNode node : productsNode) {
                    Long id = node.get("id").asLong();
                    
                    // Check if product already exists
                    if (productRepository.existsById(id)) {
                        continue; 
                    }

                    String categoryName = node.get("category").asText();
                    Category category = categoryRepository.findByName(categoryName);
                    if (category == null) {
                        category = categoryRepository.save(new Category(categoryName));
                    }

                    Product product = new Product();
                    product.setId(id);
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
                    addedCount++;
                }
                if (addedCount > 0) {
                    System.out.println("Successfully added " + addedCount + " new products to the database!");
                }
            } catch (Exception e) {
                System.err.println("Error reading JSON file: " + e.getMessage());
            }
        }

        // 3. Create or Update Managers for ALL branches
        List<Branch> allBranches = branchRepository.findAll();
        for (Branch branch : allBranches) {
            // Generate email based on branch name (e.g., "Simba Centenary" -> "centenary@simba.rw")
            String namePart = branch.getName().toLowerCase().replace("simba ", "").replace(" ", "");
            String email = namePart + "@simba.rw";
            
            if (branch.getName().equals("Simba Centenary")) {
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
