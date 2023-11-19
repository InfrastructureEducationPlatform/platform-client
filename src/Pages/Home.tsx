import { PlusOutlined } from '@ant-design/icons';
import { Card, Divider, Flex, Typography } from 'antd';
import Meta from 'antd/es/card/Meta';
import React, { useEffect, useState } from 'react';

import { sketchApi } from '../api';
import { MainLayout } from '../components/MainLayout.tsx';
import { SketchProjection } from '../types/SketchProjection.ts';

export function Home() {
  return (
    <MainLayout>
      <SketchListView />
    </MainLayout>
  );
}

function SketchListView() {
  const selectedChannelId = localStorage.getItem('selectedChannelId')!;
  const [sketchList, setSketchList] = useState<SketchProjection[]>([]);

  useEffect(() => {
    (async () => {
      const response =
        await sketchApi.listSketchesInChannelAsync(selectedChannelId);
      setSketchList(
        response.data.map((a) => ({
          id: a.sketchId,
          name: a.name,
          description: a.description,
          blockSketch: a.blockSketch,
        })),
      );
    })();
  }, [selectedChannelId]);

  return (
    <Flex style={{ flexDirection: 'column', padding: '20px', gap: '20px' }}>
      <Flex style={{ alignItems: 'center', gap: '20px' }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          스케치 목록
        </Typography.Title>
        <Typography.Text type={'secondary'}>
          현재 채널 내 인프라 스케치 모아보기
        </Typography.Text>
      </Flex>
      <Divider style={{ margin: 0 }} />
      <Flex style={{ flexWrap: 'wrap', gap: '30px' }}>
        <Card
          style={{
            width: '300px',
            height: '280px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Flex
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PlusOutlined style={{ fontSize: '32px' }} />
            <Typography.Title level={5} style={{ marginTop: '15px' }}>
              스케치 추가
            </Typography.Title>
          </Flex>
        </Card>
        {sketchList.map((sketch) => (
          <Card
            style={{ width: '300px', height: '280px' }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
          >
            <Meta title={sketch.name} description={sketch.description} />
          </Card>
        ))}
      </Flex>
    </Flex>
  );
}
