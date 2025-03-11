import React, { useEffect, useState } from 'react';
import apiMyPageService from "../../../service/apiMyPageService"; // 스크랩 API 서비스 호출

const ScrapPage = () => {
    const [scrapItems, setScrapItems] = useState([]);  // 스크랩 항목 상태 관리


    useEffect(() => {
        apiMyPageService.getScrapsByUser(userId);
    }, [userId]);


    if (scrapItems.length === 0) {a
        return (
            <div className="text-center mt-10">
                <p className="text-lg text-gray-600">스크랩한 항목이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">내 스크랩 목록</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scrapItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            자세히 보기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrapPage;
