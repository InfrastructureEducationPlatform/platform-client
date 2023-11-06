import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


export function LoginCallback(){
    const [searchParameters, _] = useSearchParams();
    const navigate = useNavigate(); // 이동 시킬 때  쓰는 훅
    const requestToServer = async (code: string) => {
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