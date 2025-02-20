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
public class User {
    @Id  // Indicates that this field is the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-generate values for the primary key (e.g., auto-increment)
    private Long userId;

    private String userEmail;
    private String userPassword;
    private String userName;
    private Date userBirthdate;
    private Gender userGender;
    private String userPhone;
    private String userAddress;
    private String userProfileImage;
    private LocalDateTime userCreatedAt;
    private LocalDateTime userUpdatedAt;
    private Boolean userTermsAgreement;
    private Boolean userIsAdmin;

    public enum Gender {
        MALE,
        FEMALE,
        OTHER
    }
}
