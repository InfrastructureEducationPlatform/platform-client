import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Upload, UploadProps, message } from 'antd';
import React, { useState } from 'react';

import { fileApi } from '../api';

export function ImageUploader({
  defaultImageUrl,
  onImageUploaded,
  onImageDeleted,
}: {
  defaultImageUrl: string | undefined;
  onImageUploaded: (imageUrl: string) => void;
  onImageDeleted: () => void;
}) {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const props: UploadProps = {
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        message.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    customRequest: async ({ file, action, onSuccess }) => {
      if (typeof file === 'string') {
        return;
      }

      // Upload && Upload Component Internal Callback
      const uploadResponse = await fileApi.uploadFileAsync(file as File);
      onSuccess!(uploadResponse);

      // onImageUploaded
      const imageUrl = `https://api.blockinfra.kangdroid.me/files/${uploadResponse.data.fileId}`;
      onImageUploaded(imageUrl);
    },
    maxCount: 1,
    showUploadList: false,
  };
  return (
    <div
      style={{
        position: 'relative',
      }}
      onMouseOver={() => setShowDeleteButton(true)}
      onMouseOut={() => setShowDeleteButton(false)}
    >
      <Upload {...props}>
        <Button
          shape={'circle'}
          size={'large'}
          style={{
            display: 'flex',
            width: '60px',
            height: '60px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {defaultImageUrl ? (
            <Avatar
              src={<img src={defaultImageUrl} alt={'avatar'} />}
              size={'large'}
              style={{
                width: '54px',
                height: '54px',
              }}
            />
          ) : (
            <UploadOutlined />
          )}
        </Button>
      </Upload>
      {defaultImageUrl && showDeleteButton && (
        <Button
          style={{
            position: 'absolute',
            left: '40px',
            top: '-5px',
          }}
          size={'small'}
          shape={'circle'}
          icon={<DeleteOutlined />}
          onClick={() => {
            onImageDeleted();
          }}
        />
      )}
    </div>
  );
}
