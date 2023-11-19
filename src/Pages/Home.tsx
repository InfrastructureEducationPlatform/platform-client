import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Flex, Row, Typography } from 'antd';
import Meta from 'antd/es/card/Meta';
import { Header } from 'antd/es/layout/layout';
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
      <Row gutter={[8, 24]}>
        {sketchList.map((sketch) => (
          <Col className="gutter-row" span={5}>
            <Card
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
            >
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                }
                title={sketch.name}
                description={sketch.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Flex>
  );
}
