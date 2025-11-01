package com.school.equipmentlending.service;

import com.school.equipmentlending.dto.BorrowRequestDto;
import com.school.equipmentlending.model.BorrowRequest;
import com.school.equipmentlending.model.Equipment;
import com.school.equipmentlending.model.RequestStatus;
import com.school.equipmentlending.model.User;
import com.school.equipmentlending.repository.BorrowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowRequestService {
    
    @Autowired
    private BorrowRequestRepository borrowRequestRepository;
    
    @Autowired
    private EquipmentService equipmentService;
    
    @Autowired
    private UserService userService;
    
    public BorrowRequest createBorrowRequest(BorrowRequestDto borrowRequestDto) {
        User user = userService.getCurrentUser();
        
        
        if (user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Admin users cannot create borrow requests");
        }
        
        Equipment equipment = equipmentService.getEquipmentById(borrowRequestDto.getEquipmentId())
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        
        
        if (equipment.getAvailableQuantity() < borrowRequestDto.getQuantity()) {
            throw new RuntimeException("Insufficient equipment available");
        }
        
        BorrowRequest borrowRequest = new BorrowRequest(user, equipment, borrowRequestDto.getQuantity(), borrowRequestDto.getPurpose());
        return borrowRequestRepository.save(borrowRequest);
    }
    
    public List<BorrowRequest> getUserBorrowRequests() {
        User user = userService.getCurrentUser();
        return borrowRequestRepository.findByUserIdOrderByRequestDateDesc(user.getId());
    }
    
    public List<BorrowRequest> getPendingRequests() {
        return borrowRequestRepository.findByStatus(RequestStatus.PENDING);
    }
    
    public List<BorrowRequest> getAllRequests() {
        return borrowRequestRepository.findAll();
    }
    
    public Optional<BorrowRequest> getBorrowRequestById(Long id) {
        return borrowRequestRepository.findById(id);
    }
    
    public BorrowRequest approveRequest(Long requestId, String adminNotes) {
        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }
        
        
        if (request.getEquipment().getAvailableQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient equipment available");
        }
        
        request.setStatus(RequestStatus.APPROVED);
        request.setBorrowDate(LocalDateTime.now());
        request.setAdminNotes(adminNotes);
        
       
        equipmentService.updateAvailableQuantity(request.getEquipment().getId(), -request.getQuantity());
        
        return borrowRequestRepository.save(request);
    }
    
    public BorrowRequest rejectRequest(Long requestId, String adminNotes) {
        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }
        
        request.setStatus(RequestStatus.REJECTED);
        request.setAdminNotes(adminNotes);
        
        return borrowRequestRepository.save(request);
    }
    
    public BorrowRequest markAsBorrowed(Long requestId) {
        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (request.getStatus() != RequestStatus.APPROVED) {
            throw new RuntimeException("Request is not approved");
        }
        
        request.setStatus(RequestStatus.BORROWED);
        return borrowRequestRepository.save(request);
    }
    
    public BorrowRequest markAsReturned(Long requestId) {
        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (request.getStatus() != RequestStatus.BORROWED) {
            throw new RuntimeException("Request is not borrowed");
        }
        
        request.setStatus(RequestStatus.RETURNED);
        request.setReturnDate(LocalDateTime.now());
        
        
        equipmentService.updateAvailableQuantity(request.getEquipment().getId(), request.getQuantity());
        
        return borrowRequestRepository.save(request);
    }
}
