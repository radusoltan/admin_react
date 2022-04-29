import { Modal, Row, Radio, Image, Divider, Button, Col, Card } from "antd"
import { useEffect, useState, useRef } from "react"
import { useSetArticleMainImageMutation,useGetArticleImagesQuery } from "../../../services/images"
import { Cropper } from "./cropper"
import {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop"
// import { useDebounceEffect } from "./useDebounceEffect"
// import { imgPreview } from "./imagePreview"

const centerAspectCrop = (
  mediaWidth,
  mediaHeight,
  aspect
) => (centerCrop(
  makeAspectCrop(
    {
      unit: 'px',
      width: mediaWidth,
    },
    aspect,
    mediaWidth,
    mediaHeight,
  ),
  mediaWidth,
  mediaHeight,
))



export const PlaceImages = ({visible, images, onCancel, article})=>{

  // console.log('place',images)
  
  const main = images?.find(({isMain})=>isMain)

  const [selectedMainImage,setSelectedMainImage] = useState(main.id)
  
  const [place,setPlace] = useState(true)
  const [crop,setCrop] = useState(false)

  const { thumbs } = images?.find(({ id }) => id === selectedMainImage)
  const [selectedRendition, setSelectedRendition] = useState(thumbs[0].id)

  const [setArticleMainImage, { data:setMainData, isSuccess: setMainSuccess }] = useSetArticleMainImageMutation()


  useEffect(()=>{
    if (setMainSuccess){
      const {image_id} = setMainData
      // setMainImage(image_id)
      setSelectedMainImage(image_id)
    }
  }, [setMainSuccess])

  const handleCancel = () => {
    onCancel()
    setCrop(false)
    setPlace(true)
  }

  const cardClick = ({ rendition_id, selectedMainImage}) => {
    setCrop(true)
    setPlace(false)
    setSelectedRendition(rendition_id)
  }
  
  

  const thumbnailsList = thumbs.map(({ rendition_id, name, path }) => <Col span={12} key={rendition_id}>
    <Card hoverable onClick={()=>cardClick({rendition_id,selectedMainImage})}>
      <figure>
        <Image src={`${process.env.REACT_APP_PUBLIC_BASE_URL + path}`} preview={false} />
        <figcaption>{name}</figcaption>
      </figure>
    </Card>
  </Col>)

  const imagesList = images?.map(({ id, path, name, width, height }) => (<Col span={6} key={id}>
    <div className="rendition-container">
      <figure>
        <Image
          src={process.env.REACT_APP_PUBLIC_BASE_URL + path}
          preview={false}
        />
        <Radio
          value={id}
          style={{ float: 'right' }}
          checked={id === selectedMainImage}
          onChange={()=>{
            setSelectedMainImage(id)
            setArticleMainImage({article,image:id})
          }}
        />
        <figcaption>
          <label>{`${width}x${height}`}</label>
        </figcaption>
      </figure>
    </div>
  </Col>))

  return <Modal 
    visible={visible} 
    width={'70%'}
    onOk={()=>{}}
    onCancel={handleCancel}
    footer={null}
  >
    
    <Card extra={<>Some extra</>} title={'Place Images'}>
      <div style={{ display: `${place ? 'block' : 'none'}` }}>
        <Row>
          {
            thumbnailsList
          }
        </Row>
        
        <Divider orientation="left" orientationMargin="0" />
        <Row>
          {
            imagesList
          }
        </Row>
      </div>
      <div style={{ display: `${crop ? 'block' : 'none'}` }}>
        <Row>
            <Cropper 
              image={ images.find(({ id }) => id === selectedMainImage) }
              rendition={  selectedRendition }
              thumbs={thumbs}
            />
        </Row>
      </div>
      {/* 
      <div style={{display: `${isCrop ? 'block':'none'}`}}>
        <Row>
          <Col span={6}>
            {
              renditions.map(({id,width,specs,height,name, path})=>(
                <div
                  key={id}
                  onClick={() => {
                    setRendition(id)
                  }}
                >
                  <Card
                    hoverable
                    bordered={true}
                    bodyStyle={{
                      background: `${id === rendition ? '#f0f2f5' : '#fff'}`
                    }}
                    cover={
                      <img
                        ref={imgRef}
                        src={`http://nginx.local/${path}`}
                        style={{ padding: "10px" }}
                        alt={name}
                      // crossorigin="anonymous"
                      />
                    }
                  >
                    <Card.Meta title={name} description={`${width} x ${height}`} />
                  </Card>
                </div>
              ))
            }
            <div>
              
            </div>
          </Col>
          <Col span={18}>
            <Cropper 
              image={images.find(({ id }) => id === mainImage)} 
              rendition={rendition} 
              aspect={selectedRendition.specs} 
              crop={selectedRendition} 
              onCrop={c => console.log('place onCorp',c)}
              preview={(c,p) => {
                cropImage(p)
                setCompletedCrop(p)
              }}
            />
          </Col>
        </Row>
        
      </div> */}
    </Card>
       
  </Modal>
}

function toBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve)
  })
}