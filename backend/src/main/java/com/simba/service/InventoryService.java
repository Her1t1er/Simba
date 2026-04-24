package com.simba.service;

import com.simba.model.*;
import com.simba.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final BranchRepository branchRepository;

    public InventoryService(InventoryRepository inventoryRepository, BranchRepository branchRepository) {
        this.inventoryRepository = inventoryRepository;
        this.branchRepository = branchRepository;
    }

    public List<Inventory> getInventoryByBranch(String branchName) {
        Branch branch = branchRepository.findByName(branchName);
        return inventoryRepository.findByBranch(branch);
    }

    @Transactional
    public Inventory toggleStock(Long inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));
        inventory.setInStock(!inventory.isInStock());
        return inventoryRepository.save(inventory);
    }
}
