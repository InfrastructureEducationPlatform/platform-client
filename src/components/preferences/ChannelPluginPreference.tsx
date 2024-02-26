import Icon from '@ant-design/icons';
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
import React, { useState } from 'react';

import { pluginApi } from '../../api';
import { useAvailablePluginsQuery } from '../../api/queries.tsx';
import { AwsIcon } from '../../assets/AwsIcon.tsx';
import { PluginProjection } from '../../libs/core-api/api';

export function ChannelPluginPreference({ channelId }: { channelId: string }) {
  const { data: availablePluginList, isLoading } =
    useAvailablePluginsQuery(channelId);

  if (isLoading || !availablePluginList) {
    return <div>Loading...</div>;
  }
  return (
    <Flex
      style={{
        flexDirection: 'column',
        padding: '20px',
        width: 'calc(100% - 240px)',
        overflow: 'auto',
        lineHeight: 'initial',
      }}
    >
      <div>
        <Typography.Title level={4}>채널 플러그인</Typography.Title>
        <Divider style={{ width: '100%', margin: 0 }} />
        <Flex
          style={{
            marginTop: '10px',
            gap: '10px',
            flexDirection: 'column',
          }}
        >
          {availablePluginList.map((plugin) => (
            <PluginEntry
              key={plugin.id}
              plugin={plugin}
              channelId={channelId}
            />
          ))}
        </Flex>
      </div>
    </Flex>
  );
}

function PluginEntry({
  channelId,
  plugin,
}: {
  channelId: string;
  plugin: PluginProjection;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Card>
        <Flex
          style={{
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Flex
            style={{
              gap: 10,
              alignItems: 'center',
            }}
          >
            <Icon component={AwsIcon} />
            <div>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {plugin.name}
              </Typography.Title>
              <Typography.Text type={'secondary'}>
                {plugin.description}
              </Typography.Text>
              {plugin.pluginInstallation && (
                <Typography.Text
                  style={{ display: 'block' }}
                  type={'secondary'}
                >
                  플러그인 설치 날짜:{' '}
                  {new Date(plugin.pluginInstallation.installedAt!).toString()}
                </Typography.Text>
              )}
            </div>
          </Flex>
          <Button type={'primary'} onClick={() => setModalVisible(true)}>
            {plugin.pluginInstallation ? '재설치' : '설치'}
          </Button>
        </Flex>
      </Card>
      <PluginInstallModal
        channelId={channelId}
        plugin={plugin}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
}

function PluginInstallModal({
  channelId,
  plugin,
  modalVisible,
  setModalVisible,
}: {
  channelId: string;
  plugin: PluginProjection;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) {
  const [form] = Form.useForm();
  const handleInstall = async () => {
    const formValues = await form.validateFields();
    await pluginApi.installPluginToChannelAsync(channelId, {
      pluginId: plugin.id,
      pluginConfiguration: formValues,
    });
    setModalVisible(false);
  };
  return (
    <Modal
      title={`Install ${plugin.name}`}
      open={modalVisible}
      onOk={() => handleInstall()}
      onCancel={() => setModalVisible(false)}
    >
      <Form form={form}>
        {plugin.pluginTypeDefinitions.map((data) => (
          <Form.Item label={data.fieldName} name={data.fieldName ?? ''}>
            <Input placeholder={data.fieldDescription ?? ''} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
