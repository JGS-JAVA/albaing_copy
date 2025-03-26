import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext'

// 예시 직종/지역 옵션
const categories = ['전체','외식/음료','유통/판매','사무/회계','IT/기술','...'];
const locations  = ['전체','서울','경기','인천','부산','대구','...'];

export default function ResumeList() {
    const { userType } = useAuth();  // "personal", "company", "admin" 등
    const [resumes, setResumes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedLocation, setSelectedLocation] = useState('전체');

    // 서버에서 목록 가져오기
    useEffect(() => {
        axios.get('/api/resume/list')
            .then(res => setResumes(res.data))
            .catch(err => console.error('이력서 목록 불러오기 오류:', err));
    }, []);

    // 필터링 로직 (프론트엔드에서 단순히 filter)
    const filteredResumes = resumes.filter(r => {
        // 직종 필터
        const matchCategory = (selectedCategory === '전체')
            || (r.resumeJobCategory && r.resumeJobCategory.includes(selectedCategory));
        // 지역 필터
        const matchLocation = (selectedLocation === '전체')
            || (r.resumeLocation && r.resumeLocation.includes(selectedLocation));
        return matchCategory && matchLocation;
    });

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h2 className="text-2xl font-bold mb-6">인재 정보</h2>

            {/* 필터 UI */}
            <div className="flex space-x-4 mb-8">
                <div>
                    <label className="mr-2 font-medium">직종</label>
                    <select
                        className="border p-1 rounded"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mr-2 font-medium">근무지</label>
                    <select
                        className="border p-1 rounded"
                        value={selectedLocation}
                        onChange={e => setSelectedLocation(e.target.value)}
                    >
                        {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 이력서 카드 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredResumes.map((resume) => {
                    // 기업 유저만 실제 프로필 이미지를 보고, 나머지는 기본 이미지
                    const profileSrc = (userType === 'company' && resume.profileImage)
                        ? resume.profileImage
                        : '/images/default-profile.jpg'; // 실제 default 이미지 경로

                    return (
                        <div
                            key={resume.resumeId}
                            className="border rounded-lg shadow p-6 flex flex-col items-center"
                        >
                            <img
                                src={profileSrc}
                                alt="Profile"
                                className="w-24 h-24 object-cover rounded-full mb-4"
                                onError={(e) => { e.target.src = '/images/default-profile.jpg'; }}
                            />
                            <h3 className="text-lg font-bold mb-2">{resume.maskedName}</h3>
                            <p className="text-sm text-gray-600">
                                희망 직종: {resume.resumeJobCategory || '미입력'}
                            </p>
                            <p className="text-sm text-gray-600">
                                희망 근무지: {resume.resumeLocation || '미입력'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
