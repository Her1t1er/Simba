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
        if (branchRepository.count() > 0) return;

        // 1. Seed Branches
        List<String> branchNames = Arrays.asList(
            "Simba Centenary", "Simba Gishushu", "Simba Kimironko", "Simba Kicukiro",
            "Simba Kigali Height", "Simba UTC", "Simba Gacuriro", "Simba Gikondo",
            "Simba sonatube", "Simba Kisimenti", "Simba Rebero", "Simba Nyamirambo", "Simba Musanze"
        );
        for (String name : branchNames) {
            branchRepository.save(new Branch(name));
        }

        // 2. Load Products from JSON
        String jsonPath = "../src/data/simba_products.json";
        File file = new File(jsonPath);
        if (!file.exists()) {
            System.out.println("JSON data file not found at " + jsonPath);
            return;
        }

        byte[] jsonData = Files.readAllBytes(Paths.get(jsonPath));
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
            product.setId(node.get("id").asLong());
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

        // 3. Create a Demo Manager
        Branch firstBranch = branchRepository.findAll().get(0);
        User manager = new User();
        manager.setName("Demo Manager");
        manager.setEmail("manager@simba.rw");
        manager.setPassword("{noop}password123");
        manager.setRole("MANAGER");
        manager.setManagedBranch(firstBranch);
        userRepository.save(manager);

        System.out.println("Database seeded successfully!");
    }
}
