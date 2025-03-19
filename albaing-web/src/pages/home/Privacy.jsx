import React from 'react';

const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">개인정보처리방침</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <p className="text-gray-600 mb-4">최종 수정일: 2025년 3월 15일</p>
                <p className="text-gray-700">
                    잡잡(주)(이하 "회사")는 이용자의 개인정보를 중요시하며, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」,
                    「개인정보 보호법」 등 관련 법령을 준수하기 위하여 노력하고 있습니다.
                    회사는 이 개인정보처리방침을 통하여 회사가 이용자로부터 수집하는 개인정보의 항목, 수집 및 이용목적,
                    보유 및 이용기간 등에 관한 사항을 이용자에게 안내하고 있습니다.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">1. 수집하는 개인정보의 항목 및 수집방법</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">가. 수집하는 개인정보의 항목</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>회사는 회원 가입, 서비스 이용 등을 위해 아래와 같은 개인정보를 수집합니다.
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>필수항목
                                    <ul className="list-none ml-6 mt-1 space-y-1">
                                        <li>- 개인 회원: 이름, 이메일 주소, 비밀번호, 휴대폰 번호</li>
                                        <li>- 기업 회원: 사업자등록번호, 기업명, 대표자명, 담당자 이름, 담당자 이메일 주소, 담당자 휴대폰 번호, 비밀번호</li>
                                    </ul>
                                </li>
                                <li>선택항목
                                    <ul className="list-none ml-6 mt-1 space-y-1">
                                        <li>- 개인 회원: 주소, 생년월일, 성별, 프로필 사진</li>
                                        <li>- 기업 회원: 회사 로고, 회사 주소, 회사 소개, 설립일</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>서비스 이용 과정에서 아래와 같은 정보가 자동으로 생성되어 수집될 수 있습니다.
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
                            </ul>
                        </li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">나. 개인정보 수집방법</h3>
                    <p className="text-gray-700 mb-2">회사는 다음과 같은 방법으로 개인정보를 수집합니다.</p>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
                        <li>홈페이지 회원가입, 서비스 이용, 이벤트 응모, 상담 게시판</li>
                        <li>생성정보 수집 툴을 통한 수집</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">2. 개인정보의 수집 및 이용목적</h2>

                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
                    </p>

                    <ol className="list-decimal ml-6 text-gray-700 space-y-3">
                        <li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>구인구직 서비스 제공, 이력서 작성 및 관리, 구직활동 지원, 채용공고 등록 및 관리, 지원서 검토 및 연락, 결제 및 요금 청구</li>
                            </ul>
                        </li>
                        <li>회원 관리
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 가입 및 가입횟수 제한, 분쟁 조정을 위한 기록보존, 불만처리 등 민원처리, 고지사항 전달</li>
                            </ul>
                        </li>
                        <li>신규 서비스 개발 및 마케팅·광고에의 활용
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 접속빈도 파악, 회원의 서비스 이용에 대한 통계</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">3. 개인정보의 보유 및 이용기간</h2>

                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        회사는 이용자의 개인정보를 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.
                        단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">가. 회사 내부 방침에 의한 정보보유 사유</h3>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
                        <li>부정이용기록
                            <ul className="list-none ml-6 mt-1 space-y-1">
                                <li>- 보존 이유: 부정 이용 방지</li>
                                <li>- 보존 기간: 1년</li>
                            </ul>
                        </li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">나. 관련법령에 의한 정보보유 사유</h3>
                    <p className="text-gray-700 mb-2">
                        상법, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우
                        회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 이 경우 회사는 보관하는 정보를 그 보관의
                        목적으로만 이용하며 보존기간은 아래와 같습니다.
                    </p>

                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
                        <li>계약 또는 청약철회 등에 관한 기록
                            <ul className="list-none ml-6 mt-1 space-y-1">
                                <li>- 보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률</li>
                                <li>- 보존 기간: 5년</li>
                            </ul>
                        </li>
                        <li>대금결제 및 재화 등의 공급에 관한 기록
                            <ul className="list-none ml-6 mt-1 space-y-1">
                                <li>- 보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률</li>
                                <li>- 보존 기간: 5년</li>
                            </ul>
                        </li>
                        <li>소비자의 불만 또는 분쟁처리에 관한 기록
                            <ul className="list-none ml-6 mt-1 space-y-1">
                                <li>- 보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률</li>
                                <li>- 보존 기간: 3년</li>
                            </ul>
                        </li>
                        <li>웹사이트 방문기록
                            <ul className="list-none ml-6 mt-1 space-y-1">
                                <li>- 보존 이유: 통신비밀보호법</li>
                                <li>- 보존 기간: 3개월</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">4. 개인정보의 파기 절차 및 방법</h2>

                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.
                        파기절차 및 방법은 다음과 같습니다.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">가. 파기절차</h3>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
                        <li>이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 내부 방침 및 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.</li>
                        <li>이용자의 개인정보는 법률에 의한 경우가 아니고서는 보유되는 이외의 다른 목적으로 이용되지 않습니다.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">나. 파기방법</h3>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
                        <li>전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
                        <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">5. 개인정보 제공 및 위탁</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">가. 개인정보 제3자 제공</h3>
                    <p className="text-gray-700 mb-4">
                        회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
                    </p>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
                        <li>이용자가 사전에 동의한 경우</li>
                        <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                    </ul>

                    <p className="text-gray-700 mb-4">
                        현재 회사는 이용자의 사전 동의 하에 개인정보를 아래와 같이 제3자에게 제공하고 있습니다.
                    </p>
                    <table className="w-full border-collapse mb-4">
                        <thead>
                        <tr>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-gray-700">제공받는 자</th>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-gray-700">제공 목적</th>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-gray-700">제공 항목</th>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-gray-700">보유 및 이용기간</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2 text-gray-700">지원한 채용기업</td>
                            <td className="border border-gray-300 p-2 text-gray-700">입사 지원 검토 및 채용 진행</td>
                            <td className="border border-gray-300 p-2 text-gray-700">이름, 이메일, 전화번호, 이력서 정보</td>
                            <td className="border border-gray-300 p-2 text-gray-700">채용 절차 종료 시까지</td>
                        </tr>
                        </tbody>
                    </table>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">나. 개인정보 취급 위탁</h3>
                    <p className="text-gray-700 mb-4">
                        회사는 서비스 향상을 위해 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시 개인정보가
                        안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
                    </p>
                    <table className="w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-gray-700">수탁업체</th>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-gray-700">위탁업무 내용</th>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-gray-700">개인정보 보유 및 이용기간</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2 text-gray-700">(주)OO페이먼츠</td>
                            <td className="border border-gray-300 p-2 text-gray-700">결제처리</td>
                            <td className="border border-gray-300 p-2 text-gray-700">회원탈퇴 시 혹은 위탁계약 종료 시까지</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2 text-gray-700">(주)OO마케팅</td>
                            <td className="border border-gray-300 p-2 text-gray-700">마케팅 메시지 발송</td>
                            <td className="border border-gray-300 p-2 text-gray-700">회원탈퇴 시 혹은 위탁계약 종료 시까지</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">6. 이용자 및 법정대리인의 권리와 그 행사방법</h2>

                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나
                        수정할 수 있으며 가입해지를 요청할 수도 있습니다.
                    </p>

                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
                        <li>이용자 개인정보 조회, 수정 및 가입해지는 '마이페이지 > 회원정보 관리' 메뉴에서 직접 하실 수 있습니다.</li>
                        <li>이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.</li>
                        <li>회사는 이용자의 요청에 의해 해지 또는 삭제된 개인정보는 "3. 개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">7. 개인정보 자동수집 장치의 설치, 운영 및 거부에 관한 사항</h2>

                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">가. 쿠키의 사용 목적</h3>
                    <p className="text-gray-700 mb-4">
                        이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여
                        이용자에게 최적화된 정보 제공을 위해 사용됩니다.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">나. 쿠키의 설치/운영 및 거부</h3>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
                        <li>이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</li>
                        <li>다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 회사의 일부 서비스는 이용에 어려움이 있을 수 있습니다.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">다. 쿠키 설정 방법</h3>
                    <p className="text-gray-700 mb-2">
                        쿠키 설정을 거부하는 방법으로는 이용자가 사용하는 웹 브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나
                        쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
                    </p>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
                        <li>설정방법 예시: 크롬 브라우저
                            <ul className="list-none ml-6 mt-1 space-y-1">
                                <li>- Chrome 우측 상단의 메뉴 아이콘 선택</li>
                                <li>- 설정 메뉴 선택</li>
                                <li>- 화면 하단의 고급 설정 표시 선택</li>
                                <li>- 개인정보 섹션에서 콘텐츠 설정 선택</li>
                                <li>- 쿠키 섹션에서 설정 가능</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">8. 개인정보 보호책임자 및 연락처</h2>

                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을
                        위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">개인정보 보호책임자</h3>
                    <ul className="list-none ml-6 text-gray-700 space-y-1 mb-4">
                        <li>- 성명: 홍길동</li>
                        <li>- 직책: 개인정보보호 책임자</li>
                        <li>- 연락처: privacy@albaing.com, 02-1234-5678</li>
                    </ul>

                    <p className="text-gray-700 mb-4">
                        이용자는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한
                        사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이
                        답변 및 처리해드릴 것입니다.
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">9. 개정 이력</h3>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
                        <li>본 개인정보처리방침은 2025년 3월 15일부터 적용됩니다.</li>
                        <li>이전 개인정보처리방침은 아래에서 확인하실 수 있습니다.
                            <ul className="list-none ml-6 mt-1 space-y-1">
                                <li>- 2024년 1월 1일 ~ 2025년 3월 14일 적용 <a href="#" className="text-blue-600 hover:underline">이전 버전 보기</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Privacy;