import React from 'react';

export default function ResumeCard({ resume, onClick }) {
    const { maskedName, profileImage } = resume;

    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-center"
        >
            <img
                src={profileImage}
                alt="Profile"
                className="mx-auto w-24 h-24 rounded-full object-cover mb-4"
            />
            <p className="text-xl font-semibold">{maskedName}</p>
        </div>
    );
}
