package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.CompanyMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CompanyMapper companyMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // 비밀번호 인코더 주입

    // 유저  로그인
    @Override
    public Map<String, Object> loginUser(String userEmail, String userPassword) {
        Map<String, Object> param = new HashMap<>();
        param.put("userEmail", userEmail);

        User loggedInUser = userMapper.loginUser(param); // 변경된 부분
        Map<String, Object> result = new HashMap<>();

        if (loggedInUser != null && passwordEncoder.matches(userPassword, loggedInUser.getUserPassword())) {
            result.put("status", "success");
            result.put("user", loggedInUser);
            result.put("redirect", "/");
        } else {
            result.put("status", "fail");
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        return result;
    }

    // 기업  로그인
    @Override
    public Map<String, Object> loginCompany(String companyEmail, String companyPassword) {
        Map<String, Object> param = new HashMap<>();
        param.put("companyEmail", companyEmail);

        Company loggedInCompany = companyMapper.loginCompany(param); // 변경된 부분
        Map<String, Object> result = new HashMap<>();

        if (loggedInCompany != null && passwordEncoder.matches(companyPassword, loggedInCompany.getCompanyPassword())) {
            result.put("status", "success");
            result.put("company", loggedInCompany);
            result.put("redirect", "/");
        } else {
            result.put("status", "fail");
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        return result;
    }


    // 유저 회원가입
    @Override
    public void registerUser(User user) {

        // 필수 값 검증: 이메일, 비밀번호, 이름
        if (user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
        }
        if (user.getUserPassword() == null || user.getUserPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 입력 사항입니다.");
        }
        if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
            throw new IllegalArgumentException("이름은 필수 입력 사항입니다.");
        }

        // 이메일 형식 검증 (정규식 사용)
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if (!user.getUserEmail().matches(emailRegex)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }

        // 비밀번호 형식 검증 (최소 8자, 숫자/특수문자 포함)
        String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$";
        if (!user.getUserPassword().matches(passwordRegex)) {
            throw new IllegalArgumentException("비밀번호는 최소 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.");
        }

        // 이름 형식 검증 (정규식 사용)
        String nameRegex = "^[가-힣]{2,}$";
        if (!user.getUserName().matches(nameRegex)) {
            throw new IllegalArgumentException("이름은 최소 2자 이상 한글이어야 합니다.");
        }

        // 추가 검증 로직 (생년월일이 미래 날짜인지 체크)
        if (user.getUserBirthdate() != null && user.getUserBirthdate().after(new Date())) {
            throw new IllegalArgumentException("생년월일은 미래 날짜일 수 없습니다.");
        }

        // 추가 검증 로직 (핸드폰번호 정규식사용)
        String phoneRegex = "^01[016789]-?\\d{3,4}-?\\d{4,}$";
        if (!user.getUserPhone().matches(phoneRegex)) {
            throw new IllegalArgumentException("유효하지 않은 전화번호 형식입니다.");
        }

        // 비밀번호 암호화
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));

        // 회원가입 날짜 설정
        user.setUserCreatedAt(LocalDateTime.now());
        user.setUserUpdatedAt(LocalDateTime.now());

        // 기본값 설정
        if (user.getUserIsAdmin() == null) {
            user.setUserIsAdmin(false);
        }

        // 모든 검증 통과 후, 등록 처리
        userMapper.registerUser(user);
    }

    @Override
    public void registerCompany(Company company) {
        // 필수 값 검증
        if (company.getCompanyRegistrationNumber() == null || company.getCompanyRegistrationNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("사업자 등록번호는 필수 입력 사항입니다.");
        }
        if (company.getCompanyEmail() == null || company.getCompanyEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
        }
        if (company.getCompanyPassword() == null || company.getCompanyPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 입력 사항입니다.");
        }
        if (company.getCompanyOwnerName() == null || company.getCompanyOwnerName().trim().isEmpty()) {
            throw new IllegalArgumentException("대표자 이름은 필수 입력 사항입니다.");
        }
        if (company.getCompanyName() == null || company.getCompanyName().trim().isEmpty()) {
            throw new IllegalArgumentException("상호명은 필수 입력 사항입니다.");
        }
        if (company.getCompanyOpenDate() == null) {
            throw new IllegalArgumentException("개업일은 필수 입력 사항입니다.");
        }
        if (company.getCompanyLocalAddress() == null || company.getCompanyLocalAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("사업장 주소는 필수 입력 사항입니다.");
        }

        // 사업자 등록번호 형식 검증
        String registrationNumberRegex = "^\\d{3}-\\d{2}-\\d{5}$";
        if (!company.getCompanyRegistrationNumber().matches(registrationNumberRegex)) {
            throw new IllegalArgumentException("유효하지 않은 사업자 등록번호 형식입니다. (예: 123-45-67890)");
        }

        // 이메일 형식 검증
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        if (!company.getCompanyEmail().matches(emailRegex)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }

        // 비밀번호 형식 검증 (최소 8자, 숫자/특수문자 포함)
        String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$";
        if (!company.getCompanyPassword().matches(passwordRegex)) {
            throw new IllegalArgumentException("비밀번호는 최소 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.");
        }

        // 대표자 이름 형식 검증 (한글 2자 이상)
        String nameRegex = "^[가-힣]{2,}$";
        if (!company.getCompanyOwnerName().matches(nameRegex)) {
            throw new IllegalArgumentException("대표자 이름은 최소 2자 이상 한글이어야 합니다.");
        }

        // 개업일이 미래 날짜인지 체크
        Date today = new Date();
        if (company.getCompanyOpenDate().after(today)) {
            throw new IllegalArgumentException("개업일은 미래 날짜일 수 없습니다.");
        }

        // 전화번호 형식 검증 (국내 전화번호)
        String phoneRegex = "^\\d{2,3}-\\d{3,4}-\\d{4}$";
        if (!company.getCompanyPhone().matches(phoneRegex)) {
            throw new IllegalArgumentException("유효하지 않은 전화번호 형식입니다. (예: 02-1234-5678)");
        }

        // 비밀번호 암호화
        company.setCompanyPassword(passwordEncoder.encode(company.getCompanyPassword()));

        // 회원가입 날짜 설정
        company.setCompanyCreatedAt(LocalDateTime.now());
        company.setCompanyUpdatedAt(LocalDateTime.now());

        // 기본값 설정
        if (company.getCompanyApprovalStatus() == null) {
            company.setCompanyApprovalStatus(Company.ApprovalStatus.approving);
        }

        // 모든 검증 통과 후, 등록 처리
        companyMapper.registerCompany(company);
    }
}
