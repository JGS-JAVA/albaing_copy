package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.service.CompanyServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyServiceImpl companyService;


    // 회사 목록 조회 API
    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    // 회사 상세 정보 불러오기
    @GetMapping("/{companyId}")
    public ResponseEntity<Company> companyDetail(@PathVariable("companyId") long companyId) {
        Company company = companyService.companyDetail(companyId);
        return ResponseEntity.ok(company);
    }

    // 회사 상세 정보 수정
    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateCompany(@PathVariable Long companyId, @RequestBody Company company) {
        company.setCompanyId(companyId);
        companyService.updateDetail(company);
        return ResponseEntity.ok(company);
    }

    //회사 로고 수정
    @PostMapping("/{companyId}/logo")
    public ResponseEntity<String> updateLogo(
            @PathVariable Long companyId,
            @RequestParam("companyLogo") MultipartFile companyLogo) {

        try {
            if (companyLogo.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파일이 업로드 되지 않았습니다.");
            }

            // 서버에 파일 저장할 경로 설정
            String uploadDir = "C:/path/to/uploads";  // 파일 경로; 컴퓨터 환경에 맞춰서 변경해야 함
            File uploadDirectory = new File(uploadDir);
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();  // 디렉토리가 없으면 생성
            }

            // 파일 이름 설정
            String fileName = companyId + "_logo_" + companyLogo.getOriginalFilename();
            File file = new File(uploadDir, fileName);

            // 파일 저장
            companyLogo.transferTo(file);

            // 서버에서 접근 가능한 URL 생성 (HTTP URL)
            String logoUrl = "/uploads/" + fileName;

            // 데이터베이스에 로고 URL 저장
            int result = companyService.updateLogo(companyId, logoUrl);

            if (result > 0) {
                return ResponseEntity.ok(logoUrl);  
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("로고 업로드에 실패했습니다.");
            }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로고 업로드에 실패했습니다.");
        }
    }


    // 회사명으로 검색
    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompanies(@RequestParam("keyword") String keyword) {
        List<Company> companies = companyService.searchCompaniesByName(keyword);
        return ResponseEntity.ok(companies);
    }
}