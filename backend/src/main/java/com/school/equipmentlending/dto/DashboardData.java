package com.school.equipmentlending.dto;

public class DashboardData {
    private String adminName;
    private int totalEquipment;
    private int availableEquipment;
    private int borrowedEquipment;

    public DashboardData(String adminName, int totalEquipment, int availableEquipment, int borrowedEquipment) {
        this.adminName = adminName;
        this.totalEquipment = totalEquipment;
        this.availableEquipment = availableEquipment;
        this.borrowedEquipment = borrowedEquipment;
    }

    public String getAdminName() { return adminName; }
    public int getTotalEquipment() { return totalEquipment; }
    public int getAvailableEquipment() { return availableEquipment; }
    public int getBorrowedEquipment() { return borrowedEquipment; }
}
