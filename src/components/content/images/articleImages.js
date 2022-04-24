import { useEffect, useState } from "react"
import { Card, Button, Image, Spin } from "antd"
import {  } from "../../../services/articles"
import { ImageUploader } from "./uploader"
import {
  UploadOutlined,
  DeleteOutlined,
  FileImageOutlined
} from "@ant-design/icons"
import { useDetachArticleImagesMutation, useGetArticleImagesQuery } from "../../../services/images"

export const ArticleImages = ({article,onImages}) => {

  const [upload,setUpload] = useState(false)
  
  const {data,isLoading} = useGetArticleImagesQuery(article)

  const [detachArticleImages] = useDetachArticleImagesMutation()

  const detachImage = id => {
    detachArticleImages({article,id})
  }
  

  if (isLoading){
    return <Spin />
  }

  const images = data.map(({ id, name, path }) => (<div key={id} style={{
      margin: "0 0 10px 0",
      border: "1px solid #CCC",
      padding: "10px",}}>
      <Image key={id} src={`http://nginx.local/${path}`} width={67} />
      <DeleteOutlined
        style={{ marginLeft: "auto", fontSize: 12, float: "right" }}
        onClick={() => detachImage(id)}
      />
    </div>))

  return <Card extra={<>
    <Button onClick={()=>setUpload(true)}>Uplad</Button>
  </>} title='Images'>
    {
      images
    }
    <ImageUploader 
      article={article} 
      visible={upload} 
      onOk={images=>{
        setUpload(false)
      }}
      onCancel={()=>{
        setUpload(false)
      }}
    />
  </Card>

}