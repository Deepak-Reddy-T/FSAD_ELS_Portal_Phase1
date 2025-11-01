package com.school.equipmentlending.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class BorrowRequestDto {
    
    @NotNull
    private Long equipmentId;
    
    @NotNull
    @Positive
    private Integer quantity;
    
    @Size(max = 500)
    private String purpose;
    
    public BorrowRequestDto() {}
    
    public BorrowRequestDto(Long equipmentId, Integer quantity, String purpose) {
        this.equipmentId = equipmentId;
        this.quantity = quantity;
        this.purpose = purpose;
    }
    
    // Getters and Setters
    public Long getEquipmentId() {
        return equipmentId;
    }
    
    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public String getPurpose() {
        return purpose;
    }
    
    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
