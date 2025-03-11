import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import apiMyPageService from "../../../service/apiMyPageService";

const MyPage = () => {
    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const [resume, setResume] = useState(null);

    useEffect(() => {
        apiMyPageService.getUserById(userId, setUser);
        apiMyPageService.getResumeById(userId, setResume);
    }, [userId]);

    if (!user) return <div className="text-center mt-10">사용자 정보를 불러오는 중...</div>;
    if (!resume) return <div className="text-center mt-10">이력서를 불러오는 중...</div>;

    return (
        <div className="flex max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* 사이드바 */}
            <aside className="w-1/4 p-4 border-r border-gray-200">
                <nav>
                    <ul className="space-y-4 text-sm font-semibold text-gray-700">
                        <li>
                            <Link to={`/mypage/${userId}`} className="block p-2 hover:text-blue-600">나의 이력서 관리</Link>
                        </li>
                        <li>
                            <Link to={`/mypage/applications`} className="block p-2 hover:text-blue-600">나의 지원현황</Link>
                        </li>
                        <li>
                            <Link to={`/mypage/scraps`} className="block p-2 hover:text-blue-600">스크랩한 공고</Link>
                        </li>
                        <li>
                            <Link to={`/mypage/reviews`} className="block p-2 hover:text-blue-600">나의 리뷰 관리</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* 메인 콘텐츠 */}
            <div className="w-3/4 pl-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold">{user.userName} 님</h1>
                    <Link to={`/mypage/user/${userId}/edit`} className="text-blue-500 hover:underline">
                        내 정보 수정하기
                    </Link>
                </div>
                {/* 이력서 */}
                <div className="mt-6 p-6 border rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">
                        <div className="flex justify-between">
                            <div>이력서</div>
                            <div>관리</div>
                            <br/>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link to="/resumes" className="hover:underline text-blue-600">
                                {resume.resumeTitle}
                            </Link>
                            <Link
                                to="/resumes/edit"
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                수정
                            </Link>
                        </div>

                    </h2>

                </div>

            </div>
        </div>
    );
};

export default MyPage;
