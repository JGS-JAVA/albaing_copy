// DemoPage.jsx
import React from 'react';

function DemoPage() {
    return (
        <div>
            {/* 헤더 */}
            <header className="border-b border-gray-200 py-4 mb-8">
                <h1 className="text-3xl font-bold text-center">Demo Page</h1>
            </header>

            <main className="space-y-12">
                {/* 기존 데모 섹션 (텍스트, 버튼, 카드, 아바타) */}
                <section className="space-y-4">
                    <h2>Basic Elements</h2>
                    <h3>Headings & Paragraph</h3>
                    <p>
                        이 페이지는 전역 CSS (index.css)에 정의된 스타일이 적용되는지 확인하기 위한 기본 데모 페이지입니다.
                    </p>
                    <button className="button">Click Me</button>
                    <br />
                    <input type="text" placeholder="Input field" className="mt-2" />
                    <br />
                    <textarea placeholder="Textarea" className="textarea mt-2" spellCheck="false"></textarea>
                    <br />
                    <div>
                        <label className="mr-4">
                            <input type="checkbox" className="checkbox mr-1" /> Checkbox
                        </label>
                        <label>
                            <input type="radio" name="demo" className="radio mr-1" /> Radio Button
                        </label>
                    </div>
                    <div className="card p-4 mt-4">
                        <h3>Card Title</h3>
                        <p>Card content line 1</p>
                        <p>Card content line 2</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                        <img
                            src="https://via.placeholder.com/80"
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

                {/* Typography 플러그인 활용 섹션 */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">Typography (Prose)</h2>
                    <div className="prose max-w-none p-8">
                        <h1>Heading 1</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel urna euismod,
                            convallis nisi eget, volutpat justo. Donec ac lorem sed massa vestibulum tempor.
                        </p>
                        <h2>Heading 2</h2>
                        <p>
                            Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
                            cubilia curae; Praesent sed leo quis neque faucibus placerat.
                        </p>
                        <h3>Heading 3</h3>
                        <p>
                            Curabitur tincidunt, nunc at condimentum efficitur, urna urna molestie risus, vitae malesuada
                            velit risus vitae risus.
                        </p>
                        <blockquote>
                            <p>
                                "This is a blockquote. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Integer posuere erat a ante."
                            </p>
                        </blockquote>
                        <h4>Heading 4</h4>
                        <ul>
                            <li>Unordered list item one</li>
                            <li>Unordered list item two</li>
                            <li>Unordered list item three</li>
                        </ul>
                        <h5>Heading 5</h5>
                        <ol>
                            <li>Ordered list item one</li>
                            <li>Ordered list item two</li>
                            <li>Ordered list item three</li>
                        </ol>
                        <h6>Heading 6</h6>
                        <p>
                            Here is some inline code: <code>const x = 5;</code> within a paragraph.
                        </p>
                        <pre>
              <code>{`function helloWorld() {
  console.log("Hello, world!");
}`}</code>
            </pre>
                        <p>Below is a table example:</p>
                        <table>
                            <thead>
                            <tr>
                                <th>Column One</th>
                                <th>Column Two</th>
                                <th>Column Three</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Row 1, Data 1</td>
                                <td>Row 1, Data 2</td>
                                <td>Row 1, Data 3</td>
                            </tr>
                            <tr>
                                <td>Row 2, Data 1</td>
                                <td>Row 2, Data 2</td>
                                <td>Row 2, Data 3</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 확장된 Forms 예제 섹션 */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">Forms Example</h2>
                    <form className="space-y-4 max-w-lg mx-auto">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows="3"
                                placeholder="Tell us about yourself"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option>United States</option>
                                <option>Canada</option>
                                <option>United Kingdom</option>
                                <option>Australia</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="newsletter"
                                name="newsletter"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
                                Subscribe to newsletter
                            </label>
                        </div>
                        <div className="flex items-center">
                            <span className="block text-sm font-medium text-gray-700 mr-4">Gender</span>
                            <label htmlFor="gender-male" className="mr-2">
                                <input type="radio" id="gender-male" name="gender" value="male" className="radio mr-1" />
                                Male
                            </label>
                            <label htmlFor="gender-female">
                                <input type="radio" id="gender-female" name="gender" value="female" className="radio mr-1" />
                                Female
                            </label>
                        </div>
                        <div>
                            <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
                                Profile Picture
                            </label>
                            <input
                                id="profilePic"
                                name="profilePic"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                Age
                            </label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                min="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                                Birthday
                            </label>
                            <input
                                id="birthday"
                                name="birthday"
                                type="date"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="appointment" className="block text-sm font-medium text-gray-700">
                                Appointment Time
                            </label>
                            <input
                                id="appointment"
                                name="appointment"
                                type="time"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </section>
            </main>

            <footer className="border-t border-gray-200 py-4 mt-8 text-center">
                <p>© 2025 Demo Page</p>
            </footer>
        </div>
    );
}

export default DemoPage;
