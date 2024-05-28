export function VirtualMachineGuideline(ipAddress: string): string {
  return `
  ### SSH Client 설치
  - Windows: [PuTTY](https://www.putty.org/)
  - Linux/macOS: 시스템에 내장된 SSH 명령어 활용
  
  ### 기본 연결 정보
  - IP Address: ${ipAddress}
  - Port: 22
  - Username: ubuntu
  - Password: 비밀번호 없음, SSH Private Key로 인증 진행("배포 정보" 탭의 SSH Private Key 다운로드)
 
  ### SSH 연결
  \`\`\`shell
  $ chmod 400 /path/to/key.pem
  $ ssh -i /path/to/key.pem ubuntu@${ipAddress}
  \`\`\`

  ### SCP를 이용한 파일 전송
  - 로컬에서 원격 서버로 파일 전송:
  \`\`\`shell
  $ scp -i /path/to/key.pem /path/to/localfile ubuntu@${ipAddress}:/path/to/remotefile
  \`\`\`

  - 원격 서버에서 로컬로 파일 전송:
  \`\`\`shell
  $ scp -i /path/to/key.pem ubuntu@${ipAddress}:/path/to/remotefile /path/to/localfile
  \`\`\`

  ### 일반적인 문제 해결
  1. **"Permission denied (publickey)" 오류**: 
     - SSH 프라이빗 키의 권한을 확인하십시오. 올바른 권한은 \`400\`입니다.
     \`\`\`shell
     $ chmod 400 /path/to/key.pem
     \`\`\`
     - SSH 키 경로가 올바르고, 올바른 프라이빗 키를 사용하는지 확인하십시오.

  2. **"Connection timed out" 오류**:
     - IP 주소와 포트가 올바른지, 오타가 없는지 확인하십시오.
  `;
}
