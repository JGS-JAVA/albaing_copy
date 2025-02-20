package com.jobjob.albaing.dto;

import lombok.*;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String userEmail;
    private String userPassword;
    private String userName;
    private Date userBirthdate;
    private Enum userGender;
    private String userPhone;
    private String userAddress;
    private String userProfileImage;
    private Timestamp userCreatedAt;
    private Timestamp userUpdatedAt;
    private Boolean userTermsAgreement;
    private Boolean userIsAdmin;

}
