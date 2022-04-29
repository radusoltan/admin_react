import { useEffect, useState } from "react"
import { Card, Button, Image, Spin } from "antd"
import {  } from "../../../services/articles"
import { ImageUploader } from "./uploader"
import {
  UploadOutlined,
  DeleteOutlined,
  FileImageOutlined
} from "@ant-design/icons"
import { useDetachArticleImagesMutation, useGetArticleImagesQuery, useSetArticleMainImageMutation } from "../../../services/images"
import { PlaceImages } from "./placeImages"
import toast, { Toaster } from 'react-hot-toast'

export const ArticleImages = ({article}) => {
  // console.log('Article Images')
  // console.log(images)

  const { data: images, isSuccess: imagesSuccess, isLoading: imagesIsLoading } = useGetArticleImagesQuery(article)
  
  const [detachArticleImages, { data: detachData, isSuccess: detachIsSuccess }] = useDetachArticleImagesMutation()
  const [setArticleMainImage] = useSetArticleMainImageMutation()

  const [upload,setUpload] = useState(false)
  const [place,setPlace] = useState(false)
  const [edit,setEdit] = useState(false)  

  if (imagesIsLoading){
    return <Spin />
  }
  


  const imgs = images?.map(({ id, name, path, width, height }) => (<div key={id} style={{
    margin: "0 0 10px 0",
    border: "1px solid #CCC",
    padding: "10px",
  }}>
    <Image
      src={`http://nginx.local/${path}`}
      width={67}
      preview={false}
    />

    <DeleteOutlined
      style={{ marginLeft: "auto", fontSize: 12, float: "right" }}
      onClick={() =>{
        detachArticleImages({ article, id })
      }}
    />
    <span style={{
      padding: "0 0 0 10px"
    }}>{`${width} x ${height}`}</span>

  </div>))


const buttons = images?.length === 0 ? (
    <Button
      style={{ margin: "0 10px 10px 0" }}
      icon={<UploadOutlined />}
      onClick={() => setUpload(true)}
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
        onClick={() => {
          setPlace(true)
        }}
      >
        Place
      </Button>
    </>)

  return <Card extra={buttons} >
    {
    imgs
    }
    <ImageUploader
      visible={upload}
      article={article}
      onOk={()=>{
        toast.success('Images uploaded successfully!')
        setTimeout(()=>{
          setUpload(false)
        },2000)
        
      }}
      onCancel={()=>setUpload(false)}
    />
    <PlaceImages 
      visible={place} 
      onCancel={() => { setPlace(false) }}
      images={images}
      article={article}
      // setMainImage={image=>{
      //   setArticleMainImage({article,image})
      // }} 
    />
    <Toaster />
  </Card>

}