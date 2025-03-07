const CompanyTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "info", name: "회사 정보" },
        { id: "jobs", name: "채용 공고" },
        { id: "reviews", name: "기업 리뷰" }
    ];

    return (
        <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default CompanyTabs;