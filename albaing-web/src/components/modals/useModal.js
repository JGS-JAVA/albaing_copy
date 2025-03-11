import { useState, useCallback } from 'react';

/**
 * 모달 상태를 관리하는 커스텀 훅
 * @returns {Object} 모달 관련 상태와 함수들
 */
const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalProps, setModalProps] = useState({});

    // 모달 열기
    const openModal = useCallback((props = {}) => {
        setModalProps(props);
        setIsOpen(true);
    }, []);

    // 모달 닫기
    const closeModal = useCallback(() => {
        setIsOpen(false);

        if (typeof modalProps.onClose === 'function') {
            // 약간 지연시켜 실행하여 모달이 완전히 닫힌 후 작업 수행
            setTimeout(() => {
                modalProps.onClose();
            }, 100);
        }
    }, [modalProps]);

    return {
        isOpen,
        openModal,
        closeModal,
        modalProps,
    };
};

export default useModal;