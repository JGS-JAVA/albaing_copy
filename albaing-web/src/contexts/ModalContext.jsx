import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertModal, ConfirmModal } from '../components/index';

const ModalContext = createContext();

 // 모달 컨텍스트 제공자 컴포넌트
export const ModalProvider = ({ children }) => {
    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '확인',
        type: 'info',
        onClose: () => {},
        onConfirm: null,
    });

    // 확인 모달 상태
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '확인',
        cancelText: '취소',
        isDestructive: false,
        onConfirm: () => {},
        onClose: () => {},
    });

    // 알림 모달 열기
    const openAlertModal = useCallback(({
                                            title,
                                            message,
                                            confirmText,
                                            type,
                                            onConfirm,
                                            onClose
                                        }) => {
        setAlertModal({
            isOpen: true,
            title: title || '알림',
            message,
            confirmText: confirmText || '확인',
            type: type || 'info',
            onConfirm: onConfirm || null,
            onClose: () => {
                closeAlertModal();
                if (typeof onClose === 'function') {
                    setTimeout(() => {
                        onClose();
                    }, 100);
                }
            },
        });
    }, []);

    // 알림 모달 닫기
    const closeAlertModal = useCallback(() => {
        setAlertModal((prev) => ({ ...prev, isOpen: false }));
    }, []);

    // 알림 모달 확인 버튼 클릭
    const handleAlertConfirm = useCallback(() => {
        if (typeof alertModal.onConfirm === 'function') {
            alertModal.onConfirm();
        }
        closeAlertModal();
    }, [alertModal, closeAlertModal]);

    // 확인 모달 열기
    const openConfirmModal = useCallback(({
                                              title,
                                              message,
                                              confirmText,
                                              cancelText,
                                              isDestructive,
                                              onConfirm,
                                              onClose
                                          }) => {
        setConfirmModal({
            isOpen: true,
            title: title || '확인',
            message,
            confirmText: confirmText || '확인',
            cancelText: cancelText || '취소',
            isDestructive: isDestructive || false,
            onConfirm: onConfirm || (() => {}),
            onClose: () => {
                closeConfirmModal();
                if (typeof onClose === 'function') {
                    setTimeout(() => {
                        onClose();
                    }, 100);
                }
            },
        });
    }, []);

    // 확인 모달 닫기
    const closeConfirmModal = useCallback(() => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }, []);

    // 컨텍스트 값
    const contextValue = {
        openAlertModal,
        closeAlertModal,
        openConfirmModal,
        closeConfirmModal,
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}

            {/* 모달 컴포넌트들 */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.onClose}
                onConfirm={handleAlertConfirm}
                title={alertModal.title}
                message={alertModal.message}
                confirmText={alertModal.confirmText}
                type={alertModal.type}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.onClose}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                isDestructive={confirmModal.isDestructive}
            />
        </ModalContext.Provider>
    );
};

// 커스텀 훅
export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};

export default ModalContext;