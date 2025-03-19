import React from 'react';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">이용약관</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <p className="text-gray-600 mb-4">최종 수정일: 2025년 3월 15일</p>
                <p className="text-gray-700">
                    이 약관은 잡잡(주)가 운영하는 알바잉(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항,
                    서비스 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">제1장 총칙</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제1조 (목적)</h3>
                    <p className="text-gray-700 mb-4">
                        이 약관은 잡잡(주)(이하 "회사")가 제공하는 알바잉 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항,
                        서비스 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제2조 (정의)</h3>
                    <p className="text-gray-700 mb-2">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-1">
                        <li>"서비스"란 회사가 제공하는 구인구직 중개 플랫폼 서비스를 말합니다.</li>
                        <li>"이용자"란 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                        <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 이용할 수 있는 자를 말합니다.</li>
                        <li>"기업회원"이란 회원 중 구인을 목적으로 서비스를 이용하는 사업자 또는 법인을 말합니다.</li>
                        <li>"개인회원"이란 회원 중 구직을 목적으로 서비스를 이용하는 개인을 말합니다.</li>
                        <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 말합니다.</li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제3조 (약관의 게시와 개정)</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
                        <li>회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
                        <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.</li>
                        <li>이용자가 개정약관의 적용에 동의하지 않는 경우 회사는 개정약관의 내용을 적용할 수 없으며, 이 경우 이용자는 이용계약을 해지할 수 있습니다.</li>
                    </ol>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">제2장 서비스 이용</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제4조 (서비스의 제공 및 변경)</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>회사는 다음과 같은 서비스를 제공합니다.
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>구인구직 정보 제공 서비스</li>
                                <li>이력서 등록 및 관리 서비스</li>
                                <li>채용공고 등록 및 관리 서비스</li>
                                <li>기업정보 제공 서비스</li>
                                <li>기타 회사가 정하는 서비스</li>
                            </ul>
                        </li>
                        <li>회사는 서비스의 품질 또는 기술적 사양의 변경 등의 경우에는 서비스의 내용을 변경할 수 있습니다. 이 경우에는 변경된 서비스의 내용 및 제공일자를 명시하여 현재의 서비스 내용을 게시한 곳에 즉시 공지합니다.</li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제5조 (서비스 이용계약의 성립)</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>서비스 이용계약은 이용자가 약관의 내용에 대하여 동의를 하고 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 회사가 승낙함으로써 성립됩니다.</li>
                        <li>회사는 다음 각 호에 해당하는 이용계약 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>실명이 아니거나 타인의 명의를 사용하여 신청한 경우</li>
                                <li>이용계약 신청서의 내용을 허위로 기재한 경우</li>
                                <li>사회의 안녕과 질서, 미풍양속을 저해할 목적으로 신청한 경우</li>
                                <li>부정한 용도로 서비스를 이용하고자 하는 경우</li>
                                <li>법령 또는 이 약관이 금지하는 행위를 하기 위하여 신청한 경우</li>
                                <li>기타 회사가 합리적인 판단에 의하여 필요하다고 인정하는 경우</li>
                            </ul>
                        </li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제6조 (회원정보의 변경)</h3>
                    <p className="text-gray-700 mb-4">
                        회원은 개인정보 관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 다만, 서비스 관리를 위해 필요한 아이디 등은 수정이 불가능합니다.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">제3장 의무 및 책임</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제7조 (회사의 의무)</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>회사는 이 약관이 정하는 바에 따라 지속적이고 안정적인 서비스를 제공하기 위해 최선을 다합니다.</li>
                        <li>회사는 이용자가 안전하게 서비스를 이용할 수 있도록 개인정보보호를 위해 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.</li>
                        <li>회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 처리하여야 합니다.</li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제8조 (회원의 의무)</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>회원은 다음 행위를 하여서는 안됩니다.
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>신청 또는 변경 시 허위내용의 등록</li>
                                <li>타인의 정보 도용</li>
                                <li>회사가 게시한 정보의 변경</li>
                                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                                <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                                <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                                <li>기타 불법적이거나 부당한 행위</li>
                            </ul>
                        </li>
                        <li>회원은 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안됩니다.</li>
                    </ol>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">제4장 서비스 이용 제한 및 해지</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제9조 (서비스 이용 제한)</h3>
                    <p className="text-gray-700 mb-4">
                        회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 서비스 이용을 경고, 일시정지, 계약해지 등으로 단계적으로 제한할 수 있습니다.
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제10조 (계약해지 및 이용제한)</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>회원이 이용계약을 해지하고자 하는 때에는 회원 본인이 서비스 내 회원탈퇴 기능을 이용하여 탈퇴할 수 있습니다.</li>
                        <li>회사는 회원이 다음 각 호에 해당하는 행위를 하였을 경우 사전통지 없이 이용계약을 해지하거나 또는 기간을 정하여 서비스 이용을 중지할 수 있습니다.
                            <ul className="list-disc ml-6 mt-1 space-y-1">
                                <li>타인의 서비스 ID 및 비밀번호를 도용한 경우</li>
                                <li>서비스 운영을 고의로 방해한 경우</li>
                                <li>가입한 이름이 실명이 아닌 경우</li>
                                <li>같은 사용자가 다른 ID로 중복 가입한 경우</li>
                                <li>공공질서 및 미풍양속에 저해되는 내용을 유포시킨 경우</li>
                                <li>타인의 명예를 손상시키거나 불이익을 주는 행위를 한 경우</li>
                                <li>서비스의 안정적 운영을 방해할 목적으로 다량의 정보를 전송하거나 광고성 정보를 전송하는 경우</li>
                                <li>정보통신설비의 오작동이나 정보 등의 파괴를 유발시키는 컴퓨터 바이러스 프로그램 등을 유포하는 경우</li>
                                <li>회사, 다른 회원 또는 제3자의 지적재산권을 침해하는 경우</li>
                                <li>타인의 개인정보, 이용자ID 및 비밀번호를 부정하게 사용하는 경우</li>
                                <li>회사의 서비스 정보를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복제 또는 유통시키거나 상업적으로 이용하는 경우</li>
                                <li>회원이 게시판에 음란물을 게재하거나 음란사이트를 연결하는 경우</li>
                                <li>기타 관련법령에 위반된다고 판단되는 경우</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">제5장 손해배상 및 기타사항</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제11조 (손해배상)</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>회사와 이용자는 서비스 이용과 관련하여 고의 또는 과실로 상대방에게 손해를 끼친 경우에는 이를 배상하여야 합니다.</li>
                        <li>회사는 무료로 제공하는 서비스의 이용과 관련하여 개인정보보호정책에서 정하는 내용에 위반하지 않는 한 어떠한 손해도 책임을 지지 않습니다.</li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제12조 (면책조항)</h3>
                    <ol className="list-decimal ml-6 text-gray-700 space-y-2">
                        <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 및 기타 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                        <li>회사는 기간통신사업자가 전기통신서비스를 중지하거나 정상적으로 제공하지 아니하여 손해가 발생한 경우 책임이 면제됩니다.</li>
                        <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
                        <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
                        <li>회사는 회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등 내용에 관하여는 책임을 지지 않습니다.</li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">제13조 (관할법원)</h3>
                    <p className="text-gray-700 mb-4">
                        서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">부칙</h3>
                    <p className="text-gray-700 mb-2">
                        이 약관은 2025년 3월 15일부터 시행합니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;