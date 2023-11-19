export type UserContext = {
  userId: string;
  userName: string;
  userEmail: string;
  userProfilePictureUrl: string | undefined;
  channelPermissions: ChannelPermission[];
};

type ChannelPermission = {
  id: string;
  name: string;
  permission: 'Owner' | 'Reader';
};
