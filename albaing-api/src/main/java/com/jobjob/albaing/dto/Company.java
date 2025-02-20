package com.jobjob.albaing.dto;

import lombok.*;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    private String companyName;
    private String companyRegistrationNumber;
    private String companyOwnerName;
    private Date companyOpenDate;
    private String companyPassword;
    private String companyEmail;
    private String companyPhone;
    private String companyLocalAddress;
    private Enum companyApprovalStatus;
    private Timestamp companyCreatedAt;
    private Timestamp companyUpdatedAt;
    private String companyLogo;
    private String companyDescription;

}
