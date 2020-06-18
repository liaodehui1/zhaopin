import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { BASE_IMG_URL, UPLOAD_URL } from '@/utils/constants'
import { reqDeleteImg } from '@/api';

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你只能上传jpeg或png图片！');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2M！');
  }
  return isJpgOrPng && isLt2M;
}

function MyUpload(props) {
  let {initUrl, onChange, Icon} = props
  let [loading, setLoading] = useState(false)
  let [imageUrl, setData] = useState(initUrl)

  useEffect(() => {
    setData(initUrl)
  }, [initUrl])

  let handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.status === 0) {
        message.success('上传成功')
        setData(info.file.response.filename)
        setLoading(false)
        if (info.fileList.length > 1 || !!imageUrl) {
          let deleteUrl = !!imageUrl ? imageUrl : info.fileList[info.fileList.length - 1].response.filename
          reqDeleteImg(deleteUrl)
            .catch(error => console.log(error))
        }
        onChange(info.file.response.filename)
      } else {
        message.error(info.file.response.msg)
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : Icon}
      <div className="ant-upload-text">上传照片</div>
    </div>
  );
  // console.log('initUrl', initUrl)
  // console.log('imageUrl', imageUrl)
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={UPLOAD_URL}
      withCredentials={true}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img 
          src={`${BASE_IMG_URL}${imageUrl}`} 
          alt="avatar" 
          style={{ width: '100%' }} 
        />
      ) : uploadButton}
    </Upload>
  )
}

export default React.memo(MyUpload)