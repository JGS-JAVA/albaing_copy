package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;

public interface FindService {

    User findUserEmail(String userName, String userPhone);

    Company findCompanyEmail(String companyName, String companyPhone);

}
