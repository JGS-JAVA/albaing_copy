import React from 'react';
import defaultProfile from '../../../../assets/img/default-profile.jpg';

export default function ResumeCard({ resume, isCompany, onClick }) {
    const { maskedName, profileImage, resumeJobCategory, resumeLocation } = resume;
    const src = (isCompany && profileImage) ? profileImage : defaultProfile;

    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-2xl transition p-6 flex flex-col items-center text-center"
        >
            <img
                src={src}
                alt="프로필"
                className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-gray-200"
                onError={e => e.target.src = defaultProfile}
            />
            <h2 className="text-xl font-semibold mb-2">{maskedName}</h2>
            <p className="text-gray-600 text-sm mb-1">희망 직종: <span className="font-medium">{resumeJobCategory || '-'}</span></p>
            <p className="text-gray-600 text-sm">희망 근무지: <span className="font-medium">{resumeLocation || '-'}</span></p>
        </div>
    );
}
