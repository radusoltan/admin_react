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
import { PlaceImages } from "./placeImages"

export const ArticleImages = ({article,onImages}) => {

  const [upload,setUpload] = useState(false)
  const [placeIamge,setPlaceImage] = useState(false)
  const [mainImage,setMainImage] = useState()
  
  const {data,isLoading, isSuccess} = useGetArticleImagesQuery(article)

  const [detachArticleImages,{data:detachData,isSuccess:detachIsSuccess}] = useDetachArticleImagesMutation()

  const detachImage = id => {
    detachArticleImages({article,id})
  }
  
  useEffect(()=>{
    if(detachIsSuccess){
      onImages(
        detachData.map(({id})=>(id))
      )
    }
    if (isSuccess){
      data.map(({id,isMain})=>{
        if (isMain){
          setMainImage(id)
        }
      })
    }
  },[detachIsSuccess,isSuccess])

  if (isLoading){
    return <Spin />
  }

  const images = data.map(({ id, name, path, width, height }) => (<div key={id} style={{
    margin: "0 0 10px 0",
    border: "1px solid #CCC",
    padding: "10px",}}>
      <Image 
        src={`http://nginx.local/${path}`} 
        width={67} 
        preview={false} 
      />
    
    <DeleteOutlined
      style={{ marginLeft: "auto", fontSize: 12, float: "right" }}
      onClick={() => detachImage(id)}
    />
    <span style={{
      padding: "0 0 0 10px"
    }}>{`${width} x ${height}`}</span>
    
  </div>))
  
  const buttons = images.length === 0 ? (
    <Button
      style={{ margin: "0 10px 10px 0" }}
      icon={<UploadOutlined />}
      onClick={()=>setUpload(true) }
    >
      Upload
    </Button>
  ) : (
    <>
      <Button
        style={{ margin: "0 10px 10px 0" }}
        icon={<UploadOutlined />}
        onClick={() => setUpload(true)}
      >
        Upload
      </Button>
      <Button
        style={{ margin: "0 10px 10px 0" }}
        icon={<UploadOutlined />}
        onClick={() => console.log('Edit')}
      >
        Edit
      </Button>
      <Button
        style={{ margin: "0 10px 10px 0" }}
        icon={<FileImageOutlined />}
        onClick={() => setPlaceImage(true)}
      >
        Place
      </Button>
    </>
  )

  return <Card extra={buttons} >
    {
      images
    }
    <ImageUploader 
      article={article} 
      visible={upload} 
      onOk={images=>{
        setUpload(false)
        onImages(images)
      }}
      onCancel={()=>{
        setUpload(false)
      }}
    />
    <PlaceImages visible={placeIamge} images={data} article={article} onCancel={()=>setPlaceImage(false)} />
  </Card>

}