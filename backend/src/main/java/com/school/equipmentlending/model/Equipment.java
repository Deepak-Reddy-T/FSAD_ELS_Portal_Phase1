package com.school.equipmentlending.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Entity
@Table(name = "equipment")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // To prevent proxy serialization issues
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 50)
    private String category;

    @NotBlank
    @Size(max = 20)
    @Column(name = "condition_text", length = 20)
    private String condition;

    @NotNull
    @Positive
    private Integer quantity;

    @NotNull
    @Positive
    private Integer availableQuantity;

    @Size(max = 500)
    private String description;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"equipment", "user", "hibernateLazyInitializer", "handler"})
    private List<BorrowRequest> borrowRequests;

    public Equipment() {}

    public Equipment(String name, String category, String condition, Integer quantity, String description) {
        this.name = name;
        this.category = category;
        this.condition = condition;
        this.quantity = quantity;
        this.availableQuantity = quantity; // initialize availableQuantity
        this.description = description;
    }

    // Automatically ensure availableQuantity is set before saving/updating
    @PrePersist
    @PreUpdate
    public void ensureAvailableQuantity() {
        if (availableQuantity == null) {
            availableQuantity = quantity;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<BorrowRequest> getBorrowRequests() {
        return borrowRequests;
    }

    public void setBorrowRequests(List<BorrowRequest> borrowRequests) {
        this.borrowRequests = borrowRequests;
    }

    public boolean isAvailable() {
        return availableQuantity != null && availableQuantity > 0;
    }
}
