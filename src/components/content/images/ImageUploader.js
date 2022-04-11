import React, {useState} from 'react'
import { useDispatch, useSelector } from "react-redux"
import { addArticleImage, getImagesByArticle,imageSelector } from '../../../features/ImageSlice'
import { Card, Button, Upload } from "antd"
import {
  InboxOutlined,
} from "@ant-design/icons"

export const ImageUploader = (props) => {
  const { article, onUpload } = props;
  const dispatch = useDispatch()
  const [imageList, setImageList] = useState([])

  const uploadProps = {
    onRemove: (file) => {
      const index = imageList.indexOf(file)
      const newImageList = imageList.slice()
      newImageList.splice(index, 1)
      setImageList(newImageList)
    },
    beforeUpload: (file) => {
      setImageList([...imageList, file])
      return false;
    },
    imageList,
    listType: "picture",
    accept: "image/*",
  };
  const handleUpload = () => {
    console.log("handleUpload")
    const formData = new FormData()
    imageList.forEach((file) => {
      formData.append("images[]", file)
    })
    dispatch(addArticleImage({ article, data: formData }))
    onUpload()
  }
  return (
    <Card>
      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Upload.Dragger>
      <Button type="primary" onClick={()=>handleUpload()}>
        start
      </Button>
    </Card>
  );
}
