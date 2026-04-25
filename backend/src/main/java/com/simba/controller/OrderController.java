package com.simba.controller;

import com.simba.dto.OrderRequestDTO;
import com.simba.dto.OrderResponseDTO;
import com.simba.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public OrderResponseDTO checkout(@RequestBody OrderRequestDTO request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<OrderResponseDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/branch/{branchName}")
    public List<OrderResponseDTO> getBranchOrders(@PathVariable String branchName) {
        return orderService.getOrdersByBranch(branchName);
    }

    @GetMapping("/customer")
    public List<OrderResponseDTO> getCustomerOrders(@RequestParam String email) {
        return orderService.getOrdersByCustomer(email);
    }

    @PatchMapping("/{id}/prepayment")
    public OrderResponseDTO updatePrepayment(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String declineReason) {
        return orderService.updatePrepaymentStatus(id, status, declineReason);
    }

    @PatchMapping("/{id}/status")
    public OrderResponseDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
    }

    @PatchMapping("/{id}/mark-read")
    public void markRead(@PathVariable Long id) {
        orderService.markNotificationAsRead(id);
    }
}
