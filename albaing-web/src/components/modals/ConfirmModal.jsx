import React from 'react';
import Modal from './Modal';

/**
 * 확인 모달 컴포넌트
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 함수 (취소 시)
 * @param {function} onConfirm - 확인 버튼 클릭 시 콜백 함수
 * @param {string} title - 모달 제목
 * @param {string} message - 확인 메시지
 * @param {string} confirmText - 확인 버튼 텍스트
 * @param {string} cancelText - 취소 버튼 텍스트
 * @param {boolean} isDestructive - 위험한 작업(삭제 등) 여부
 */
const ConfirmModal = ({
                          isOpen,
                          onClose,
                          onConfirm,
                          title = '확인',
                          message,
                          confirmText = '확인',
                          cancelText = '취소',
                          isDestructive = false,
                      }) => {
    // 확인 버튼 클릭 시
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="mb-6">
                <p className="text-gray-700">{message}</p>
            </div>
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className={`px-4 py-2 text-white rounded-md transition-colors ${
                        isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;