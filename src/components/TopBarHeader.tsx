import { useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa6';

import { userApi } from '../api';
import { ChannelPermissionProjection } from '../libs/core-api/api';

export function TopBarHeader() {
  const [profilePictureImageUrl, setProfilePictureImageUrl] = useState('');
  const [channelPermissionList, setChannelPermissionList] = useState<
    ChannelPermissionProjection[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetail = await userApi.getUsersDetailProjectionAsync();

        setChannelPermissionList(userDetail.data.channelPermissionList);
        setProfilePictureImageUrl(
          userDetail.data.profilePictureImageUrl ||
            'https://avatars.githubusercontent.com/u/141570137?s=200&v=4',
        );
      } catch (error) {
        console.error('There is problem' + error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [channelPermissionList]);

  return (
    <header
      style={{
        left: 0,
        top: 0,
        width: '100%',
        height: '80px',
        backgroundColor: '#FFFFFF',
        stroke: '#25282F',
        strokeOpacity: '10.2%',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '96%',
          height: '100%',
          margin: '0 auto',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div>
            <a>{channelPermissionList[0]?.channelId ?? ''}</a>
          </div>

          <div>
            <button onClick={() => setIsOpen(!isOpen)}>열기</button>
            {isOpen ? (
              <ul>
                {channelPermissionList.map((channel, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() =>
                        localStorage.setItem(
                          'selectedChannelId',
                          channel.channelId,
                        )
                      }
                    >
                      {channel.channelId}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <></>
            )}
          </div>
        </div>

        <nav>
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
            }}
          >
            <li>
              <FaRegBell size="42px" />
            </li>
            <li>
              <div
                style={{
                  borderRadius: '70%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={profilePictureImageUrl}
                  style={{ height: '45px', width: '45px' }}
                ></img>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
