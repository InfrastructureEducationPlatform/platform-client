import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Typography,
} from 'antd';
import Meta from 'antd/es/card/Meta';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { sketchApi } from '../api';
import { MainLayout } from '../components/MainLayout.tsx';
import { useChannelNavigationContext } from '../components/providers/ChannelNavigationProvider.tsx';
import { SketchProjection } from '../types/SketchProjection.ts';

type CreateSketchType = {
  name: string;
  description: string;
};

export function Home() {
  return (
    <MainLayout pageKey={'sketch-list'}>
      <SketchListView />
    </MainLayout>
  );
}

export function SketchListView({
  sketchListViewRef,
  createSketchButtonRef,
}: {
  sketchListViewRef?: React.Ref<HTMLDivElement> | undefined;
  createSketchButtonRef?: React.Ref<HTMLDivElement> | undefined;
}) {
  const [form] = Form.useForm();
  const { currentChannel } = useChannelNavigationContext();
  const [sketchList, setSketchList] = useState<SketchProjection[]>([]);
  const [isCreateOpenModal, setIsCreateOpenModal] = useState<boolean>(false);
  const [isSketchCreated, setIsSketchCreated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await sketchApi.listSketchesInChannelAsync(
        currentChannel.channelId,
      );
      setSketchList(
        response.data.map((a) => ({
          id: a.sketchId,
          name: a.name,
          description: a.description,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        })),
      );
    })();
  }, [currentChannel, isSketchCreated]);

  return (
    <>
      <Flex
        ref={sketchListViewRef}
        style={{ flexDirection: 'column', padding: '20px', gap: '20px' }}
      >
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
            onClick={() => setIsCreateOpenModal(true)}
            ref={createSketchButtonRef}
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
              key={sketch.id}
              style={{ width: '300px', height: '280px' }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              onClick={() => navigate(`/sketches/${sketch.id}`)}
            >
              <Meta title={sketch.name} description={sketch.description} />
            </Card>
          ))}
        </Flex>
      </Flex>
      <Modal
        open={isCreateOpenModal}
        footer={[
          <Button onClick={() => setIsCreateOpenModal(false)}>취소</Button>,
          <Button form={'createSketchForm'} type="primary" htmlType="submit">
            채널 생성
          </Button>,
        ]}
        closable={false}
      >
        <Flex style={{ flexDirection: 'column', gap: '20px' }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              스케치 생성
            </Typography.Title>
            <Divider style={{ margin: 0, marginTop: '10px' }} />
          </div>
          <Form
            form={form}
            id={'createSketchForm'}
            name="basic"
            onFinish={(value) => {
              (async () => {
                await sketchApi.createSketchAsync(currentChannel.channelId, {
                  name: value.name,
                  description: value.description,
                  blockSketch: {
                    sketchId: 'not-set',
                    blockList: [],
                  },
                });
                setIsSketchCreated(!isSketchCreated);
                setIsCreateOpenModal(false);
                form.resetFields();
              })();
            }}
            autoComplete="off"
          >
            <Form.Item<CreateSketchType>
              label="스케치 이름"
              name={'name'}
              rules={[
                { required: true, message: '스케치 이름을 입력해 주세요!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<CreateSketchType>
              label="스케치 설명"
              name={'description'}
              rules={[
                { required: true, message: '스케치 설명을 입력해 주세요!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Flex>
      </Modal>
    </>
  );
}
