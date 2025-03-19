import React, { useState } from 'react';

const FAQ = () => {
    // 각 FAQ 항목의 열림/닫힘 상태를 관리
    const [openItems, setOpenItems] = useState({});

    // FAQ 데이터
    const faqItems = [
        {
            id: 1,
            question: "알바잉은 어떤 서비스인가요?",
            answer: "알바잉은 개인과 기업을 연결하는 구인구직 플랫폼입니다. 다양한 채용 공고와 기업 정보를 제공하며, 간편한 이력서 등록과 지원 시스템으로 취업을 도와드립니다."
        },
        {
            id: 2,
            question: "알바잉 서비스는 무료인가요?",
            answer: "네, 구직자는 모든 서비스를 무료로 이용할 수 있습니다. 기업 회원의 경우 기본 채용공고 등록은 무료이며, 프리미엄 서비스는 유료로 제공됩니다."
        },
        {
            id: 3,
            question: "이력서는 어떻게 등록하나요?",
            answer: "마이페이지 > 이력서 관리 메뉴에서 이력서를 등록할 수 있습니다. 기본 정보, 학력, 경력, 자기소개서 등을 입력하여 완성된 이력서를 만들 수 있습니다."
        },
        {
            id: 4,
            question: "채용공고에 어떻게 지원하나요?",
            answer: "관심 있는 채용공고 상세 페이지에서 '지원하기' 버튼을 클릭하면 됩니다. 지원 전 이력서가 등록되어 있어야 합니다."
        },
        {
            id: 5,
            question: "지원 현황은 어디서 확인할 수 있나요?",
            answer: "마이페이지 > 지원 현황 메뉴에서 내가 지원한 공고 목록과 진행 상태를 확인할 수 있습니다."
        },
        {
            id: 6,
            question: "기업 회원으로 가입하려면 어떻게 해야 하나요?",
            answer: "회원가입 시 '기업 회원'을 선택하고 필요한 정보를 입력하면 됩니다. 사업자등록번호 인증 후 서비스를 이용할 수 있습니다."
        },
        {
            id: 7,
            question: "채용공고는 어떻게 등록하나요?",
            answer: "기업 회원 로그인 후 기업 대시보드 > 채용공고 관리 > 새 공고 등록 메뉴를 통해 채용공고를 등록할 수 있습니다."
        },
        {
            id: 8,
            question: "비밀번호를 잊어버렸어요. 어떻게 해야 하나요?",
            answer: "로그인 페이지에서 '비밀번호 찾기'를 클릭하면 가입 시 등록한 이메일로 비밀번호 재설정 링크를 받을 수 있습니다."
        }
    ];

    // 아코디언 토글 함수
    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">자주 묻는 질문</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {faqItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                        <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                            onClick={() => toggleItem(item.id)}
                        >
                            <span className="text-lg font-medium text-gray-900">{item.question}</span>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${openItems[item.id] ? 'transform rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {openItems[item.id] && (
                            <div className="px-6 py-4 bg-gray-50">
                                <p className="text-gray-700">{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">원하는 답변을 찾지 못하셨나요?</p>
                <a
                    href="/customer/contact"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    1:1 문의하기
                </a>
            </div>
        </div>
    );
};

export default FAQ;