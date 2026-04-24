package com.simba.controller;

import com.simba.model.Inventory;
import com.simba.service.InventoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/branch/{branchName}")
    public List<Inventory> getBranchInventory(@PathVariable String branchName) {
        return inventoryService.getInventoryByBranch(branchName);
    }

    @PatchMapping("/{id}/toggle")
    public Inventory toggleStock(@PathVariable Long id) {
        return inventoryService.toggleStock(id);
    }
}
