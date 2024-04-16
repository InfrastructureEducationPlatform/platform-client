import { EditOutlined, EllipsisOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Dropdown,
  Flex,
  Form,
  Input,
  MenuProps,
  Modal,
  Spin,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { sketchApi } from '../api';
import { MainLayout } from '../components/MainLayout.tsx';
import { useChannelNavigationContext } from '../components/providers/ChannelNavigationProvider.tsx';
import { SketchProjection } from '../types/SketchProjection.ts';

type CreateSketchType = {
  name: string;
  description: string;
};

export function Home() {
  const location = useLocation();
  const state = { ...location.state };
  const userContextReloadKey = state.userContextReloadKey;
  return (
    <MainLayout pageKey={'sketch-list'} userContextReloadKey={userContextReloadKey}>
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
  const [createForm] = Form.useForm();
  const [modifyForm] = Form.useForm();
  const { currentChannel } = useChannelNavigationContext();
  const [sketchList, setSketchList] = useState<SketchProjection[]>([]);
  const [isCreateOpenModal, setIsCreateOpenModal] = useState<boolean>(false);
  const [isSketchCreated, setIsSketchCreated] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isModifyOpenModal, setIsModifyOpenModal] = useState<boolean>(false);
  const [selectedSketch, setSelectedSketch] = useState<SketchProjection>({'id':'', 'name':'', 'description':'', 'createdAt':'', 'updatedAt':'', 'blockSketch':''});
  const items: MenuProps['items'] = [
    {
      label: "설명 수정",
      key: 'rename',
      onClick: () => {
        setIsModifyOpenModal(true);
      }
    },
    {
      type: 'divider',
    },
    {
      label: "Delete",
      key: 'delete',
      danger: true,
      onClick: () => {

      }
    },
  ];
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          blockSketch: a.blockSketch,
        })),
      );
    })();
  }, [currentChannel, isSketchCreated]);
  useEffect(()=>{
    modifyForm.setFieldsValue(selectedSketch);
  },[selectedSketch]);
  return (
    <>
      <Flex
        ref={sketchListViewRef}
        style={{ flexDirection: 'column', padding: '20px', gap: '20px', zIndex:2 }}
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
              minWidth: '300px',
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
          {sketchList.map((sketch) => {

            return (
              <Card
                style={{ width: '300px', minWidth: '300px', }}
                key={sketch.id}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    onClick={() => navigate(`/sketches/${sketch.id}`)} />
                }
              >
                <div className='SketchOption' style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignContent: 'space-between' }}>
                    <div style={{ flex: 9, overflow: 'hidden' }}>
                      <Typography.Text ellipsis style={{ fontSize: 16, fontWeight: 600 }}>
                        {sketch.name}
                      </Typography.Text>
                    </div>
                    <Dropdown menu={{ items }} trigger={['click']}>
                      <EllipsisOutlined onClick={()=> {
                        setSelectedSketch(sketch);
                      }}/>
                    </Dropdown>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Typography.Text ellipsis style={{ flex: 1, fontSize: 12, color: 'gray' }}>
                      {sketch.description}
                    </Typography.Text >
                  </div>
                </div>

              </Card>);
          })}
        </Flex>
      </Flex>
      <Modal
        key={'createSketchModal'}
        open={isCreateOpenModal}
        footer={[
          <Button key={'cancleBtn'} onClick={() => setIsCreateOpenModal(false)}>취소</Button>,
          <Button key = {'submitBtn'}form={'createSketchForm'} type="primary" htmlType="submit">
            스케치 생성
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
            form={createForm}
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
                createForm.resetFields();
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
      <Modal
        key={'modifySketchModal'}
        open={isModifyOpenModal}
        footer={[
          <Button key = 'cancleBtn' onClick={() => setIsModifyOpenModal(false)}>취소</Button>,
          <Button key = 'submitBtn' form={'modifySketchForm'} type="primary" htmlType="submit">
            스케치 수정
          </Button>,
        ]}
        closable={false}
      >
        <Flex style={{ flexDirection: 'column', gap: '20px' }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              스케치 정보
            </Typography.Title>
            <Divider style={{ margin: 0, marginTop: '10px' }} />
          </div>
        <Form
          form={modifyForm}
          id={'modifySketchForm'}
          name="modifySketchForm"
          onFinish={(value) => {
            setIsLoading(true);
            // 스케치 이름, 설명 수정 요청
            (async () => {
              const result = await sketchApi.updateSketchAsync(
                currentChannel.channelId, 
                selectedSketch.id, 
                {
                  name: value.name,
                  description: value.description,
                  blockData: selectedSketch.blockSketch,
                }
              );

              // 모든 sketch를 다시 불러오지 않고, 수정된 sketch만 업데이트 및 렌더링
              setSketchList(sketchList.map((sketch)=>{
                if(sketch.id === selectedSketch.id){
                  return {
                    ...sketch,
                    name: result.data.name,
                    description: result.data.description,
                    modifiedAt: result.data.updatedAt,
                  };
                }
                return sketch;
              }))
              setIsLoading(false);
            })();
          }}
          autoComplete="off"
        >
          <Form.Item
            key={'sketchName'}
            label="스케치 이름"
            name={'name'}
            rules={[
              { required: true, message: '스케치 이름을 입력해 주세요!' },
            ]}
            initialValue={selectedSketch.name}
          >
            <Input />
          </Form.Item>

          <Form.Item
            key={'sketchDescription'}
            label="스케치 설명"
            name={'description'}
            rules={[
              { required: true, message: '스케치 설명을 입력해 주세요!' },
            ]}
            initialValue={selectedSketch.description}
          >
            <Input />
          </Form.Item>
          <Form.Item
            key={'sketchCreatedAt'}
            label="스케치 생성일"
            name={'createdAt'}
          >
            {dateParsing(selectedSketch.createdAt)}
          </Form.Item>
          <Form.Item
            key={'sketchUpdatedAt'}
            label="스케치 수정일"
            name={'updatedAt'}
          >
            {dateParsing(selectedSketch.updatedAt)}
          </Form.Item>
        </Form>
        </Flex>
      </Modal>
      <Spin spinning={isLoading} fullscreen />
    </>
  );
}

// 10 이하의 숫자의 경우 앞자리에 0을 붙여주는 함수
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

// yyyy-MM-ddTHH:mm:ss... 형식의 문자열을 yyyy년 MM월 dd일 HH:mm:ss의 문자열로 변환하는 함수
const dateParsing = (date: string) => {
  const dt = new Date(date);
  const outputString: string = `${dt.getFullYear()}년 ${padZero(dt.getMonth() + 1)}월 ${padZero(dt.getDate())}일 ${padZero(dt.getHours())}:${padZero(dt.getMinutes())}:${padZero(dt.getSeconds())}`;
  return outputString;
}

