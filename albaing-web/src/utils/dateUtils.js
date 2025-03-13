/**
 * 날짜 형식을 포맷팅하는 함수
 * @param {string} dateString - 포맷팅할 날짜 문자열
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * 날짜와 시간을 포맷팅하는 함수
 * @param {string} dateString - 포맷팅할 날짜 문자열
 * @returns {string} 포맷팅된 날짜와 시간 문자열
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * 날짜가 유효한지 확인하는 함수
 * @param {string} dateString - 확인할 날짜 문자열
 * @returns {boolean} 유효 여부
 */
export const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

/**
 * 두 날짜 사이의 일수를 계산하는 함수
 * @param {string} startDate - 시작 날짜
 * @param {string} endDate - 종료 날짜
 * @returns {number} 일수
 */
export const daysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * 날짜가 현재 기준으로 지났는지 확인하는 함수
 * @param {string} dateString - 확인할 날짜 문자열
 * @returns {boolean} 지난 날짜 여부
 */
export const isPastDate = (dateString) => {
    if (!dateString) return false;

    const date = new Date(dateString);
    const today = new Date();

    // 시간 부분 제거하고 날짜만 비교
    return date.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
};