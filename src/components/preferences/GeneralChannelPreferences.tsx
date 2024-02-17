import { Divider, Flex, Input, Typography } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { channelApi } from '../../api';
import { ChannelInformationResponse } from '../../libs/core-api/api';
import { ImageUploader } from '../ProfileImageUploader.tsx';

export function GeneralChannelPreferences({
  channelId,
  forceReloadUserContext,
}: {
  channelId: string;
  forceReloadUserContext: (forceReload: string) => void;
}) {
  const [forceReloadChannelKey, setForceReloadChannelKey] =
    useState<string>('');
  const [channelInformation, setChannelInformation] =
    useState<ChannelInformationResponse>();

  useEffect(() => {
    (async () => {
      const response = await channelApi.getChannelInformationAsync(channelId);
      setChannelInformation(response.data);
      setChannelName(response.data.name);
      setChannelDescription(response.data.description);
    })();
  }, [channelId, forceReloadChannelKey]);

  const [channelName, setChannelName] = useState<string>('');
  const [channelDescription, setChannelDescription] = useState<string>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const channelPreferenceEditCallback = useCallback(
    debounce(async (targetChannelId: string, desc: string, name: string) => {
      await channelApi.updateChannelInformationAsync(targetChannelId, {
        channelDescription: desc,
        channelName: name,
        profileImageUrl: null,
      });
      forceReloadUserContext(new Date().toISOString());
      setForceReloadChannelKey(new Date().toISOString());
    }, 1000),
    [],
  );

  if (channelInformation === undefined) {
    return <div>로딩중</div>;
  }

  return (
    <Flex
      style={{
        flexDirection: 'column',
        padding: '20px',
        width: 'calc(100% - 240px)',
        overflow: 'auto',
        lineHeight: 'initial',
      }}
    >
      <div>
        <Typography.Title level={4}>채널 기본 정보</Typography.Title>
        <Divider style={{ width: '100%', margin: 0 }} />
        <Flex style={{ marginTop: '10px', gap: '20px', alignItems: 'center' }}>
          <ImageUploader
            defaultImageUrl={
              channelInformation.profileImageUrl as undefined | string
            }
            onImageUploaded={(imageUrl) => {
              (async () => {
                await channelApi.updateChannelInformationAsync(channelId, {
                  channelDescription: channelInformation.description,
                  channelName: channelInformation.name,
                  profileImageUrl: imageUrl,
                });
                forceReloadUserContext(new Date().toISOString());
                setForceReloadChannelKey(new Date().toISOString());
              })();
            }}
            onImageDeleted={() => {
              (async () => {
                await channelApi.updateChannelInformationAsync(channelId, {
                  channelDescription: channelInformation.description,
                  channelName: channelInformation.name,
                  profileImageUrl: null,
                });
                forceReloadUserContext(new Date().toISOString());
                setForceReloadChannelKey(new Date().toISOString());
              })();
            }}
          />
          <div>
            <div>
              <Typography.Text type={'secondary'}>채널 이름</Typography.Text>
              <Input
                value={channelName}
                placeholder={'채널 이름을 입력해주세요'}
                onInput={(event) => {
                  setChannelName((event.target as HTMLInputElement).value);
                  channelPreferenceEditCallback(
                    channelId,
                    channelDescription,
                    (event.target as HTMLInputElement).value,
                  );
                }}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <Typography.Text type={'secondary'}>채널 설명</Typography.Text>
              <Input
                value={channelDescription}
                placeholder={'채널 설명을 입력해 주세요.'}
                onInput={(event) => {
                  setChannelDescription(
                    (event.target as HTMLInputElement).value,
                  );
                  channelPreferenceEditCallback(
                    channelId,
                    (event.target as HTMLInputElement).value,
                    channelName,
                  );
                }}
              />
            </div>
          </div>
        </Flex>
      </div>
    </Flex>
  );
}
