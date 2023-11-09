import { FormEvent, useState } from "react";
import { channelApi } from "../api";
import { useNavigate } from "react-router-dom";
import { AxiosHeaders } from "axios";

export function CreateChannel(){
    const navigate = useNavigate();
    const [channelName, setChannelName] = useState("");
    const [channelInfo, setChannelInfo] = useState("");
    const [channelImgUrl, setChannelImgUrl] = useState("");

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        // Form의 기본 엑션 방지
        event.preventDefault();
        
        let accessToken:string = localStorage.getItem("accessToken")||"";
        const headers = new AxiosHeaders();
        headers.setAuthorization(`Bearer ${accessToken}`);
        
        
        (async() => {
            const response = await channelApi.createChannelAsync({
                name: channelName,
                description: channelInfo,
                imageUrl: null
            }, {headers: headers});
            console.log(response);
            
            if(response != null){
                navigate('/');
            }
            
        })();
    }

    return(
        <>
        <form onSubmit={onSubmit}>
            <h1>채널 생성</h1>
            <div>
                <label htmlFor="channelNameInput">채널명</label>
                <input 
                    id="channelNameInput"
                    type="text"
                    value={channelName}
                    onChange={(event) => setChannelName(event.target.value)}
                    />
            </div>
            <div>
                <label htmlFor="channelInfoInput">채널 소개</label>
                <input
                    id="channelInfoInput"
                    type="text"
                    value={channelInfo}
                    onChange={(event) => setChannelInfo(event.target.value)}
                    />
            </div>
            <div>
                <label htmlFor = "channelImgUrlInput">채널 프로필 이미지</label>
                <input
                    id="channelImgUrlInput"
                    type="image"
                    value={channelImgUrl}
                    onChange={(event) => setChannelImgUrl(event.target.value)}/>
            </div>
            <button type="submit">채널 생성</button>
        </form>
        </>
    );
}