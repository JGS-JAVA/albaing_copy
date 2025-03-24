import React, { useState, useEffect } from 'react';

const SalaryCalculator = ({ initialTab = 'annual' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    // 연봉 계산기 상태
    const [annualSalary, setAnnualSalary] = useState('');
    const [monthlySalary, setMonthlySalary] = useState('');
    const [afterTaxSalary, setAfterTaxSalary] = useState('');
    const [taxDetails, setTaxDetails] = useState({
        incomeTax: 0,
        nationalPension: 0,
        healthInsurance: 0,
        employmentInsurance: 0,
    });

    // 시급 계산기 상태
    const [hourlyWage, setHourlyWage] = useState('');
    const [workHoursPerDay, setWorkHoursPerDay] = useState('8');
    const [workDaysPerWeek, setWorkDaysPerWeek] = useState('5');
    const [dailyWage, setDailyWage] = useState('');
    const [weeklyWage, setWeeklyWage] = useState('');
    const [monthlyWage, setMonthlyWage] = useState('');

    // 연봉 계산 함수
    const calculateSalaryDetails = () => {
        if (!annualSalary || isNaN(annualSalary)) return;

        const annual = Number(annualSalary);
        const monthly = Math.floor(annual / 12);
        setMonthlySalary(monthly.toLocaleString());

        // 세금 계산
        const nationalPension = Math.floor(monthly * 0.045); // 국민연금 4.5%
        const healthInsurance = Math.floor(monthly * 0.0343); // 건강보험 3.43%
        const employmentInsurance = Math.floor(monthly * 0.008); // 고용보험 0.8%

        // 소득세 간단 계산
        let incomeTax = 0;
        if (annual <= 12000000) {
            incomeTax = Math.floor(monthly * 0.06); // 6%
        } else if (annual <= 46000000) {
            incomeTax = Math.floor(monthly * 0.15); // 15%
        } else if (annual <= 88000000) {
            incomeTax = Math.floor(monthly * 0.24); // 24%
        } else {
            incomeTax = Math.floor(monthly * 0.35); // 35%
        }

        const totalDeduction = nationalPension + healthInsurance + employmentInsurance + incomeTax;
        const afterTax = monthly - totalDeduction;

        setTaxDetails({
            incomeTax,
            nationalPension,
            healthInsurance,
            employmentInsurance,
        });

        setAfterTaxSalary(afterTax.toLocaleString());
    };

    // 시급 계산 함수
    const calculateHourlyWage = () => {
        if (!hourlyWage || isNaN(hourlyWage)) return;

        const hourly = Number(hourlyWage);
        const hours = Number(workHoursPerDay);
        const days = Number(workDaysPerWeek);

        const daily = hourly * hours;
        const weekly = daily * days;
        const monthly = weekly * 4.345; // 평균 주 수

        setDailyWage(daily.toLocaleString());
        setWeeklyWage(weekly.toLocaleString());
        setMonthlyWage(monthly.toLocaleString());
    };

    // 입력값 변경시 계산 실행
    useEffect(() => {
        calculateSalaryDetails();
    }, [annualSalary]);

    useEffect(() => {
        calculateHourlyWage();
    }, [hourlyWage, workHoursPerDay, workDaysPerWeek]);

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white">
                <h2 className="text-xl font-bold text-center">급여 계산기</h2>
            </div>

            {/* 탭 네비게이션 */}
            <div className="grid grid-cols-2 border-b">
                <button
                    className={`py-3 font-medium text-center ${
                        activeTab === 'annual'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('annual')}
                >
                    연봉 계산기
                </button>
                <button
                    className={`py-3 font-medium text-center ${
                        activeTab === 'hourly'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('hourly')}
                >
                    시급 계산기
                </button>
            </div>

            {/* 연봉 계산기 컨텐츠 */}
            {activeTab === 'annual' && (
                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            연봉 (원)
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={annualSalary}
                            onChange={(e) => setAnnualSalary(e.target.value)}
                            placeholder="연봉을 입력하세요"
                        />
                    </div>

                    {monthlySalary && (
                        <div className="mt-6 space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-blue-800 mb-2">계산 결과</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-sm text-gray-500">월 급여</p>
                                        <p className="font-bold text-lg">{monthlySalary}원</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">월 실수령액</p>
                                        <p className="font-bold text-lg">{afterTaxSalary}원</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">공제 내역</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">소득세</span>
                                        <span>{taxDetails.incomeTax.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">국민연금 (4.5%)</span>
                                        <span>{taxDetails.nationalPension.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">건강보험 (3.43%)</span>
                                        <span>{taxDetails.healthInsurance.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">고용보험 (0.8%)</span>
                                        <span>{taxDetails.employmentInsurance.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t mt-2">
                                        <span className="font-semibold">총 공제액</span>
                                        <span className="font-semibold">
                      {(
                          taxDetails.incomeTax +
                          taxDetails.nationalPension +
                          taxDetails.healthInsurance +
                          taxDetails.employmentInsurance
                      ).toLocaleString()}원
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-2">
                                * 상기 금액은 개인 상황에 따라 달라질 수 있으며, 대략적인 참고 자료입니다.
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 시급 계산기 컨텐츠 */}
            {activeTab === 'hourly' && (
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                시급 (원)
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={hourlyWage}
                                onChange={(e) => setHourlyWage(e.target.value)}
                                placeholder="시급을 입력하세요"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    일일 근무시간
                                </label>
                                <select
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={workHoursPerDay}
                                    onChange={(e) => setWorkHoursPerDay(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hours) => (
                                        <option key={hours} value={hours}>
                                            {hours}시간
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    주당 근무일수
                                </label>
                                <select
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={workDaysPerWeek}
                                    onChange={(e) => setWorkDaysPerWeek(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                        <option key={days} value={days}>
                                            {days}일
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {hourlyWage && (
                        <div className="mt-6">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-blue-800 mb-2">계산 결과</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">일급</p>
                                        <p className="font-bold text-lg">{dailyWage}원</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">주급</p>
                                        <p className="font-bold text-lg">{weeklyWage}원</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500">월급 (4.345주 기준)</p>
                                        <p className="font-bold text-lg">{monthlyWage}원</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-4">
                                * 상기 금액은 세전 금액이며, 실제 수령액은 세금 공제 후 달라질 수 있습니다.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SalaryCalculator;
