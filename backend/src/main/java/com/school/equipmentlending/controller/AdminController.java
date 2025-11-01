package com.school.equipmentlending.controller;

import com.school.equipmentlending.model.Equipment;
import com.school.equipmentlending.model.User;
import com.school.equipmentlending.service.EquipmentService;
import com.school.equipmentlending.service.UserService;
import com.school.equipmentlending.dto.DashboardData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private EquipmentService equipmentService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardData> getDashboardData() {
        User currentUser = userService.getCurrentUser();
        List<Equipment> allEquipment = equipmentService.getAllEquipment();
        List<Equipment> availableEquipment = equipmentService.getAvailableEquipment();

        DashboardData payload = new DashboardData(
            currentUser.getFirstName() + " " + currentUser.getLastName(),
            allEquipment.size(),
            availableEquipment.size(),
            allEquipment.size() - availableEquipment.size()
        );
        return ResponseEntity.ok(payload);
    }
}
