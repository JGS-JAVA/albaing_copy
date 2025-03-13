// ErrorHandler.js
import { useModal } from "../components";

// API 에러 메시지 해석 및 사용자 친화적 메시지 반환
export const getErrorMessage = (error) => {
    // API 응답에서 오류 메시지 추출
    const serverMessage = error.response?.data?.message;

    // HTTP 상태 코드 기반 에러 메시지
    if (error.response) {
        switch (error.response.status) {
            case 400:
                return serverMessage || "잘못된 요청입니다. 입력 정보를 확인해주세요.";
            case 401:
                return "로그인이 필요하거나 인증 정보가 만료되었습니다.";
            case 403:
                return "이 작업을 수행할 권한이 없습니다.";
            case 404:
                return serverMessage || "요청하신 정보를 찾을 수 없습니다.";
            case 409:
                return serverMessage || "요청이 현재 상태와 충돌합니다.";
            case 422:
                return serverMessage || "입력 정보를 처리할 수 없습니다. 다시 확인해주세요.";
            case 500:
                return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            default:
                return serverMessage || "오류가 발생했습니다. 다시 시도해주세요.";
        }
    }

    // 네트워크 오류
    if (error.message === 'Network Error') {
        return "네트워크 연결을 확인해주세요.";
    }

    // 기타 오류
    return error.message || "오류가 발생했습니다. 다시 시도해주세요.";
};

// axios 인터셉터 설정 함수
export const setupAxiosInterceptors = (axios, navigate) => {
    // 요청 인터셉터
    axios.interceptors.request.use(
        (config) => {
            // 요청 헤더에 토큰 추가 등의 작업 가능
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 응답 인터셉터
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // 401 에러(인증 실패)가 발생한 경우 로그인 페이지로 리다이렉트
            if (error.response && error.response.status === 401) {
                // 로컬 스토리지에서 토큰 제거 (로그아웃 처리)
                localStorage.removeItem('token');

                // 로그인 페이지로 리다이렉트 (중복 리다이렉트 방지)
                if (!window.location.pathname.includes('/login')) {
                    navigate('/login');
                }
            }

            return Promise.reject(error);
        }
    );
};

// 후크: 에러 모달 표시를 위한 편의 함수
export const useErrorHandler = () => {
    const alertModal = useModal();

    // 에러 처리 함수
    const handleError = (error, customMessage = null) => {
        const message = customMessage || getErrorMessage(error);

        alertModal.openModal({
            title: '오류 발생',
            message: message,
            type: 'error'
        });

        // 에러 콘솔 로깅 (개발 모드에서만)
        if (process.env.NODE_ENV === 'development') {
            console.error('Error details:', error);
        }

        return message;
    };

    return { handleError };
};