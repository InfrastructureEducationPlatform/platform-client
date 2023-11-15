import { AxiosHeaders } from "axios";
import { userApi } from "../api";
import { FaRegBell } from "react-icons/fa6";
import {useEffect, useState} from 'react'
import { ChannelPermissionProjection, ChannelPermissionType } from "../libs/core-api/api";

class ChannelPermission implements ChannelPermissionProjection {
    userId: string;
    channelId: string;
    channelPermissionType: ChannelPermissionType;
    createdAt: string;
  
    // 추가적인 생성자나 메서드 등이 필요하다면 여기에 추가할 수 있습니다.
    constructor(userId: string, channelId: string, channelPermissionType: ChannelPermissionType, createdAt: string) {
      this.userId = userId;
      this.channelId = channelId;
      this.channelPermissionType = channelPermissionType;
      this.createdAt = createdAt;
    }
  }
  

export function TopBarHeader(){
    // let channelList:ChannelPermissionProjection = {userId: "", };
    const [profilePictureImageUrl, setProfilePictureImageUrl] = useState('');
    const [channelPermissionList, setChannelPermissionList] = useState<ChannelPermission[]>([]);

    // const [selectedChannelId, setSelectedChannelId] = useState('');

    useEffect(()=>{
        const fetchData =async () => {
            try{
                let accessToken:string = localStorage.getItem("accessToken")||"";
                const headers = new AxiosHeaders();
                headers.setAuthorization(`Bearer ${accessToken}`);
                const userDetail = await userApi.getUsersDetailProjectionAsync({headers});

                setChannelPermissionList(userDetail.data.channelPermissionList);
                setProfilePictureImageUrl(userDetail.data.profilePictureImageUrl||"https://avatars.githubusercontent.com/u/141570137?s=200&v=4");
                
                console.log(channelPermissionList);
                localStorage.setItem('selectedChannelId',channelPermissionList[0].channelId)

            } catch(error){
                console.error("There is problem"+error);
            }
        };

        fetchData();
    },[]);

    useEffect(() => {
        
    }, [channelPermissionList]);

    
    return(
    <header style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: '100%',
        height: '80px',
        backgroundColor: '#FFFFFF',
        stroke: '#25282F',
        strokeOpacity: '10.2%',
        }}>
        <div style={{
            display:"flex",
            width: '96%',
            height: '100%',
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <div>
                {/* <a>{channelPermissionList[0].channelId}</a> */}
            </div>
            <nav>
                <ul style={{
                    display: 'flex',
                    listStyle: 'none',
                }}>
                <li>
                    <FaRegBell size = "42px"/>
                </li>
                <li>
                    <div style={{
                        borderRadius: '70%',
                        overflow: 'hidden',
                    }}>
                        <img src={profilePictureImageUrl} style={{height: '45px', width: '45px'}}></img>
                    </div>
                </li>
                </ul>
            </nav>
        </div>
    </header>);
}