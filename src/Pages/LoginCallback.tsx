import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


export function LoginCallback(){
    const [searchParameters, _] = useSearchParams();
    const navigate = useNavigate(); // 이동 시킬 때  쓰는 훅
    const requestToServer = async (code: string) => {
        // Request Body
        const requestBody = {
            "provider": "Google",
            "authenticationCode": code
        }
    
        const response = await axios.post("https://api.blockinfra.kangdroid.me/auth/login", requestBody);
        console.log(response);
    
        // 만약 응답 값이 회원가입인 경우
        navigate("/register");

        // 만약 응답 값이 로그인 인 경우
        localStorage.setItem("accessToken", "token");
        navigate("/home");
    }

    useEffect(() => {
        const code = searchParameters.get("code");
        requestToServer(code!);
    }, [searchParameters]);
    
    return(
        <>  
        </>  
    );
}