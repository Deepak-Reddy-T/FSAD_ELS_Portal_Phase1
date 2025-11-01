package com.school.equipmentlending.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_requests")
public class BorrowRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "borrowRequests"})
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "borrowRequests"})
    private Equipment equipment;
    
    @NotNull
    @Positive
    private Integer quantity;
    
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime requestDate;
    
    private LocalDateTime borrowDate;
    
    private LocalDateTime returnDate;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RequestStatus status;
    
    @Size(max = 500)
    private String purpose;
    
    @Size(max = 500)
    private String adminNotes;
    
    public BorrowRequest() {}
    
    public BorrowRequest(User user, Equipment equipment, Integer quantity, String purpose) {
        this.user = user;
        this.equipment = equipment;
        this.quantity = quantity;
        this.purpose = purpose;
        this.requestDate = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Equipment getEquipment() {
        return equipment;
    }
    
    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public LocalDateTime getRequestDate() {
        return requestDate;
    }
    
    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }
    
    public LocalDateTime getBorrowDate() {
        return borrowDate;
    }
    
    public void setBorrowDate(LocalDateTime borrowDate) {
        this.borrowDate = borrowDate;
    }
    
    public LocalDateTime getReturnDate() {
        return returnDate;
    }
    
    public void setReturnDate(LocalDateTime returnDate) {
        this.returnDate = returnDate;
    }
    
    public RequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(RequestStatus status) {
        this.status = status;
    }
    
    public String getPurpose() {
        return purpose;
    }
    
    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
    
    public String getAdminNotes() {
        return adminNotes;
    }
    
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
