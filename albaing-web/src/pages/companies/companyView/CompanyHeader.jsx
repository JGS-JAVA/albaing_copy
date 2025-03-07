import { formatDate } from '../../../utils/dateUtils';

const CompanyHeader = ({ company }) => {
    if (!company) return null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="md:flex p-6">
                <div className="md:flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0 md:mr-6">
                    {company.companyLogo ? (
                        <img
                            src={company.companyLogo}
                            alt={`${company.companyName} 로고`}
                            className="h-32 w-32 object-contain"
                        />
                    ) : (
                        <div className="h-32 w-32 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-2xl font-bold">{company.companyName?.substring(0, 1)}</span>
                        </div>
                    )}
                </div>

                <div className="md:flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.companyName}</h1>
                    <p className="text-gray-600 mb-4">{company.companyDescription || "회사 소개가 없습니다."}</p>

                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">대표자:</span> {company.companyOwnerName}
                        </div>
                        <div>
                            <span className="font-medium">설립일:</span> {formatDate(company.companyOpenDate)}
                        </div>
                        <div>
                            <span className="font-medium">주소:</span> {company.companyLocalAddress}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyHeader;