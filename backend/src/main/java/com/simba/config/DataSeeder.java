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
            System.out.println("Starting data seeding process...");
            
            // 1. Seed Branches
            if (isTableEmpty(branchRepository)) {
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

            // 2. Seed Products
            seedProducts();

            // 3. Seed Managers
            seedManagers();

            System.out.println("Data seeding process completed successfully!");
        } catch (Exception e) {
            System.err.println("WARNING: Data seeding skipped or failed. This usually happens if the database schema is still being created. Error: " + e.getMessage());
        }
    }

    private boolean isTableEmpty(org.springframework.data.jpa.repository.JpaRepository<?, ?> repo) {
        try {
            return repo.count() == 0;
        } catch (Exception e) {
            return true; // Assume empty if table doesn't exist
        }
    }

    private void seedProducts() {
        String[] possiblePaths = {
            "classpath:data/simba_products.json",
            "file:src/main/resources/data/simba_products.json",
            "file:../src/data/simba_products.json",
            "file:backend/src/main/resources/data/simba_products.json"
        };
        
        Resource resource = null;
        for (String path : possiblePaths) {
            try {
                Resource r = resourceLoader.getResource(path);
                if (r.exists()) {
                    resource = r;
                    break;
                }
            } catch (Exception e) {}
        }

        if (resource == null) {
            System.out.println("No product data file found, skipping product seeding.");
            return;
        }

        System.out.println("Loading products from: " + resource.getDescription());
        try (InputStream is = resource.getInputStream()) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(is);
            JsonNode productsNode = root.get("products");

            if (productsNode == null || !productsNode.isArray()) return;

            int addedCount = 0;
            int updatedCount = 0;
            
            for (JsonNode node : productsNode) {
                try {
                    Long id = node.get("id").asLong();
                    String name = node.has("name") ? node.get("name").asText() : "Unknown";
                    String categoryName = node.has("category") ? node.get("category").asText() : "General";
                    double price = node.has("price") ? node.get("price").asDouble() : 0.0;
                    String unit = node.has("unit") ? node.get("unit").asText() : "Pcs";
                    String image = node.has("image") ? node.get("image").asText() : "";
                    
                    Category category = categoryRepository.findByName(categoryName);
                    if (category == null) {
                        category = categoryRepository.save(new Category(categoryName));
                    }

                    Product product;
                    Optional<Product> existingProduct = productRepository.findById(id);
                    if (existingProduct.isPresent()) {
                        product = existingProduct.get();
                        product.setName(name);
                        product.setPrice(price);
                        product.setUnit(unit);
                        product.setImage(image);
                        product.setCategory(category);
                        productRepository.save(product);
                        updatedCount++;
                    } else {
                        product = new Product();
                        product.setId(id);
                        product.setName(name);
                        product.setPrice(price);
                        product.setUnit(unit);
                        product.setImage(image);
                        product.setInStock(node.has("inStock") ? node.get("inStock").asBoolean() : true);
                        product.setCategory(category);
                        product = productRepository.save(product);
                        addedCount++;
                    }

                    for (Branch branch : branchRepository.findAll()) {
                        if (inventoryRepository.findByBranchAndProduct(branch, product).isEmpty()) {
                            Inventory inv = new Inventory();
                            inv.setBranch(branch);
                            inv.setProduct(product);
                            inv.setInStock(true);
                            inventoryRepository.save(inv);
                        }
                    }
                } catch (Exception e) {}
            }
            System.out.println("Product Seeding: Added " + addedCount + ", Updated/Verified " + updatedCount);
        } catch (Exception e) {
            System.err.println("Error reading product JSON: " + e.getMessage());
        }
    }

    private void seedManagers() {
        try {
            List<Branch> allBranches = branchRepository.findAll();
            for (Branch branch : allBranches) {
                String namePart = branch.getName().toLowerCase().replace("simba ", "").replace(" ", "");
                String email = namePart + "@simba.rw";
                
                if (branch.getName().equals("Simba Centenary")) {
                    createOrEnableManager("manager@simba.rw", "Centenary Manager", branch);
                }
                createOrEnableManager(email, branch.getName() + " Manager", branch);
            }
        } catch (Exception e) {}
    }

    private void createOrEnableManager(String email, String name, Branch branch) {
        try {
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
                System.out.println("Manager created: " + email);
            } else {
                User manager = managerOpt.get();
                manager.setRole("MANAGER");
                manager.setManagedBranch(branch);
                manager.setEnabled(true);
                userRepository.save(manager);
            }
        } catch (Exception e) {}
    }
}
