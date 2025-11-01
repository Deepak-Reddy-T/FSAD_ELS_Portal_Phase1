package com.school.equipmentlending.controller;

import com.school.equipmentlending.dto.BorrowRequestDto;
import com.school.equipmentlending.model.BorrowRequest;
import com.school.equipmentlending.service.BorrowRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
public class BorrowRequestController {
    
    @Autowired
    private BorrowRequestService borrowRequestService;
    
    @PostMapping
    public ResponseEntity<BorrowRequest> createBorrowRequest(@Valid @RequestBody BorrowRequestDto borrowRequestDto) {
        BorrowRequest request = borrowRequestService.createBorrowRequest(borrowRequestDto);
        return ResponseEntity.ok(request);
    }
    
    @GetMapping("/my-requests")
    public List<BorrowRequest> getUserBorrowRequests() {
        return borrowRequestService.getUserBorrowRequests();
    }
    
    @GetMapping("/pending")
    public List<BorrowRequest> getPendingRequests() {
        return borrowRequestService.getPendingRequests();
    }
    
    @GetMapping("/all")
    public List<BorrowRequest> getAllRequests() {
        return borrowRequestService.getAllRequests();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BorrowRequest> getBorrowRequestById(@PathVariable Long id) {
        Optional<BorrowRequest> request = borrowRequestService.getBorrowRequestById(id);
        return request.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<BorrowRequest> approveRequest(@PathVariable Long id, @RequestBody(required = false) String adminNotes) {
        BorrowRequest request = borrowRequestService.approveRequest(id, adminNotes);
        return ResponseEntity.ok(request);
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<BorrowRequest> rejectRequest(@PathVariable Long id, @RequestBody(required = false) String adminNotes) {
        BorrowRequest request = borrowRequestService.rejectRequest(id, adminNotes);
        return ResponseEntity.ok(request);
    }
    
    @PutMapping("/{id}/borrowed")
    public ResponseEntity<BorrowRequest> markAsBorrowed(@PathVariable Long id) {
        BorrowRequest request = borrowRequestService.markAsBorrowed(id);
        return ResponseEntity.ok(request);
    }
    
    @PutMapping("/{id}/returned")
    public ResponseEntity<BorrowRequest> markAsReturned(@PathVariable Long id) {
        BorrowRequest request = borrowRequestService.markAsReturned(id);
        return ResponseEntity.ok(request);
    }
}
