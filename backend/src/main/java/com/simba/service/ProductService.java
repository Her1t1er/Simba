package com.simba.service;

import com.simba.model.*;
import com.simba.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BranchRepository branchRepository;
    private final InventoryRepository inventoryRepository;

    public ProductService(ProductRepository productRepository, 
                          CategoryRepository categoryRepository,
                          BranchRepository branchRepository,
                          InventoryRepository inventoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.branchRepository = branchRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<String> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> c.getName())
                .collect(Collectors.toList());
    }

    @Transactional
    public Product saveProduct(Product product, String categoryName) {
        Category category = categoryRepository.findByName(categoryName);
        if (category == null) {
            category = categoryRepository.save(new Category(categoryName));
        }
        product.setCategory(category);
        
        boolean isNew = (product.getId() == null);
        Product savedProduct = productRepository.save(product);

        // If it's a new product or doesn't have inventory yet, add to inventory for all branches
        if (isNew || !inventoryRepository.existsByProduct(savedProduct)) {
            for (Branch branch : branchRepository.findAll()) {
                // Check if inventory already exists for this branch/product to avoid duplicates
                if (inventoryRepository.findByBranchAndProduct(branch, savedProduct).isEmpty()) {
                    Inventory inv = new Inventory();
                    inv.setBranch(branch);
                    inv.setProduct(savedProduct);
                    inv.setInStock(true);
                    inventoryRepository.save(inv);
                }
            }
        }
        
        return savedProduct;
    }

    @Transactional
    public void deleteProduct(Long id) {
        // First delete from inventory
        productRepository.findById(id).ifPresent(product -> {
            inventoryRepository.deleteAll(inventoryRepository.findAll().stream()
                .filter(i -> i.getProduct().getId().equals(id))
                .collect(Collectors.toList()));
            productRepository.deleteById(id);
        });
    }

    @Transactional
    public void deleteCategory(String name) {
        Category category = categoryRepository.findByName(name);
        if (category != null) {
            // Delete all products in this category (and their inventory)
            List<Product> products = productRepository.findByCategory(category);
            for (Product p : products) {
                deleteProduct(p.getId());
            }
            categoryRepository.delete(category);
        }
    }
}
