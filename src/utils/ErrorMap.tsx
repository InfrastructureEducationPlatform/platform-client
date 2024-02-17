export const ErrorMap: { [key: string]: string } = {
  // Common Area
  UnknownError: '알 수 없는 오류가 발생했습니다.',

  // Deployment Area
  DeploymentNotFound: '배포를 찾을 수 없습니다.',

  // File Area
  FileFormatNotSupported: '지원하지 않는 파일 형식입니다.',
  FileNotFound: '파일을 찾을 수 없습니다.',

  // Sketch Area
  SketchNotFound: '스케치를 찾을 수 없습니다.',

  // User Area
  UserNotFound: '사용자를 찾을 수 없습니다.',

  // Auth Area
  OAuthFailed: 'OAuth 정보를 불러오는 중 문제가 발생했습니다.',
  JoinTokenValidationFailed: 'Join Token 의 JWT 검증에 실패했습니다.',
  CredentialAlreadyExists: '이미 같은 인증 정보로 가입한 이력이 있습니다.',
  AuthenticationFailed: '인증에 실패했습니다.',
  ChannelAuthorizationFailed: '채널 권한이 부족하여 인가에 실패했습니다.',
  RefreshInvalidAccessToken: '잘못된 엑세스 토큰으로 리프레시를 시도했습니다.',
  InvalidRefreshToken: '잘못된 리프레시 토큰입니다.',
  RefreshExpired: '리프레시 토큰이 만료되었습니다.',

  // Channel Area
  ChannelNotFound: '채널을 찾을 수 없습니다.',
  ChannelPermissionNotFound: '채널 권한을 찾을 수 없습니다.',
  CannotChangeOwnRole: '자신의 권한을 변경할 수 없습니다.',
  CannotRemoveSelf: '자신을 채널에서 제거할 수 없습니다.',
  CannotAddSelf: '자신을 채널에 추가할 수 없습니다.',
  CannotAddDuplicatePermission:
    '채널에 이미 해당 권한을 가진 사용자가 존재합니다.',
};
