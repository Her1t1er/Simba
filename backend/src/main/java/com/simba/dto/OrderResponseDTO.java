package com.simba.dto;

import java.time.LocalDateTime;

public class OrderResponseDTO {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String orderStatus;
    private String prepaymentStatus;
    private Double total;
    private Double prepaymentAmount;
    private Double balanceDue;
    private String branchName;
    private LocalDateTime createdAt;

    public OrderResponseDTO() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
    public String getPrepaymentStatus() { return prepaymentStatus; }
    public void setPrepaymentStatus(String prepaymentStatus) { this.prepaymentStatus = prepaymentStatus; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public Double getPrepaymentAmount() { return prepaymentAmount; }
    public void setPrepaymentAmount(Double prepaymentAmount) { this.prepaymentAmount = prepaymentAmount; }
    public Double getBalanceDue() { return balanceDue; }
    public void setBalanceDue(Double balanceDue) { this.balanceDue = balanceDue; }
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
