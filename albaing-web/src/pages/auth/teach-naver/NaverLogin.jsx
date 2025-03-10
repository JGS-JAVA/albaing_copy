const NaverLogin = () => {
    // PathRoute 나 메인 페이지에서 로그인 버튼 연결 설정한 후 실행해보기

    const NAVER_AUTH_URL = "http://localhost:8080/oauth/naver/login";

    const handleNaverLogin = () => {
        window.location.href = NAVER_AUTH_URL;
    };

    return (
        <div className="NaverLogin-container">
            <button onClick={handleNaverLogin}>네이버 로그인</button>
        </div>
    )

};
export default NaverLogin;