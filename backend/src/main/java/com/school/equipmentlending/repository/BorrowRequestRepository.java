package com.school.equipmentlending.repository;

import com.school.equipmentlending.model.BorrowRequest;
import com.school.equipmentlending.model.RequestStatus;
import com.school.equipmentlending.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
    List<BorrowRequest> findByUser(User user);
    List<BorrowRequest> findByStatus(RequestStatus status);
    List<BorrowRequest> findByUserAndStatus(User user, RequestStatus status);
    
    @Query("SELECT br FROM BorrowRequest br WHERE br.equipment.id = :equipmentId AND br.status IN ('APPROVED', 'BORROWED')")
    List<BorrowRequest> findActiveRequestsByEquipment(@Param("equipmentId") Long equipmentId);
    
    @Query("SELECT br FROM BorrowRequest br WHERE br.user.id = :userId ORDER BY br.requestDate DESC")
    List<BorrowRequest> findByUserIdOrderByRequestDateDesc(@Param("userId") Long userId);
}
