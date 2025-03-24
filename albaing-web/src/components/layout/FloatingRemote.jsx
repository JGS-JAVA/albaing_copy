import React, { useState, useEffect } from 'react';
import Modal from '../../components/modals/Modal';
import SalaryCalculator from './SalaryCalculator';

const FloatingMenu = () => {
    const [openModal, setOpenModal] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeModalHandler = () => setOpenModal(null);

    return (
        <>
            {/* 플로팅 빠른 메뉴 버튼 및 패널 */}
            <div
                className="fixed right-4 transition-all duration-300 z-50"
                style={{ top: scrollY > 100 ? '80px' : '112px' }}
            >
                <div className="relative">
                    {!isMenuOpen && (
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    )}

                    {isMenuOpen && (
                        <div
                            className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform"
                            style={{
                                width: '300px',
                                opacity: '1',
                                visibility: 'visible',
                                maxHeight: '600px',
                            }}
                        >
                            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                                <h3 className="font-medium">빠른 메뉴</h3>
                                <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="space-y-3">
                                    <button onClick={() => setOpenModal('annual')} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                        연봉 계산기
                                    </button>
                                    <button onClick={() => setOpenModal('hourly')} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                        시급 계산기
                                    </button>
                                    <button onClick={() => setOpenModal('nationalPension')} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                        국민연금 안내
                                    </button>
                                    <button onClick={() => setOpenModal('healthInsurance')} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                        건강보험 안내
                                    </button>
                                    <div className="border-t pt-2">
                                        <a href="/customer/faq" className="text-sm text-blue-600 hover:underline">
                                            문의하기
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 모달들 */}
            {/* 연봉 계산기 모달 */}
            <Modal isOpen={openModal === 'annual'} onClose={closeModalHandler} title="연봉 계산기" size="lg">
                <SalaryCalculator initialTab="annual" />
            </Modal>

            {/* 시급 계산기 모달 */}
            <Modal isOpen={openModal === 'hourly'} onClose={closeModalHandler} title="시급 계산기" size="lg">
                <SalaryCalculator initialTab="hourly" />
            </Modal>

            {/* 국민연금 안내 모달 */}
            <Modal isOpen={openModal === 'nationalPension'} onClose={closeModalHandler} title="국민연금 안내" size="md">
                <div>
                    <h4 className="text-lg font-semibold mb-2">국민연금 안내</h4>
                    <p className="text-gray-700">
                        국민연금은 근로자와 사업자가 각각 4.5%씩 부담하며, 노후 생활 보장을 위한 사회보장제도입니다.
                        월 소득의 9%가 국민연금으로 적립되며, 이 중 4.5%는 근로자 본인이 부담합니다.
                    </p>
                </div>
            </Modal>

            {/* 건강보험 안내 모달 */}
            <Modal isOpen={openModal === 'healthInsurance'} onClose={closeModalHandler} title="건강보험 안내" size="md">
                <div>
                    <h4 className="text-lg font-semibold mb-2">건강보험 안내</h4>
                    <p className="text-gray-700">
                        건강보험은 의료 서비스 이용 시 경제적 부담을 줄이기 위한 사회보험입니다.
                        보험료는 소득에 비례하여 책정되며, 근로자는 보험료의 50%를 부담합니다.
                        현재 건강보험료율은 6.86%로, 근로자 부담은 3.43%입니다.
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default FloatingMenu;
