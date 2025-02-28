import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';


import Home from './pages/home/Home';
import CompanyDetail from './pages/company/CompanyDetail';
import CompanyMain from './pages/company/CompanyMain';
import CompanyReview from './pages/company/CompanyReview';
import CompanyReviewPost from './pages/company/CompanyReviewPost';
import FindId from './pages/find/FindId';
import FindIdResult from './pages/find/FindIdResult';
import FindPassword from './pages/find/FindPassword';
import FindPasswordResult from './pages/find/FindPasswordResult';
import JobpostAdd from './pages/jobpost/JobpostAdd';
import JobpostDetail from './pages/jobpost/JobpostDetail';
import JobpostEdit from './pages/jobpost/JobpostEdit';
import JobpostList from './pages/jobpost/JobpostList';
import Login from './pages/login/Login';
import MyApplication from './pages/mypage/MyApplication';
import MyPage from './pages/mypage/MyPage';
import MyScrap from './pages/mypage/MyScrap';
import MyReviews from './pages/mypage/MyReviews';
import RegistrationSuccess from './pages/register/success/RegistrationSuccess';
import RegisterCompany from './pages/register/RegisterCompany';
import RegisterPerson from './pages/register/RegisterPerson';
import Resume from './pages/resume/Resume';
import ResumeEdit from './pages/resume/ResumeEdit';

// 메인 레이아웃 컴포넌트
const MainLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <div className="content-container">
                {children}
            </div>
        </main>
        <Footer />
    </div>
);

function AdminMain() {
    return null;
}

function PathRoute() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 모든 사용자 접근 가능 */}
                <Route path="/" element={<MainLayout><Home /></MainLayout>} /> {/* 메인 홈페이지 */}
                <Route path="/login" element={<MainLayout><Login /></MainLayout>} /> {/* 로그인 페이지 */}
                <Route path="/register/success" element={<MainLayout><RegistrationSuccess /></MainLayout>} /> {/* 회원가입 성공 페이지 */}
                <Route path="/register/person" element={<MainLayout><RegisterPerson /></MainLayout>} /> {/* 개인 회원가입 페이지 */}
                <Route path="/register/company" element={<MainLayout><RegisterCompany /></MainLayout>} /> {/* 기업 회원가입 페이지 */}
                <Route path="/find/id" element={<MainLayout><FindId /></MainLayout>} /> {/* 아이디 찾기 페이지 */}
                <Route path="/find/id/result" element={<MainLayout><FindIdResult /></MainLayout>} /> {/* 아이디 찾기 결과 페이지 */}
                <Route path="/find/password" element={<MainLayout><FindPassword /></MainLayout>} /> {/* 비밀번호 찾기 페이지 */}
                <Route path="/find/password/result" element={<MainLayout><FindPasswordResult /></MainLayout>} /> {/* 비밀번호 찾기 결과 페이지 */}
                <Route path="/companies" element={<MainLayout><CompanyMain /></MainLayout>} /> {/* 회사 목록 페이지 */}
                <Route path="/companies/:id" element={<MainLayout><CompanyDetail /></MainLayout>} /> {/* 회사 상세 정보 페이지 */}
                <Route path="/jobs" element={<MainLayout><JobpostList /></MainLayout>} /> {/* 채용공고 목록 페이지 */}
                <Route path="/jobs/:id" element={<MainLayout><JobpostDetail /></MainLayout>} /> {/* 채용공고 상세 페이지 */}

                {/* 일반 사용자만 접근 가능 */}
                <Route path="/mypage" element={<MainLayout><MyPage /></MainLayout>} /> {/* 일반 사용자 마이페이지 메인 */}
                <Route path="/mypage/applications" element={<MainLayout><MyApplication /></MainLayout>} /> {/* 일반 사용자 지원 내역 페이지 */}
                <Route path="/mypage/scraps" element={<MainLayout><MyScrap /></MainLayout>} /> {/* 일반 사용자 스크랩 목록 페이지 */}
                <Route path="/mypage/reviews" element={<MainLayout><MyReviews /></MainLayout>} /> {/* 일반 사용자 작성 리뷰 목록 페이지 */}
                <Route path="/resumes" element={<MainLayout><Resume /></MainLayout>} /> {/* 이력서 조회 페이지 */}
                <Route path="/resumes/edit" element={<MainLayout><ResumeEdit /></MainLayout>} /> {/* 이력서 편집 페이지 */}
                <Route path="/companies/reviews/new" element={<MainLayout><CompanyReviewPost /></MainLayout>} /> {/* 회사 리뷰 작성 페이지 */}

                {/* 기업 사용자만 접근 가능 */}
                <Route path="/jobs/new" element={<MainLayout><JobpostAdd /></MainLayout>} /> {/* 채용공고 등록 페이지 */}
                <Route path="/jobs/:id/edit" element={<MainLayout><JobpostEdit /></MainLayout>} /> {/* 채용공고 편집 페이지 */}

                {/* 로그인한 모든 사용자 접근 가능 */}
                <Route path="/companies/reviews" element={<MainLayout><CompanyReview /></MainLayout>} /> {/* 회사 리뷰 목록 페이지 */}

                {/* 관리자만 접근 가능 */}
                <Route path="/admin" element={<MainLayout><AdminMain /></MainLayout>} /> {/* 관리자 대시보드 페이지 */}
            </Routes>
        </BrowserRouter>
    );
}

export default PathRoute;