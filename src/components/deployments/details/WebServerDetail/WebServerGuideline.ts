export function generateGithubIntegrationGuideline(
  channelId: string,
  sketchId: string,
  pluginId: string,
  blockId: string,
) {
  return `
**주의: 이 가이드는 Github Action을 통한 "지속적 배포(Continuous Deploy)" 가이드라인을 제공합니다.**

### 사전 요구사항
1. Github Repository에 배포할 소스코드가 존재해야 합니다.
2. Github Repository에 Workflow를 수정/실행할 권한이 있어야 합니다.
3. Github Action을 통한 지속적 통합(Continuous Integration)이 설정되어 있어야 합니다.([예시 링크](https://docs.docker.com/build/ci/github-actions/))
4. 해당 가이드라인은 Github Action을 통해 컨테이너 이미지를 레지스트리에 배포하면, 해당 정보를 이용해 서비스를 배포합니다.

### 배포 설정
1. Continuous Deployment를 위한 Github Action Workflow 파일을 열어주세요.
2. Workflow 파일에 다음과 같은 Job 코드를 추가해주세요.
   \`\`\`yaml
    deploy_bif:
      name: Deploy to Service
      runs-on: ubuntu-latest
      steps:
        - name: Checkout
          uses: actions/checkout@v3
        - name: Deploy
          uses: "./.github/actions/bif-deploy"
          with:
            channelId: '${channelId}'
            sketchId: '${sketchId}'
            pluginId: '${pluginId}'
            blockId: '${blockId}'
            dockerImageTag: '배포할 컨테이너 이미지 주소/태그'
   \`\`\`

### 전체 예시 파일
**해당 예시 파일은 1번째 Job으로 컨테이너 이미지를 빌드하고, 2번째 Job으로 배포하는 예시입니다.**
\`\`\`yaml
name: 'Demo'

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy_registry:
    concurrency:
      group: deploy_registry
      cancel-in-progress: true
    name: Build and deploy docker images
    runs-on: ubuntu-latest

    steps:
      - name: Checkout to test-server
        uses: actions/checkout@v3
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2

      - name: Initialize Docker BuildX
        uses: docker/setup-buildx-action@v1

      - name: Login to ACR
        uses: docker/login-action@v2.1.0
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}

      - name: Build, Push to Registry
        uses: docker/build-push-action@v3.2.0
        with:
          context: .
          file: ./InfrastructureDeploymentDemo/Dockerfile
          push: true
          platforms: linux/amd64,linux/arm64
          tags: kangdroid/envecho-test:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy_bif:
    needs: [deploy_registry]
    name: Deploy to BIF
    runs-on: ubuntu-latest
    steps:
      - name: Checkout to test-server
        uses: actions/checkout@v3
      - name: Deploy
        uses: "./.github/actions/bif-deploy"
        with:
          channelId: ''
          sketchId: ''
          pluginId: ''
          blockId: ''
          dockerImageTag: 'kangdroid/envecho-test:\${{ github.sha }}'
\`\`\`
`;
}
