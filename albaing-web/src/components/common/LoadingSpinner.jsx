import React from 'react';

const LoadingSpinner = ({ message = "로딩 중...", fullScreen = true, className = '' }) => (
    <div className={`flex justify-center items-center ${fullScreen ? 'min-h-screen' : 'py-10'} ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        {message && <p className="ml-3 text-lg text-gray-700">{message}</p>}
    </div>
);

export default LoadingSpinner;