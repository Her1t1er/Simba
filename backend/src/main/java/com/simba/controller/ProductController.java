package com.simba.controller;

import com.simba.model.Product;
import com.simba.service.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return productService.getAllCategories();
    }

    @PostMapping
    public Product addProduct(@RequestBody Map<String, Object> payload) {
        Product product = new Product();
        if (payload.containsKey("id") && payload.get("id") != null) {
            product.setId(Long.valueOf(payload.get("id").toString()));
        }
        product.setName((String) payload.get("name"));
        product.setPrice(Double.valueOf(payload.get("price").toString()));
        product.setUnit((String) payload.get("unit"));
        product.setImage((String) payload.get("image"));
        String categoryName = (String) payload.get("categoryName");
        return productService.saveProduct(product, categoryName);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Product product = new Product();
        product.setId(id);
        product.setName((String) payload.get("name"));
        product.setPrice(Double.valueOf(payload.get("price").toString()));
        product.setUnit((String) payload.get("unit"));
        product.setImage((String) payload.get("image"));
        String categoryName = (String) payload.get("categoryName");
        return productService.saveProduct(product, categoryName);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @DeleteMapping("/categories/{name}")
    public void deleteCategory(@PathVariable String name) {
        productService.deleteCategory(name);
    }

    @GetMapping("/health")
    public String health() {
        return "Backend is up and running!";
    }
}
