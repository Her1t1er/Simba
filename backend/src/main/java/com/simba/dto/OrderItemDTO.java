package com.simba.dto;

public class OrderItemDTO {
    private Long productId;
    private Integer quantity;

    public OrderItemDTO() {}
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
