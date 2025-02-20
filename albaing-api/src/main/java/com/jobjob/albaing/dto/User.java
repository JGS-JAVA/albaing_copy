package com.jobjob.albaing.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String userEmail;
    private String userPassword;
    private String userName;
    private String userBirthdate;
    private String userGender;
    private String userPhone;
    private String userAddress;
    private String userProfileImage;
    private String userCreatedAt;
    private String userUpdatedAt;
    private String userTermsAgrrement;
    private String userIsAdmin;

}
