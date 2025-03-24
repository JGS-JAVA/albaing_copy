import React from 'react';
import SalaryCalculator from '../../components/layout/SalaryCalculator';
import FloatingRemote from '../../components/layout/FloatingRemote';

const SalaryCalculatorPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* 메인 콘텐츠 */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">급여 계산기</h1>

                <div className="mb-12 max-w-3xl mx-auto">
                    <p className="text-gray-600 text-center mb-8">
                        연봉, 시급을 기준으로 실수령액과 세금 등을 계산해보세요. 이 계산기는 대략적인 추정치를 제공하며,
                        정확한 금액은 세무사나 관련 전문가와 상담하시기 바랍니다.
                    </p>

                    <SalaryCalculator />
                </div>

                {/* 추가 콘텐츠 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">국민연금 안내</h2>
                        <p className="text-gray-600">
                            국민연금은 근로자와 사업자가 각각 4.5%씩 부담하며, 노후 생활 보장을 위한
                            사회보장제도입니다. 월 소득의 9%가 국민연금으로 적립되며, 이 중 4.5%는
                            근로자 본인이 부담합니다.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">건강보험 안내</h2>
                        <p className="text-gray-600">
                            건강보험은 의료 서비스 이용 시 경제적 부담을 줄이기 위한 사회보험입니다.
                            보험료는 소득에 비례하여 책정되며, 근로자는 보험료의 50%를 부담합니다.
                            현재 건강보험료율은 6.86%로, 근로자 부담은 3.43%입니다.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">소득세 과세 구간 (2025년 기준)</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">과세 표준</th>
                                <th className="py-2 px-4 border-b">세율</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b">1,200만원 이하</td>
                                <td className="py-2 px-4 border-b">6%</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">1,200만원 초과 4,600만원 이하</td>
                                <td className="py-2 px-4 border-b">15%</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">4,600만원 초과 8,800만원 이하</td>
                                <td className="py-2 px-4 border-b">24%</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">8,800만원 초과</td>
                                <td className="py-2 px-4 border-b">35% 이상</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* 플로팅 리모컨 */}
            <FloatingRemote>
                <div className="space-y-3">
                    <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        급여 계산기
                    </button>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">빠른 이동</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                연봉 계산기
                            </button>
                            <button className="p-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                시급 계산기
                            </button>
                            <button className="p-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                국민연금 안내
                            </button>
                            <button className="p-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                건강보험 안내
                            </button>
                        </div>
                    </div>

                    <div className="border-t pt-2">
                        <a href="#" className="text-sm text-blue-600 hover:underline">문의하기</a>
                    </div>
                </div>
            </FloatingRemote>
        </div>
    );
};

export default SalaryCalculatorPage;