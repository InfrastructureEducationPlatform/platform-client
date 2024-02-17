import {
  Button,
  Divider,
  Dropdown,
  Flex,
  Input,
  List,
  MenuProps,
  Select,
  Table,
  TableProps,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

import {
  useAddMemberToChannelMutation,
  useRemoveUserFromChannelMutation,
  useUpdateChannelPermissionMutation,
} from '../../api/mutation.tsx';
import {
  useChannelInformationQuery,
  useChannelUserSearch,
} from '../../api/queries.tsx';
import {
  ChannelPermissionType,
  UserSearchResponse,
} from '../../libs/core-api/api';
import { CustomModal } from '../CustomModal.tsx';
import { useUserContext } from '../providers/UserContextProvider.tsx';

type ChannelMemberData = {
  userId: string;
  userName: string;
  userProfileImageUrl: string | undefined;
  userEmail: string;
  channelPermission: string;
  isMe: boolean;
  removeUserFromChannel: () => void;
  updateChannelPermission: (
    channelPermissionType: ChannelPermissionType,
  ) => void;
};

const permissionDropDownItems: MenuProps['items'] = [
  {
    key: 'Owner',
    label: '채널 소유자',
  },
  {
    key: 'Reader',
    label: '읽기 전용',
  },
];

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
    key: 'channelPermission',
    render: (data: ChannelMemberData) => <Tag>{data.channelPermission}</Tag>,
  },
  {
    title: '엑션',
    key: 'action',
    render: (data: ChannelMemberData) => (
      <Flex>
        <Dropdown
          disabled={data.isMe}
          menu={{
            items: permissionDropDownItems,
            onClick: (a) => {
              data.updateChannelPermission(a.key as ChannelPermissionType);
            },
          }}
        >
          <Button type={'link'}>권한 변경</Button>
        </Dropdown>
        <Button
          type={'link'}
          danger={true}
          disabled={data.isMe}
          onClick={data.removeUserFromChannel}
        >
          채널에서 제거
        </Button>
      </Flex>
    ),
  },
];

export function ChannelMemberPreferences({ channelId }: { channelId: string }) {
  const { userContext } = useUserContext();
  const [forceReload] = useState(new Date().toISOString());
  const [searchParams, setSearchParams] = useState('');
  const { data: channelInformation, isLoading } = useChannelInformationQuery(
    channelId,
    forceReload,
  );
  const { mutate: updateChannelPermission } =
    useUpdateChannelPermissionMutation(channelId);
  const { mutate: removeUserFromChannel } =
    useRemoveUserFromChannelMutation(channelId);
  const { data: channelUserSearchResult } = useChannelUserSearch(searchParams);

  const [openChannelMemberModal, setOpenChannelMemberModal] = useState(false);

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
        <Flex
          style={{
            marginTop: '10px',
            gap: '10px',
            flexDirection: 'column',
          }}
        >
          <div>
            <Button
              type={'primary'}
              onClick={() => setOpenChannelMemberModal(true)}
            >
              채널 멤버 추가
            </Button>
          </div>
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
                removeUserFromChannel: () => removeUserFromChannel(a.userId),
                updateChannelPermission: (channelPermissionType) =>
                  updateChannelPermission({
                    targetUserId: a.userId,
                    channelPermissionType,
                  }),
              }),
            )}
            pagination={false}
          />
        </Flex>
      </div>
      <CustomModal
        isVisible={openChannelMemberModal}
        onOuterClick={() => setOpenChannelMemberModal(false)}
        style={{
          width: '600px',
          height: '400px',
          overflow: 'hidden',
        }}
      >
        <Flex style={{ flexDirection: 'column' }}>
          <Input
            placeholder={'이름 혹은 이메일을 입력하세요.'}
            size={'large'}
            onInput={(e) => setSearchParams(e.currentTarget.value)}
            style={{
              border: 'none',
              borderRadius: '0',
              borderBottom: '1px solid #d9d9d9',
            }}
          />
          <List
            itemLayout={'horizontal'}
            dataSource={channelUserSearchResult}
            renderItem={(item) => (
              <ChannelMemberListItem
                userSearchResponse={item}
                channelId={channelId}
              />
            )}
          />
        </Flex>
      </CustomModal>
    </Flex>
  );
}

function ChannelMemberListItem({
  userSearchResponse,
  channelId,
}: {
  userSearchResponse: UserSearchResponse;
  channelId: string;
}) {
  const [channelPermission, setChannelPermission] =
    useState<ChannelPermissionType>('Reader');
  const { mutate: addMemberToChannel } =
    useAddMemberToChannelMutation(channelId);
  return (
    <Flex
      style={{
        justifyContent: 'space-between',
        padding: '20px',
        width: '100%',
      }}
    >
      <Flex
        style={{
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <img
          src={userSearchResponse.profilePictureImageUrl ?? ''}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
          }}
        />
        <div>
          <Typography.Text style={{ display: 'block' }}>
            {userSearchResponse.userName}
          </Typography.Text>
          <Typography.Text type={'secondary'}>
            {userSearchResponse.userEmail}
          </Typography.Text>
        </div>
      </Flex>
      <Flex gap={'10px'} align={'center'}>
        <Select
          options={[
            { label: '읽기 전용', value: 'Reader' },
            { label: '채널 소유자', value: 'Owner' },
          ]}
          defaultValue={channelPermission}
          onSelect={(a) => setChannelPermission(a)}
        />
        <Button
          type={'primary'}
          onClick={() =>
            addMemberToChannel({
              targetUserId: userSearchResponse.userId,
              channelPermissionType: channelPermission,
            })
          }
        >
          초대
        </Button>
      </Flex>
    </Flex>
  );
}
