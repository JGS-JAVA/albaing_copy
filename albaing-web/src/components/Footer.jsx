import React from 'react';

export default function Footer()  {
    return (
        <div className="border-t pb-14 text-14 ">
            <div className="mx-auto grid grid-cols-1 space-y-4 px-10 md:grid-cols-2 md:px-20">

                <div>
                    <p className="mt-5 text-gray-800">(주) 잡잡</p>
                    <p className="mt-2 w-full text-gray-500">
                        사업자등록번호 : 123-456-12345 <br />
                        서울특별시 강남구 테헤란로14길 6
                        남도빌딩 2층, 3층, 4층
                    </p>
                    <p className="mt-2 text-gray-500">
                        © 2025 jobjob. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};
