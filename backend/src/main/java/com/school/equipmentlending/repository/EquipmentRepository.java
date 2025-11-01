package com.school.equipmentlending.repository;

import com.school.equipmentlending.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByCategory(String category);
    List<Equipment> findByAvailableQuantityGreaterThan(Integer quantity);
    List<Equipment> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT e FROM Equipment e WHERE e.category = :category AND e.availableQuantity > 0")
    List<Equipment> findAvailableByCategory(@Param("category") String category);
    
    @Query("SELECT DISTINCT e.category FROM Equipment e")
    List<String> findAllCategories();
}
