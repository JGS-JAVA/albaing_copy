package com.jobjob.albaing.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    @Id  // Indicates that this field is the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-generate values for the primary key (e.g., auto-increment)
    private Long companyId;

    private String companyName;
    private String companyRegistrationNumber;
    private String companyOwnerName;
    private Date companyOpenDate;
    private String companyPassword;
    private String companyEmail;
    private String companyPhone;
    private String companyLocalAddress;
    private ApprovalStatus companyApprovalStatus;
    private LocalDateTime companyCreatedAt;
    private LocalDateTime companyUpdatedAt;
    private String companyLogo;
    private String companyDescription;

    public enum ApprovalStatus {
        APPROVED, APPROVING, HIDDEN
    }

}
