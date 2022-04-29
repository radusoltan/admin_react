import { useState } from "react"
import { Upload, Modal } from "antd"
import {
  InboxOutlined,
} from "@ant-design/icons"
import { useUploadArticleImagesMutation } from "../../../services/images"

export const ImageUploader = ({visible,article,onCancel,onOk}) => {
  const [imageList, setImageList] = useState([])
  const [uploadArticleImages] = useUploadArticleImagesMutation(article)
  const uploadProps = {
    onRemove: file => {
      const index = imageList.indexOf(file)
      const newImageList = imageList.slice()
      newImageList.splice(index, 1)
      setImageList(newImageList)
    },
    beforeUpload: file => {
      setImageList([...imageList, file])
      return false
    },
    listType: "picture",
    accept: 'image/*'
  }

  const handleUpload = ()=>{
    const body = new FormData()
    imageList.forEach(file=>{
      body.append('images[]',file)
    })
    uploadArticleImages({article,body})
    onOk()
  }

  return <Modal 
    visible={visible}
    onOk={()=>handleUpload()}
    onCancel={()=>onCancel()}
  >
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
  </Modal>
}