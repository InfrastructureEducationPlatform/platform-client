import { Tour, TourProps } from 'antd';
import React, { useRef } from 'react';

import { MainLayout } from '../components/MainLayout.tsx';
import { SketchListView } from './Home.tsx';

type CreateSketchType = {
  name: string;
  description: string;
};

// SketchListView 컴포넌트에 전송하는 refs의 type
type SketchListViewRefsType = {
  sketchListRef: React.MutableRefObject<undefined>;
  createSketchButtonRef: React.MutableRefObject<undefined>;
};

export function OnboardingTour() {
  const refTest = useRef<HTMLDivElement>(null);
  const refSketchButton = useRef<HTMLDivElement>(null);
  const refSelector = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: '환영합니다.',
      description:
        '본 화면은 채널 홈화면입니다. 같은 채널의 구성원 간의 스케치를 공유할 수 있습니다.',
    },
    {
      title: '채널 네비게이션바',
      description:
        '채널 네비게이션바를 통해 본인이 속한 다른 채널 홈화면으로 이동할 수 있습니다.',
      target: () => refSelector.current!,
    },
    {
      title: '스케치 목록',
      description:
        '스케치 목록에서는 본 채널에서 작성한 스케치를 확인할 수 있습니다.',
      target: () => {
        return refTest.current!;
      },
    },
    {
      title: '새로운 스케치를 생성해볼까요?',
      description:
        '현재 표시된 스케치 생성 버튼을 누르면 새로운 스케치를 생성할 수 있습니다.',
      target: () => refSketchButton.current!,
    },
  ];
  return (
    <>
      <MainLayout selectorRef={refSelector} pageKey={'sketch-list'}>
        <SketchListView
          sketchListViewRef={refTest}
          createSketchButtonRef={refSketchButton}
        />
      </MainLayout>
      <Tour
        open={true}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
    </>
  );
}
