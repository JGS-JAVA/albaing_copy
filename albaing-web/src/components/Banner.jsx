import React from 'react';
import { Link } from 'react-router-dom';

const links = [
    { name: '채용공고 보기', href: '/jobs' },
    { name: '기업 정보 찾기', href: '/companies' },
    { name: '이력서 등록하기', href: '/resumes' },
    { name: '기업 리뷰 보기', href: '/companies/reviews' },
];

const stats = [
    { name: '등록된 채용공고', value: '2,500+' },
    { name: '등록된 기업', value: '1,200+' },
    { name: '구직 성공률', value: '85%' },
    { name: '월 방문자 수', value: '10만+' },
];

export default function FullWidthBanner() {
    return (
        <div className="relative isolate overflow-hidden bg-blue-900 py-16 sm:py-24 full-width">
            <img
                alt="알바잉 배경 이미지"
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&h=1500&q=80&blend=1e3a8a&sat=-100&exp=15&blend-mode=multiply"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"
            />
            <svg
                viewBox="0 0 1097 845"
                aria-hidden="true"
                className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            >
                <path
                    fill="url(#gradient1)"
                    fillOpacity=".5"
                    d="M301.174 646.641 193.541 844.786 0 546.172l301.174 100.469 193.845-356.855c1.241 164.891 42.802 431.935 199.124 180.978 195.402-313.696 143.295-588.18 284.729-419.266 113.148 135.13 124.068 367.989 115.378 467.527L811.753 372.553l20.591 451.108L301.174 646.641Z"
                />
                <defs>
                    <linearGradient
                        id="gradient1"
                        x1="1097.04"
                        x2="-141.165"
                        y1=".22"
                        y2="363.075"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#3b82f6" />
                        <stop offset="1" stopColor="#0ea5e9" />
                    </linearGradient>
                </defs>
            </svg>
            <svg
                viewBox="0 0 1097 845"
                aria-hidden="true"
                className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0"
            >
                <path
                    fill="url(#gradient2)"
                    fillOpacity=".5"
                    d="M301.174 646.641 193.541 844.786 0 546.172l301.174 100.469 193.845-356.855c1.241 164.891 42.802 431.935 199.124 180.978 195.402-313.696 143.295-588.18 284.729-419.266 113.148 135.13 124.068 367.989 115.378 467.527L811.753 372.553l20.591 451.108L301.174 646.641Z"
                />
                <defs>
                    <linearGradient
                        id="gradient2"
                        x1="1097.04"
                        x2="-141.165"
                        y1=".22"
                        y2="363.075"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#3b82f6" />
                        <stop offset="1" stopColor="#0ea5e9" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        당신의 일자리, 알바잉에서
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        알바잉은 개인과 기업을 연결하는 최고의 구인구직 플랫폼입니다.
                        다양한 채용 공고와 기업 정보를 확인하고 원하는 직업을 찾아보세요.
                        간편한 이력서 등록과 지원 시스템으로 여러분의 취업을 도와드립니다.
                    </p>
                </div>
                <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                        {links.map((link) => (
                            <Link key={link.name} to={link.href} className="hover:text-blue-200 transition-colors">
                                {link.name} <span aria-hidden="true">&rarr;</span>
                            </Link>
                        ))}
                    </div>
                    <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.name} className="flex flex-col-reverse">
                                <dt className="text-base leading-7 text-gray-300">{stat.name}</dt>
                                <dd className="text-2xl font-bold leading-9 tracking-tight text-white">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}