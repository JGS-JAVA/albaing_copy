import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button className="btn" onClick={() => navigate("person")}>유저 회원가입</button>
            <button className="btn ml-10" onClick={() => navigate("company")}>기업 회원가입</button>
        </div>
    );
}

export default RegisterPage;