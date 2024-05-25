import { useQuery } from '@tanstack/react-query';
import { Checkbox, Flex, Timeline, TimelineItemProps } from 'antd';
import { useState } from 'react';

import { userApi } from '../../api';
import { AuditLog } from '../../libs/core-api/api';
import { formatDate } from '../../utils/DateUtils.ts';

function removeShortTimeDuplicates(
  auditEntries: AuditLog[],
  timeIntervalMinutes: number,
): AuditLog[] {
  const result: AuditLog[] = [];
  const timeIntervalMillis = timeIntervalMinutes * 60000;
  let lastDate = new Date(0);
  let lastAuditName = '';

  auditEntries.forEach((entry) => {
    const { auditName, auditTime } = entry;
    const currentDate = new Date(auditTime!);

    if (
      auditName !== lastAuditName ||
      currentDate.getTime() - lastDate.getTime() > timeIntervalMillis
    ) {
      result.push(entry);
      lastDate = currentDate;
      lastAuditName = auditName!;
    }
  });

  return result;
}

function convertAuditLogToTimelineItem(auditLog: AuditLog): TimelineItemProps {
  const actionDescription: { [key: string]: string } = {
    CreateChannel: '채널을 생성했습니다.',
    GetChannelInformation: '채널 정보를 조회했습니다.',
    UpdateChannelInformation: '채널 설정에서 정보를 수정했습니다.',
    UpdateUserChannelRole: '특정 사용자의 채널 권한을 업데이트 했습니다.',
    RemoveUserFromChannel: '특정 사용자를 채널에서 제거했습니다.',
    AddUserToChannel: '특정 사용자를 채널에 추가했습니다.',
    GetDeploymentInformation: '배포 정보를 조회했습니다.',
    GetDeploymentInformationList: '배포 목록을 조회했습니다.',
    DestroyDeployment: '배포를 삭제했습니다.',
    ListAvailablePlugins: '사용 가능한 플러그인 목록을 조회했습니다.',
    InstallPlugin: '플러그인을 설치했습니다.',
    ListSketchesInChannel: '채널 내 스케치 목록을 조회했습니다.',
    CreateSketchInChannel: '채널 내 스케치 생성했습니다.',
    UpdateSketchInChannel: '채널 내 스케치 업데이트 했습니다.',
    GetSketchInChannel: '채널 내 스케치 정보를 조회했습니다.',
    DeploySketchInChannel: '채널 내 스케치 배포했습니다.',
    UpdateUserPreference: '사용자 환경 설정 업데이트 했습니다.',
    DeleteUser: '탈퇴했습니다.',
    GetUserAuditLog: '사용자 로그를 조회했습니다.',
  };

  return {
    children: `${formatDate(auditLog.auditTime!)}: ${
      actionDescription[auditLog.auditName!] ?? auditLog.auditName
    }`,
  };
}

const useUserAuditLogQuery = (enableFullData: boolean) => {
  return useQuery({
    queryKey: ['userAuditLog', enableFullData],
    queryFn: async (): Promise<TimelineItemProps[]> => {
      const response = await userApi.getUserAuditLogAsync();
      const removedDuplicates = enableFullData
        ? response.data
        : removeShortTimeDuplicates(response.data, 10);

      return removedDuplicates.map<TimelineItemProps>(
        convertAuditLogToTimelineItem,
      );
    },
  });
};

export function AccountAuditLogView() {
  const [isFullDataEnabled, setIsFullDataEnabled] = useState<boolean>(false);
  const { data } = useUserAuditLogQuery(isFullDataEnabled);
  if (!data) return <div>Loading..</div>;
  return (
    <Flex
      style={{
        paddingTop: '16px',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Checkbox
        onChange={(event) => {
          setIsFullDataEnabled(event.target.checked);
        }}
        checked={isFullDataEnabled}
      >
        전체 사용자 로그 보기
      </Checkbox>
      <Timeline items={data} />
    </Flex>
  );
}
