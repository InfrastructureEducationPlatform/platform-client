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
  const [selectedSketch, setSelectedSketch] = useState<SketchProjection>({'id':'', 'name':'', 'description':'', 'createdAt':'', 'updatedAt':''});
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
  useEffect(()=>{
    modifyForm.setFieldsValue(selectedSketch);
  },[selectedSketch]);
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
            
            (async () => {
              await sketchApi.updateSketchAsync(
                currentChannel.channelId, 
                selectedSketch.id, 
                {
                  name: value.name,
                  description: value.description,
                  blockData: {},
                }
              );
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
            {selectedSketch.createdAt}
          </Form.Item>
          <Form.Item
            key={'sketchUpdatedAt'}
            label="스케치 수정일"
            name={'updatedAt'}
          >
            {selectedSketch.updatedAt}
          </Form.Item>
        </Form>
        </Flex>
      </Modal>
    </>
  );
}

interface FieldData extends SketchProjection {
}

interface CustomizedFormProps {
  onChange: (fields: FieldData[]) => void;
  fields: FieldData[];
}

const SketchInfoForm: React.FC<CustomizedFormProps> = ({ onChange, fields }) => {
  return <Form
    key={'modifySketchForm'}
    name="global_state"
    layout='inline'
    fields={fields}
    onFieldsChange={(_, allFields) => {
      const updatedFields: FieldData[] = allFields.map((field) => ({
        id: field.value[0],
        name: field.value[1],
        description: field.value[2],
        createdAt: field.value[3],
        updatedAt: field.value[4],
      }));
      onChange(updatedFields);
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
      initialValue={fields[0].name}
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
      initialValue={fields[0].description}
    >
      <Input />
    </Form.Item>
  </Form>
}