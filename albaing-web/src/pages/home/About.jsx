import React from 'react';
import albaingLogo from '../../assets/svg/albaing_logo.svg';

const About = () => {
    // 회사 연혁
    const history = [
        { year: '2023', event: '잡잡(주) 법인 설립' },
        { year: '2023', event: '시드 투자 유치 (20억원)' },
        { year: '2024', event: '알바잉 서비스 베타 출시' },
        { year: '2024', event: '앱 서비스 출시' },
        { year: '2024', event: '회원 10만명 돌파' },
        { year: '2025', event: '시리즈 A 투자 유치 (100억원)' },
        { year: '2025', event: '기업 고객 1,000개사 돌파' }
    ];

    // 경영진 정보
    const executives = [
            {
                name: '박지호',
                position: 'CEO / 창업자',
                description: '국내 주요 IT기업 인사총괄 경험을 바탕으로 혁신적인 채용 플랫폼을 구축했습니다.',
                image:  require( '../../assets/img/team/jiho.jpeg')
            },
            {
                name: '신동훈',
                position: 'CTO / 기술이사',
                description: '해외 유수 대학 박사 출신으로 AI 기반 매칭 알고리즘 개발을 주도하고 있습니다.',
                image: require('../../assets/img/team/donghoon.png')
            },
            {
                name: '이다경',
                position: 'CMO / 마케팅이사',
                description: '디지털 마케팅 전문가로 데이터 기반 사용자 확보 전략을 성공적으로 실행했습니다.',
                image: require('../../assets/img/team/dakyung.png')
            },
            {
                name: '조규식',
                position: 'CFO / 재무이사',
                description: '투자 유치 및 재무 관리 전문가로 안정적인 회사 성장을 지원하고 있습니다.',
                image: require('../../assets/img/team/gyusik.png')
            },
            {
                name: '안정수',
                position: 'CPO / 제품이사',
                description: '사용자 중심 제품 개발 전문가로 서비스 고도화를 이끌고 있습니다.',
                image: require('../../assets/img/team/jungsu.png')
            },
            {
                name: '이희섭',
                position: 'CDO / 디자인이사',
                description: 'UX/UI 디자인 전문가로 직관적이고 매력적인, 사용자 친화적 인터페이스를 디자인합니다.',
                image: require('../../assets/img/team/huiseop.png')
            }
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* 회사 소개 헤더 */}
            <section className="text-center mb-16">
                <img src={albaingLogo} alt="알바잉 로고" className="h-20 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-gray-900 mb-4">우리는 알바잉입니다</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    알바잉은 구직자와 기업을 연결하는 새로운 방식을 제시합니다.
                    더 빠르고, 더 정확하고, 더 편리한 채용 경험을 위해 노력합니다.
                </p>
            </section>

            {/* 미션과 비전 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-blue-50 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">미션</h2>
                    <p className="text-gray-700">
                        모든 사람이 자신에게 맞는 일자리를 찾고, 모든 기업이 적합한 인재를 만날 수 있도록 연결합니다.
                        우리는 채용 시장의 정보 비대칭을 해소하고 효율적인 매칭을 통해 사회적 가치를 창출합니다.
                    </p>
                </div>

                <div className="bg-green-50 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold text-green-800 mb-4">비전</h2>
                    <p className="text-gray-700">
                        2030년까지 아시아 최고의 구인구직 플랫폼으로 성장하여, 1,000만 구직자와 10만 기업이 함께하는
                        생태계를 구축하는 것을 목표로 합니다. 기술 혁신을 통해 채용 시장의 패러다임을 변화시키겠습니다.
                    </p>
                </div>
            </section>

            {/* 핵심 가치 */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">핵심 가치</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">신뢰</h3>
                        <p className="text-gray-600">
                            모든 거래와 관계의 기본은 신뢰입니다. 우리는 투명하고 정직한 서비스로 신뢰를 쌓아갑니다.
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">혁신</h3>
                        <p className="text-gray-600">
                            기존의 방식에 도전하고 새로운 솔루션을 통해 채용 시장의 문제를 해결합니다.
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-lg shadow-md">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">연결</h3>
                        <p className="text-gray-600">
                            사람과 기회를 연결하는 다리가 되어 모두에게 가치 있는 경험을 제공합니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* 회사 연혁 */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">회사 연혁</h2>

                <div className="relative border-l-2 border-blue-200 ml-6 pl-8 space-y-10">
                    {history.map((item, index) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-14 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-blue-600">{item.year}</span>
                                <span className="text-gray-700">{item.event}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 경영진 소개 */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">경영진 소개</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {executives.map((exec, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col items-center">
                                <img
                                    src={exec.image}
                                    alt={exec.name}
                                    className="w-32 h-32 rounded-full object-cover mb-4"
                                />
                                <h3 className="text-xl font-bold text-gray-800">{exec.name}</h3>
                                <p className="text-blue-600 mb-4">{exec.position}</p>
                            </div>
                            <p className="text-gray-600 text-center">{exec.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 위치 및 연락처 */}
            <section>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">오시는 길</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">연락처</h3>

                        <div className="space-y-3">
                            <p className="flex items-center text-gray-700">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                서울특별시 강남구 테헤란로14길 6 남도빌딩 2층
                            </p>

                            <p className="flex items-center text-gray-700">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                02-1234-5678
                            </p>

                            <p className="flex items-center text-gray-700">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                info@albaing.com
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                        {/* 실제 지도 API 연동 필요, 지금은 더미 */}
                        <div className="text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-gray-600">지도가 표시될 영역입니다.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;