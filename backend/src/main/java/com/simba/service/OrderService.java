package com.simba.service;

import com.simba.dto.OrderRequestDTO;
import com.simba.dto.OrderResponseDTO;
import com.simba.model.*;
import com.simba.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, BranchRepository branchRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.branchRepository = branchRepository;
    }

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        Branch branch = branchRepository.findByName(request.getBranchName());
        if (branch == null) throw new RuntimeException("Branch not found");

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setPickupNotes(request.getPickupNotes());
        order.setBranch(branch);
        order.setPrepaymentStatus("PENDING");
        order.setOrderStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();
        for (var itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());
            items.add(item);
        }

        double total = items.stream()
                .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
                .sum();

        order.setItems(items);
        order.setTotal(total);
        order.setPrepaymentAmount(total * 0.10);
        order.setBalanceDue(total * 0.90);

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderResponseDTO> getOrdersByBranch(String branchName) {
        Branch branch = branchRepository.findByName(branchName);
        return orderRepository.findByBranch(branch).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDTO updatePrepaymentStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setPrepaymentStatus(status);
        if ("verified".equalsIgnoreCase(status)) {
            order.setOrderStatus("PROCESSING");
        }
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(status);
        return mapToResponse(orderRepository.save(order));
    }

    private OrderResponseDTO mapToResponse(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPrepaymentStatus(order.getPrepaymentStatus());
        dto.setTotal(order.getTotal());
        dto.setPrepaymentAmount(order.getPrepaymentAmount());
        dto.setBalanceDue(order.getBalanceDue());
        dto.setBranchName(order.getBranch().getName());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}
