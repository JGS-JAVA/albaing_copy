import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal, AlertModal } from '../../../components';
import ResumeCard from './components/ResumeCard';

const categories = [
    '전체','외식/음료','유통/판매','문화/여가생활','서비스','사무/회계',
    '고객상담/리서치','생산/건설/노무','IT/기술','디자인','미디어',
    '운전/배달','병원/간호/연구','교육/강사'
];
const locations = ['전체','서울','경기','인천','부산','대구','대전','광주'];

export default function ResumeList() {
    const { isLoggedIn, userType } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [category, setCategory] = useState('전체');
    const [location, setLocation] = useState('전체');
    const alertModal = useModal();

    useEffect(() => {
        axios.get('/api/resume/list')
            .then(res => setResumes(res.data))
            .catch(console.error);
    }, []);

    const filtered = resumes.filter(r =>
        (category === '전체' || r.resumeJobCategory?.includes(category)) &&
        (location === '전체' || r.resumeLocation?.includes(location))
    );

    const handleClick = (resumeId, userId) => {
        if (userType === 'company') {
            window.location.href = `/resumes/${resumeId}/user/${userId}`;
        } else {
            alertModal.openModal({
                title: '접근 불가',
                message: '기업 회원만 이력서 상세를 볼 수 있습니다.',
                type: 'warning'
            });
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-center mb-8">인재 정보</h1>

            {/* 필터 */}
            <div className="flex items-end justify-center space-x-8 mb-10">
                {/* 직종 */}
                <div className="flex flex-col">
                    <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">
                        직종
                    </label>
                    <select
                        id="category"
                        className="w-48 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* 지역 */}
                <div className="flex flex-col">
                    <label htmlFor="location" className="mb-1 text-sm font-medium text-gray-700">
                        지역
                    </label>
                    <select
                        id="location"
                        className="w-48 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                    >
                        {locations.map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {filtered.map(r => (
                    <ResumeCard
                        key={r.resumeId}
                        resume={r}
                        isCompany={isLoggedIn && userType === 'company'}
                        onClick={() => handleClick(r.resumeId, r.userId)}
                    />
                ))}
            </div>

            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title={alertModal.modalProps.title}
                message={alertModal.modalProps.message}
                type={alertModal.modalProps.type}
            />
        </div>
    );
}
