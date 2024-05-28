export function getDbGuideline(dbHost: string) {
  return `
  ### 데이터베이스 연결 정보
  - IP Address: ${dbHost}
  - Port: 5432
  - Username: 설정한 유저 이름(credential 파일에 적힌 이름) 
  - Password: 설정한 비밀번호(credential 파일에 적힌 비밀번호)
  
  ### PostgreSQL 접속
  - 로컬 머신에서 PostgreSQL 접속:
  \`\`\`shell
  $ psql -h ${dbHost} -U (credential파일에 적힌 유저 이름)
  \`\`\`
  
  ### 데이터베이스 백업
  - 전체 데이터베이스 백업:
  \`\`\`shell
  $ pg_dumpall -h ${dbHost} -U credential파일에_적힌_유저_이름 > all_databases_backup.sql
  \`\`\`
  
  - 특정 데이터베이스 백업:
  \`\`\`shell
  $ pg_dump -h ${dbHost} -U credential파일에_적힌_유저_이름 -d 데이터베이스_이름 > backup.sql
  \`\`\`
  
  ### 데이터베이스 복원
  - 전체 데이터베이스 복원:
  \`\`\`shell
  $ psql -h ${dbHost} -U credential파일에_적힌_유저_이름 -f all_databases_backup.sql
  \`\`\`
  
  - 특정 데이터베이스 복원:
  \`\`\`shell
  $ psql -h ${dbHost} -U credential파일에_적힌_유저_이름 -d db_이름 -f backup.sql
  \`\`\`
  
  ### 일반적인 문제 해결
  1. **"FATAL: password authentication failed for user" 오류**: 
     - 사용자가 올바른 권한을 가지고 있는지 확인하고, 비밀번호가 정확한지 다시 확인하세요.
  `;
}
