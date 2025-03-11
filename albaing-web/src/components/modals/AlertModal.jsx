import React from 'react';
import Modal from './Modal';

/**
 * 알림 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} title - 모달 제목
 * @param {string} message - 알림 메시지
 * @param {string} confirmText - 확인 버튼 텍스트
 * @param {string} type - 알림 타입 (info, success, warning, error)
 * @param {function} onConfirm - 확인 버튼 클릭 시 콜백 함수 (있으면 onClose 대신 실행)
 */
const AlertModal = ({
                        isOpen,
                        onClose,
                        title = '알림',
                        message,
                        confirmText = '확인',
                        type = 'info',
                        onConfirm
                    }) => {
    const typeConfig = {
        info: {
            icon: (
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            buttonClass: 'bg-blue-600 hover:bg-blue-700',
        },
        success: {
            icon: (
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            buttonClass: 'bg-green-600 hover:bg-green-700',
        },
        warning: {
            icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
        },
        error: {
            icon: (
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            buttonClass: 'bg-red-600 hover:bg-red-700',
        },
    };

    // 확인 버튼 클릭 처리
    const handleConfirm = () => {
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-3">{typeConfig[type].icon}</div>
                <div className="flex-1">{message}</div>
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleConfirm}
                    className={`px-4 py-2 text-white rounded-md transition-colors ${typeConfig[type].buttonClass}`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default AlertModal;