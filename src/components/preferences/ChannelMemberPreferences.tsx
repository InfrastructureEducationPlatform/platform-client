import { Button, Divider, Flex, Table, TableProps, Typography } from 'antd';
import React, { useState } from 'react';

import { useChannelInformationQuery } from '../../api/queries.tsx';
import { useUserContext } from '../providers/UserContextProvider.tsx';

type ChannelMemberData = {
  userId: string;
  userName: string;
  userProfileImageUrl: string | undefined;
  userEmail: string;
  channelPermission: string;
  isMe: boolean;
};

const tableColumns: TableProps<ChannelMemberData>['columns'] = [
  {
    title: '사용자',
    key: 'userName',
    render: (data: ChannelMemberData) => (
      <Flex style={{ alignItems: 'center', gap: '10px' }}>
        <img
          src={data.userProfileImageUrl}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
          }}
        />
        <div>
          <Typography.Text style={{ display: 'block' }}>
            {data.userName}
          </Typography.Text>
          <Typography.Text type={'secondary'}>{data.userEmail}</Typography.Text>
        </div>
      </Flex>
    ),
  },
  {
    title: '채널 권한',
    dataIndex: 'channelPermission',
    key: 'channelPermission',
  },
  {
    title: '엑션',
    key: 'action',
    render: (data: ChannelMemberData) => (
      <Flex>
        <Button type={'link'} disabled={data.isMe}>
          권한 변경
        </Button>
        <Button type={'link'} danger={true} disabled={data.isMe}>
          채널에서 제거
        </Button>
      </Flex>
    ),
  },
];

export function ChannelMemberPreferences({ channelId }: { channelId: string }) {
  const { userContext } = useUserContext();
  const [forceReload] = useState(new Date().toISOString());
  const { data: channelInformation, isLoading } = useChannelInformationQuery(
    channelId,
    forceReload,
  );
  if (isLoading || !channelInformation) return null;

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
        <Typography.Title level={4}>소속 채널 멤버</Typography.Title>
        <Divider style={{ width: '100%', margin: 0 }} />
        <Flex style={{ marginTop: '10px', gap: '20px', alignItems: 'center' }}>
          <Table
            style={{
              width: '100%',
            }}
            columns={tableColumns}
            dataSource={channelInformation.channelUserInformationList.map<ChannelMemberData>(
              (a) => ({
                userId: a.userId,
                userName: a.name,
                userEmail: a.email,
                userProfileImageUrl: a.profilePictureImageUrl ?? undefined,
                channelPermission: a.channelPermissionType,
                isMe: a.userId === userContext.userId,
              }),
            )}
            pagination={false}
          />
        </Flex>
      </div>
    </Flex>
  );
}
