import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CompanyProfileEdit = () => {
    const navigate = useNavigate();
    const { companyId } = useParams();
    const [loading, setLoading] = useState(true);
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const [formData, setFormData] = useState({
        companyName: "",
        companyLogo: "",
        companyOwnerName: "",
        companyOpenDate: "",
        companyPhone: "",
        companyEmail: "",
        companyRegistrationNumber: "",
        companyLocalAddress: "",
        companyDescription: ""
    });

    // 회사 정보 불러오기
    useEffect(() => {
        axios.get(`/api/companies/${companyId}`)
            .then((res) => {
                // 값이 없을 때 빈 문자열로 설정
                setFormData({
                    companyName: res.data.companyName || "",
                    companyLogo: res.data.companyLogo || "",
                    companyOwnerName: res.data.companyOwnerName || "",
                    companyOpenDate: res.data.companyOpenDate || "",
                    companyPhone: res.data.companyPhone || "",
                    companyEmail: res.data.companyEmail || "",
                    companyRegistrationNumber: res.data.companyRegistrationNumber || "",
                    companyLocalAddress: res.data.companyLocalAddress || "",
                    companyDescription: res.data.companyDescription || ""
                });
                setLoading(false);
            })
            .catch(() => {
                alert("회사의 정보를 불러오는 데 실패했습니다.");
                setLoading(false);
            });
    }, [companyId]);

    // 회사 정보 수정
    const editInfo = (e) => {
        e.preventDefault();

        let updatedFormData = { ...formData };

        // 로고 파일이 있을 경우 업로드 처리
        if (logo) {
            const formDataToSend = new FormData();
            formDataToSend.append("companyLogo", logo);

            // 서버에 로고 파일 업로드
            axios.post(`/api/companies/${companyId}/logo`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then((logoResponse) => {
                    // 로고 URL을 업데이트된 폼 데이터에 추가
                    updatedFormData = { ...formData, companyLogo: logoResponse.data.logoUrl };

                    // 회사 정보 수정 요청 (companyLogo를 포함한 데이터)
                    return axios.put(`/api/companies/${companyId}`, updatedFormData, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
                .then((res) => {
                    alert('회사 정보가 성공적으로 수정되었습니다!');
                    setFormData(res.data);
                    navigate(-1);
                })
                .catch(() => {
                    alert("로고 업로드 또는 회사 정보 수정에 실패했습니다.");
                });
        } else {
            // 로고 파일이 없으면 회사 정보만 수정
            axios.put(`/api/companies/${companyId}`, updatedFormData, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then((res) => {
                    alert('회사 정보가 성공적으로 수정되었습니다!');
                    setFormData(res.data);
                    navigate(-1);
                })
                .catch((error) => {
                    alert("회사의 정보를 수정하는 데 실패했습니다.");
                });
        }
    };


    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div>
            <h1>회사 정보 수정</h1>
            <form onSubmit={editInfo}>
                <div>
                    <label htmlFor="companyName">회사명</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName || ""}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="companyOwnerName">대표자명</label>
                    <input
                        type="text"
                        id="companyOwnerName"
                        value={formData.companyOwnerName || ""}
                        onChange={(e) => setFormData({...formData, companyOwnerName: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="companyOpenDate">설립일</label>
                    <input
                        type="date"
                        id="companyOpenDate"
                        value={formData.companyOpenDate || ""}
                        onChange={(e) => setFormData({...formData, companyOpenDate: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="companyPhone">연락처</label>
                    <input
                        type="tel"
                        id="companyPhone"
                        value={formData.companyPhone || ""}
                        onChange={(e) => setFormData({...formData, companyPhone: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="companyEmail">이메일</label>
                    <input
                        type="email"
                        id="companyEmail"
                        value={formData.companyEmail || ""}
                        onChange={(e) => setFormData({...formData, companyEmail: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="companyRegistrationNumber">사업자등록번호</label>
                    <input
                        type="text"
                        id="companyRegistrationNumber"
                        value={formData.companyRegistrationNumber || ""}
                        onChange={(e) => setFormData({...formData, companyRegistrationNumber: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="companyLocalAddress">회사 주소</label>
                    <input
                        type="text"
                        id="companyLocalAddress"
                        value={formData.companyLocalAddress || ""}
                        onChange={(e) => setFormData({...formData, companyLocalAddress: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="companyDescription">회사 소개</label>
                    <textarea
                        id="companyDescription"
                        value={formData.companyDescription || ""}
                        onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                        rows="4"
                    />
                </div>
                <div>
                    <label htmlFor="companyLogo">회사 로고</label>
                    <input
                        type="file"
                        id="companyLogo"
                        accept="image/*"
                        onChange={handleLogoChange}
                    />
                    {formData.companyLogo && <img src={formData.companyLogo} alt="Company Logo" width="100"/>}
                    {logoPreview && <img src={logoPreview} alt="Company Logo Preview" width="100" />}
                </div>
                <div>
                    <button type="submit">저장</button>
                </div>
            </form>
        </div>
    );
};

export default CompanyProfileEdit;
