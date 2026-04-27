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
        try {
            // 1. Seed Branches FIRST
            long branchCount = 0;
            try {
                branchCount = branchRepository.count();
            } catch (Exception e) {
                System.out.println("Tables may not exist yet, skipping count check...");
            }

            if (branchCount == 0) {
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
        } catch (Exception e) {
            System.err.println("Initial branch seeding failed: " + e.getMessage());
            // If this fails, the rest will likely fail, so we stop here
            return;
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
            System.out.println("Loading products from: " + resource.getDescription());
            try (InputStream is = resource.getInputStream()) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(is);
                JsonNode productsNode = root.get("products");

                if (productsNode == null || !productsNode.isArray()) {
                    System.err.println("Error: 'products' node not found or is not an array in JSON");
                    return;
                }

                int addedCount = 0;
                int updatedCount = 0;
                
                for (JsonNode node : productsNode) {
                    Long id = node.get("id").asLong();
                    String categoryName = node.get("category").asText();
                    
                    // 1. Ensure Category exists
                    Category category = categoryRepository.findByName(categoryName);
                    if (category == null) {
                        category = categoryRepository.save(new Category(categoryName));
                        System.out.println("Created missing category: " + categoryName);
                    }

                    // 2. Get or Create Product
                    Product product;
                    Optional<Product> existingProduct = productRepository.findById(id);
                    if (existingProduct.isPresent()) {
                        product = existingProduct.get();
                        // Update category link if it's wrong or missing
                        if (product.getCategory() == null || !product.getCategory().getName().equals(categoryName)) {
                            product.setCategory(category);
                            productRepository.save(product);
                        }
                        updatedCount++;
                    } else {
                        product = new Product();
                        product.setId(id);
                        product.setName(node.get("name").asText());
                        product.setPrice(node.get("price").asDouble());
                        product.setUnit(node.get("unit").asText());
                        product.setImage(node.get("image").asText());
                        product.setInStock(node.has("inStock") ? node.get("inStock").asBoolean() : true);
                        product.setCategory(category);
                        product = productRepository.save(product);
                        addedCount++;
                    }

                    // 3. Ensure Inventory exists for ALL branches for this product
                    List<Branch> allBranches = branchRepository.findAll();
                    for (Branch branch : allBranches) {
                        if (inventoryRepository.findByBranchAndProduct(branch, product).isEmpty()) {
                            Inventory inv = new Inventory();
                            inv.setBranch(branch);
                            inv.setProduct(product);
                            inv.setInStock(true);
                            inventoryRepository.save(inv);
                        }
                    }
                }
                System.out.println("Seeding Summary: Added " + addedCount + ", Verified/Updated " + updatedCount + " products.");
            } catch (Exception e) {
                System.err.println("Error reading JSON file: " + e.getMessage());
                e.printStackTrace();
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
            System.out.println("Manager created: " + email + " for branch " + branch.getName());
        } else {
            User manager = managerOpt.get();
            manager.setRole("MANAGER");
            manager.setManagedBranch(branch);
            manager.setEnabled(true);
            userRepository.save(manager);
        }
    }
}
