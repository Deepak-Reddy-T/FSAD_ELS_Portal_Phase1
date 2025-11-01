package com.school.equipmentlending.controller;

import com.school.equipmentlending.model.Equipment;
import com.school.equipmentlending.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {
    
    @Autowired
    private EquipmentService equipmentService;
    
    @GetMapping("/public/all")
    public List<Equipment> getAllEquipment() {
        return equipmentService.getAllEquipment();
    }
    
    @GetMapping("/public/available")
    public List<Equipment> getAvailableEquipment() {
        return equipmentService.getAvailableEquipment();
    }
    
    @GetMapping("/public/category/{category}")
    public List<Equipment> getEquipmentByCategory(@PathVariable String category) {
        return equipmentService.getEquipmentByCategory(category);
    }
    
    @GetMapping("/public/categories")
    public List<String> getAllCategories() {
        return equipmentService.getAllCategories();
    }
    
    @GetMapping("/public/search")
    public List<Equipment> searchEquipment(@RequestParam String name) {
        return equipmentService.searchEquipment(name);
    }
    
    @GetMapping("/public/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        Optional<Equipment> equipment = equipmentService.getEquipmentById(id);
        return equipment.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Equipment createEquipment(@RequestBody Equipment equipment) {
        return equipmentService.createEquipment(equipment);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable Long id, @RequestBody Equipment equipmentDetails) {
        Equipment updatedEquipment = equipmentService.updateEquipment(id, equipmentDetails);
        return ResponseEntity.ok(updatedEquipment);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok("Equipment deleted successfully");
    }
}
