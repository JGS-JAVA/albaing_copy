const KakaoLogin = () => {
    // PathRoute 나 메인 페이지에서 로그인 버튼 연결 설정한 후 실행해보기

    const KAKAO_AUTH_URL = "http://localhost:8080/oauth/kakao/login";

    const handleKakaoLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    return (
        <div className="KakaoLogin-container">
            <button onClick={handleKakaoLogin}>카카오 로그인</button>
        </div>
    )

};
export default KakaoLogin;