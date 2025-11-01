package com.school.equipmentlending.service;

import com.school.equipmentlending.model.Equipment;
import com.school.equipmentlending.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {
    
    @Autowired
    private EquipmentRepository equipmentRepository;
    
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }
    
    public List<Equipment> getAvailableEquipment() {
        return equipmentRepository.findByAvailableQuantityGreaterThan(0);
    }
    
    public List<Equipment> getEquipmentByCategory(String category) {
        return equipmentRepository.findAvailableByCategory(category);
    }
    
    public List<String> getAllCategories() {
        return equipmentRepository.findAllCategories();
    }
    
    public List<Equipment> searchEquipment(String name) {
        return equipmentRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }
    
    public Equipment createEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }
    
    public Equipment updateEquipment(Long id, Equipment equipmentDetails) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        
        equipment.setName(equipmentDetails.getName());
        equipment.setCategory(equipmentDetails.getCategory());
        equipment.setCondition(equipmentDetails.getCondition());
        equipment.setQuantity(equipmentDetails.getQuantity());
        equipment.setDescription(equipmentDetails.getDescription());
        
        // Update available quantity if total quantity changed
        int quantityDifference = equipmentDetails.getQuantity() - equipment.getQuantity();
        equipment.setAvailableQuantity(equipment.getAvailableQuantity() + quantityDifference);
        
        return equipmentRepository.save(equipment);
    }
    
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        equipmentRepository.delete(equipment);
    }
    
    public void updateAvailableQuantity(Long equipmentId, int quantityChange) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        
        int newAvailableQuantity = equipment.getAvailableQuantity() + quantityChange;
        if (newAvailableQuantity < 0 || newAvailableQuantity > equipment.getQuantity()) {
            throw new RuntimeException("Invalid quantity change");
        }
        
        equipment.setAvailableQuantity(newAvailableQuantity);
        equipmentRepository.save(equipment);
    }
}
