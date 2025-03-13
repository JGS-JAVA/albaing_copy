import React, { useEffect } from 'react';

/**
 * 재사용 가능한 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} title - 모달 제목
 * @param {React.ReactNode} children - 모달 내용
 * @param {string} size - 모달 크기 (sm, md, lg, xl, full)
 * @param {boolean} showClose - 닫기 버튼 표시 여부
 * @param {boolean} closeOnOutsideClick - 외부 클릭 시 닫기 여부
 * @param {string} className - 추가 스타일 클래스
 */
const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   size = 'md',
                   showClose = true,
                   closeOnOutsideClick = true,
                   className = '',
               }) => {
    // 모달 열릴 때 body 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // 모달 크기에 따른 클래스
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl',
    };

    // 외부 클릭 시 모달 닫기
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && closeOnOutsideClick) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 animate-fadeIn overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all duration-300 animate-slideIn ${className}`}
            >
                {/* 모달 헤더 */}
                {title && (
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        {showClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* 모달 내용 */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Modal;