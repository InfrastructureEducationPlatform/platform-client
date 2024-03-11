import { Button, Carousel, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CarouselContents, CarouselFullContents, CarouselLeftDescriptionContents } from '../components/OnboardingContents';


export function OnBoarding() {
  const navigate = useNavigate();
  return(
      <Flex style={{gap: 30, display: 'flex', width:'100vw',height: '100vh',flexDirection: 'column'}}>
          <Carousel style={{flex: 3, height: '75vh', backgroundColor:'#D8D8D8'}}>
              <Flex style={{justifyContent: 'center'}}>
                  <CarouselFullContents title="환영합니다" contents = '여러 클라우드 Provider의 서비스를 추상화하여 사용자에게 편리한 클라우드 구축 서비스를 제공하는 플랫폼 기반의 서비스입니다. 사용하기에 앞서, 간단한 설명을 확인해볼까요?' imgUrl="" />
              </Flex>
              <Flex style={{justifyContent: 'center'}}>
                  <CarouselLeftDescriptionContents title='복잡한 작업을 간소화하세요.' contents="인프라 구축에 필요했던 반복적이고 복잡했던 설정 작업, 이제는 블록으로 간소화하세요." imgUrl=""/>
              </Flex>
              <Flex style={{justifyContent: 'center'}}>
                  <CarouselLeftDescriptionContents title='나의 클라우드 인프라를 한 눈에 확인하세요.' contents="복잡한 인프라 구조를 스케치를 통해 한 눈에 확인하세요." imgUrl=""/>
              </Flex>
              <>
                <Typography.Title style= {{padding:30, paddingBottom: 10}}level={1}>기능 설명</Typography.Title>
                <Flex style={{flex: 5,justifyContent: 'space-around', paddingTop:10}}>
                    <CarouselContents title='블록' contents = {['클라우드 기능별로 나누어져 있는 단위',]} imgUrl="" />
                    <CarouselContents title='스케치' contents = {['블록을 배치할 수 있는 공간']} imgUrl="" />
                    <CarouselContents title='채널' contents = {['사용자가 스케치를 공유할 수 있는 공간.','같은 채널 사용자는 해당 채널에 존재하는 여러 스케치 열람 및 작업 가능']} imgUrl="" />
                    <CarouselContents title='배포' contents = {['스케치로 구축한 클라우드 인프라를 실제 클라우드 서비스와 연결하는 과정']} imgUrl="" />
                </Flex>
              </>
              <Flex style={{justifyContent: 'center'}}>
                  <CarouselFullContents title="블록코딩을 통한 손쉬운 클라우드 인프라 구축 서비스, 이제 시작해볼까요?" contents = '채널 생성을 통해 당신만의 클라우드 인프라를 구축해보세요.' imgUrl="" />
              </Flex>
          </Carousel>
          <Flex style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
              <Button type = "primary" onClick={() => navigate('/createChannel')}>채널 생성</Button>
          </Flex>
      </Flex>  
  );
}