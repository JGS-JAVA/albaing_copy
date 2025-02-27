import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// 컴포넌트 임포트
import Header from './components/Header';
import Footer from './components/Footer';

// 페이지 임포트
import Home from './pages/home/Home';
import AdminMain from './pages/admin/AdminMain';
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

function PathRoute() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 메인페이지 */}
                <Route path="/" element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                } />

                {/* 로그인 관련 페이지 */}
                <Route path="/login" element={
                    <MainLayout>
                        <Login />
                    </MainLayout>
                } />

                {/* 회사 관련 페이지 */}
                <Route path="/company" element={
                    <MainLayout>
                        <CompanyMain />
                    </MainLayout>
                } />
                <Route path="/company/detail/:id" element={
                    <MainLayout>
                        <CompanyDetail />
                    </MainLayout>
                } />
                <Route path="/company/review" element={
                    <MainLayout>
                        <CompanyReview />
                    </MainLayout>
                } />
                <Route path="/company/review/post" element={
                    <MainLayout>
                        <CompanyReviewPost />
                    </MainLayout>
                } />

                {/* 채용 공고 관련 페이지 */}
                <Route path="/jobpost/add" element={
                    <MainLayout>
                        <JobpostAdd />
                    </MainLayout>
                } />
                <Route path="/jobpost/detail/:id" element={
                    <MainLayout>
                        <JobpostDetail />
                    </MainLayout>
                } />
                <Route path="/jobpost/edit/:id" element={
                    <MainLayout>
                        <JobpostEdit />
                    </MainLayout>
                } />
                <Route path="/jobpost/list" element={
                    <MainLayout>
                        <JobpostList />
                    </MainLayout>
                } />

                {/* 마이페이지 관련 페이지 */}
                <Route path="/mypage" element={
                    <MainLayout>
                        <MyPage />
                    </MainLayout>
                } />
                <Route path="/mypage/my-application" element={
                    <MainLayout>
                        <MyApplication />
                    </MainLayout>
                } />
                <Route path="/mypage/my-scrap" element={
                    <MainLayout>
                        <MyScrap />
                    </MainLayout>
                } />
                <Route path="/mypage/my-reviews" element={
                    <MainLayout>
                        <MyReviews />
                    </MainLayout>
                } />

                {/* 회원가입 관련 페이지 */}
                <Route path="/register/success" element={
                    <MainLayout>
                        <RegistrationSuccess />
                    </MainLayout>
                } />
                <Route path="/register/company" element={
                    <MainLayout>
                        <RegisterCompany />
                    </MainLayout>
                } />
                <Route path="/register/person" element={
                    <MainLayout>
                        <RegisterPerson />
                    </MainLayout>
                } />

                {/* 비밀번호/아이디 찾기 페이지 */}
                <Route path="/find/id" element={
                    <MainLayout>
                        <FindId />
                    </MainLayout>
                } />
                <Route path="/find/id/result" element={
                    <MainLayout>
                        <FindIdResult />
                    </MainLayout>
                } />
                <Route path="/find/password" element={
                    <MainLayout>
                        <FindPassword />
                    </MainLayout>
                } />
                <Route path="/find/password/result" element={
                    <MainLayout>
                        <FindPasswordResult />
                    </MainLayout>
                } />

                {/* 이력서 관련 페이지 */}
                <Route path="/resume" element={
                    <MainLayout>
                        <Resume />
                    </MainLayout>
                } />
                <Route path="/resume/edit" element={
                    <MainLayout>
                        <ResumeEdit />
                    </MainLayout>
                } />

                {/* 어드민 관련 페이지 */}
                <Route path="/admin" element={
                    <MainLayout>
                        <AdminMain />
                    </MainLayout>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default PathRoute;