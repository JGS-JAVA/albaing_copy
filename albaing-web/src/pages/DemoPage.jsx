// DemoPage.jsx
import React from 'react';

function DemoPage() {
    return (
        <div>

            <header className="border-b border-gray-200 py-4 mb-8">
                <h1>Demo Page</h1>
            </header>

            <main className="space-y-8">
                <section className="space-y-4">
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <p>
                        이 페이지는 전역 CSS (index.css)에 정의된 스타일이 적용되는지 확인하기 위한
                        기본 데모 페이지입니다. 아래에 버튼, 입력 필드, 체크박스, 라디오 버튼 등 여러
                        요소가 있으니 확인해 보세요.
                    </p>

                    <button className="button">Click Me</button>
                    <br />

                    <input type="text" placeholder="Input field" className="mt-2" />
                    <br />

                    <textarea
                        placeholder="Textarea"
                        className="textarea mt-2"
                        spellCheck="false"
                    ></textarea>
                    <br />

                    <div>
                        <label className="mr-4">
                            <input type="checkbox" className="checkbox mr-1" /> Checkbox
                        </label>
                        <label>
                            <input type="radio" name="demo" className="radio mr-1" /> Radio Button
                        </label>
                    </div>
                </section>

                {/* 섹션 2: 카드 예시 */}
                <section>
                    <h2>Card Example</h2>
                    <div className="card p-4 mt-4">
                        <h3>Card Title</h3>
                        <p>Card content line 1</p>
                        <p>Card content line 2</p>
                    </div>
                </section>

                <section>
                    <h2>Avatar Example</h2>
                    <div className="flex items-center space-x-4 mt-4">
                        <img
                            src="../assets/svg/albaing_logo.svg"
                            alt="Avatar"
                            className="avatar w-16 h-16"
                        />
                        <div>
                            <p className="font-bold">사용자 이름</p>
                            <p className="text-gray-600">user@example.com</p>
                        </div>
                    </div>

                    <div className="avatar-default w-16 h-16 mt-4 flex items-center justify-center">
                        <span className="text-sm text-gray-500">No Image</span>
                    </div>
                </section>
            </main>

            <footer className="border-t border-gray-200 py-4 mt-8">
                <p>© 2025 Demo Page</p>
            </footer>
        </div>
    );
}

export default DemoPage;
