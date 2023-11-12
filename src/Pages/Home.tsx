import { userApi } from "../api";
import { AxiosHeaders } from "axios";
import { useNavigate } from "react-router-dom";

export function Home(){
    const navigate = useNavigate();
    let accessToken:string = localStorage.getItem("accessToken")||"";
    const headers = new AxiosHeaders();
    headers.setAuthorization(`Bearer ${accessToken}`);
    
    (async () =>{ 
        const userDetail = await userApi.getUsersDetailProjectionAsync({headers});
        console.log(userDetail.data);
        if (userDetail.data.channelPermissionList.length == 0){ // 채널 생성 온보딩이 필요한 경우
            navigate('/onBoarding');
        }
    })();

    return(
        <div>
            <h1>Home</h1>
        </div>
    );
    
}