import { Modal, Row, Radio, Image, Divider, Button, Col, Card } from "antd"
import { useEffect, useState } from "react"
import { useSetArticleMainImageMutation, useGetMainArticleImageQuery, useGetMainImageRenditionsQuery } from "../../../services/images"
import { Cropper } from "./cropper"

export const PlaceImages = ({visible,images,article, onCancel})=>{

  console.log('place',images);  
  
  const main = images.find(({isMain})=>isMain)

  const [mainImage,setMainImage] = useState(main.id)
  const [rendition,setRendition] = useState()
  
  const renditions = images.find(({id})=>id===mainImage).thumbs

  const [isPlace,setIsPlace] = useState(true)
  const [isCrop,setIsCrop] = useState(false)

  const [setArticleMainImage,{data:setMainData,isSuccess: setMainSuccess}] = useSetArticleMainImageMutation()
  

  useEffect(()=>{
    if (setMainSuccess){
      const {image_id} = setMainData
      setMainImage(image_id)
    }
  }, [setMainSuccess])  

  const handleCancel = () => {
    setIsCrop(false)
    setIsPlace(true)
    onCancel()
  }

  const setMain = () => {
    setArticleMainImage({article,image:mainImage})
  }

  const finishPlace = ()=>{
    console.log('finish place')
  }

  const doneEditing = ()=>{
    setIsCrop(false)
    setIsPlace(true)
  }

  const button = !isCrop ? (<Button onClick={finishPlace}>Finish</Button>) :
    (<Button onClick={doneEditing}>Done Editing</Button>)
  
  

  const rends = renditions?.map(({name, id, path})=>(<Col span={6} key={id}>
    <div className="rendition-container">
      <figure onClick={() => {
        setIsPlace(false)
        setIsCrop(true)
        setRendition(id)
      }}> 
        <Image src={`${process.env.REACT_APP_PUBLIC_BASE_URL + path}`} preview={false} />
        <figcaption>{name}</figcaption>
      </figure>
      
    </div>
  </Col>))

  const thumbs = images.map(({ id, path, name, width, height }) => (<Col span={6} key={id}>
    <div className="rendition-container" >
    <figure>
        <Image src={`${process.env.REACT_APP_PUBLIC_BASE_URL + path}`} style={{
        margin: '0 0 2rem 0'
      }} preview={false} />
      <Radio value={id} style={{float:'right'}} onChange={()=>{
        setMainImage(id)
      }} checked={id===mainImage} />
      <figcaption>
        <label>
          {`${width}x${height}`}
        </label>
      </figcaption>
    </figure>
  </div>
  </Col>))  

  return <Modal 
    visible={visible} 
    width={'90%'}
    onOk={()=>{}}
    onCancel={handleCancel}
    footer={null}
  >
    <Card extra={button} title={'Place Images'}>
      <div style={{ display: `${isPlace ? 'block' : 'none'}` }}>
        <Row>
          {
            rends
          }
          </Row>
          <Divider orientation="left" orientationMargin="0"><Button onClick={setMain}>Set deault</Button></Divider>
        <Row>{
        thumbs
        }</Row>
      </div>
      <div style={{display: `${isCrop ? 'block':'none'}`}}>
        <Cropper images={images} renditions={renditions} mainImage={mainImage} rendition={rendition} />
      </div>
    </Card>
       
  </Modal>
}