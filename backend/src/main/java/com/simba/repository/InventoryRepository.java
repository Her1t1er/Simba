package com.simba.repository;

import com.simba.model.Inventory;
import com.simba.model.Branch;
import com.simba.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByBranch(Branch branch);
    Optional<Inventory> findByBranchAndProduct(Branch branch, Product product);
    boolean existsByProduct(Product product);
}
