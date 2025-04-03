import React from 'react';

const ResumeCareer = ({careerHistory, onAdd, onEdit, onDelete}) => {
    const careers = Array.isArray(careerHistory)
        ? careerHistory
        : careerHistory
            ? [careerHistory]
            : [];

    const hasNewbie = careers.some(career => career.careerIsCareer === '신입');

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">경력 정보</h2>
                <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded-md">추가</button>
            </div>

            {careers.length === 0 ? (
                <div className="text-gray-500">등록된 경력이 없습니다.</div>
            ) : hasNewbie ? (
                <div className="mb-4 p-6 bg-blue-50 rounded-lg border border-blue-100 text-center">
                    <div className="text-5xl mb-3">🌱</div>
                    <p className="text-blue-800 font-medium">신입으로 설정되었습니다.</p>
                    <p className="text-blue-600 text-sm mt-1">첫 직장에서 새로운 시작을 응원합니다!</p>
                    <div className="mt-4">
                        <button onClick={() => onEdit(careers.find(c => c.careerIsCareer === '신입').careerId)}
                                className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                            설정 변경
                        </button>
                    </div>
                </div>
            ) : (
                careers.map((career, idx) => (
                    <div key={idx} className="mb-4 p-4 bg-white rounded border">
                        <h3 className="text-lg font-semibold">{career.careerCompanyName}</h3>
                        <p>{career.careerJoinDate} {career.careerQuitDate ? `~ ${career.careerQuitDate}` : '~ 현재 재직중'}</p>
                        {career.careerJobDescription && <p>{career.careerJobDescription}</p>}
                        <div className="mt-2 flex gap-2">
                            <button onClick={() => onEdit(career.careerId)}
                                    className="text-sm bg-gray-100 px-3 py-1 rounded">수정
                            </button>
                            <button onClick={() => onDelete(idx)}
                                    className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded">삭제
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ResumeCareer;