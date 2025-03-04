import React from 'react';
import { Link } from 'react-router-dom';
import albaingLogo from '../assets/svg/albaing_logo.svg';

export default function NotFound() {
    return (
        <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <img src={albaingLogo} alt="알바잉 로고" className="h-24 w-auto" />
                </div>
                <p className="text-4xl font-extrabold text-blue-600">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    페이지를 찾을 수 없습니다
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        홈으로 돌아가기
                    </Link>
                    <Link to="/customer/contact" className="text-sm font-semibold text-gray-900">
                        고객센터 문의하기 <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}