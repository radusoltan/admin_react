import React, { useRef, useEffect, DependencyList } from "react"
import { Col, Row, Card, Button, Image } from "antd"
import { useState } from "react"
import ReactCrop from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import { canvasPreview } from "./canvasPreview"



export const Cropper = ({ image, rendition, thumbs}) => {

  console.log('Cropper image')
  
  const renditions = [
    {
      name: 'article',
      width: 1200,
      height: 630,
      aspect: 1.9,
      id: 1,
      coords: {
          unit: "%",
          x: 0,
          y: 0,
          width: 100,
          height: 93.5672514619883
        }
    },
    {
      name: 'important',
      width: 1170,
      height: 450,
      aspect: 2.6,
      id: 2,
      coords: {
        unit: "%",
        x: 0,
        y: 0,
        width: 100,
        height: 68.37606837606837
      }
    }
  ]

  

  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const { Meta } = Card
  const [completedCrop, setCompletedCrop] = useState()
  const [selectedRendition,setSelectedRendition] = useState(rendition)
  const { width, height, aspect, coords } = renditions.find(({ id }) => id === selectedRendition)
  const [mainAspect,setMainAspect] = useState(parseFloat(aspect))
  const [crop, setCrop] = useState(
    coords
  )
  
  const selectRendition = id =>{
    setSelectedRendition(id)
    const {coords, aspect} = renditions.find(rendition=>rendition.id===id)
    setMainAspect(parseFloat(aspect))
    console.log('new coords',coords)
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          1
        )
      }
    },
    100,
    [completedCrop]
  )
  
  console.log(selectedRendition);

  return <>
    <Col span={6}>
      {
        thumbs.map(({path,id,rendition_id, name})=>(
         
          completedCrop && rendition_id === selectedRendition ? (<Card
              bodyStyle={{
                background: `${selectedRendition === rendition_id ? '#f0f2f5' : '#fff'}`
              }}
              onClick={() => {
                selectRendition(rendition_id)
              }}
              key={id}
              hoverable
              cover={ <canvas ref={previewCanvasRef} /> }

            >
              <Meta title={name} />
            </Card>) : (<Card
              bodyStyle={{
                background: `${selectedRendition === rendition_id ? '#f0f2f5' : '#fff'}`
              }}
              onClick={() => {
                selectRendition(rendition_id)
              }}
              key={id}
              hoverable
              cover={<Image src={process.env.REACT_APP_PUBLIC_BASE_URL + path} preview={false} />}

            >
              <Meta title={name} />
            </Card>)
          
        ))
      }
    </Col>
    <Col span={18}>
      <Card>
        <ReactCrop
          crop={crop}
          onChange={(c, percentCrop) => setCrop(percentCrop)}
          aspect={mainAspect}
          onComplete={(c,p) => {
            setCompletedCrop(c)
            console.log(p);
          } }        
        >
          <img /*onLoad={onImageLoad}*/ ref={imgRef} src={`http://nginx.local/${image.path}`} />
      </ReactCrop>
      
      <Button onClick={()=>{
        console.log(completedCrop);
      }} >Crop</Button> {/**/}
      </Card>
    </Col>
    
    
  </>

}

const useDebounceEffect = (
  fn,
  waitTime,
  deps
) => {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}