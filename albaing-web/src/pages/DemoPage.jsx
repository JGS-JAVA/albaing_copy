import React from 'react';

function DemoPage() {
    return (
        <div>
            <header>
                <h1>Demo Page</h1>
                <img src="../assets/svg/albaing_logo.svg" alt="Logo"  />
            </header>
            <main>
                <section>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <p>
                        이 페이지는 전역 CSS (index.css)에 정의된 스타일이 적용되는지 확인하기 위한 기본 데모 페이지입니다. 이 페이지는 전역 CSS (index.css)에 정의된 스타일이 적용되는지 확인하기 위한 기본 데모 페이지입니다. 이 페이지는 전역 CSS (index.css)에 정의된 스타일이 적용되는지 확인하기 위한 기본 데모 페이지입니다.
                    </p>
                    <button>Click Me</button>
                    <br />
                    <input type="text" placeholder="Input field" />
                    <br />
                    <textarea placeholder="Textarea"></textarea>
                    <br />
                    <label>
                        <input type="checkbox" /> Checkbox
                    </label>
                    <br />
                    <label>
                        <input type="radio" name="demo" /> Radio Button
                    </label>
                </section>
            </main>
            <footer>
                <p>© 2025 Demo Page</p>
            </footer>
        </div>
    );
}

export default DemoPage;
