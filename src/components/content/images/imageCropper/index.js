import { Row, Col, Card, Radio, Image, Checkbox, Divider } from "antd";
import React, { useState } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import defaultImage from './fff.png'
export const ImageCropper = (props) => {
  
  const { images,onImageCropped } = props;
  const [check,setCheck] = useState(false)
  const[value1,setValue1] = useState();
  const [selectedImage,setSelectedImage] = useState(images[0].id)

  const renditions = [
    {
      width: 100,
      aspect: 16 / 9,
      name: 'Article main'
    },
    {
      width: 100,
      aspect: 2.6,
      name: 'Important list'
    },
  ];

  const [cropConfig, setCropConfig] = useState(
    // default crop config
    {
      unit: "%",
      width: 100,
      // height: 9,
      aspect: 16 / 9,
    }
  )
  const [imageRef, setImageRef] = useState();

  async function cropImage(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImage(
        imageRef,
        crop,
        "croppedImage.jpeg" // destination filename
      );

      // calling the props function to expose
      // croppedImage to the parent component
      onImageCropped(croppedImage);
    }
  }

  const selectedImg = (id) => {
    setSelectedImage(id)
  };

  const imageList = images.map(({id,path}, index) => (
    <Col span={4}>
      <Card actions={[<Checkbox onChange={()=>{
        selectedImg(id);
      }} checked={
        selectedImage===id ? true:
        false
      }>Set Default</Checkbox>]}>
        <img
          src={`http://localhost:8000/${path}`}
          style={{ width: "100%" }}
        />
      </Card>
    </Col>
  ))

  const imgTocrop = images.find(image=>selectedImage===image.id)

  const croppers = renditions.map((rendition) => (
    <div
      onClick={() => {
        setCropConfig({
          width: rendition.width,
          aspect: rendition.aspect,
          unit: "%",
        });
      }}
    >
      <Card
        hoverable
        cover={
          <img
            src={`http://localhost:8000/${imgTocrop.path}`}
            style={{ padding: "10px" }}
            alt={imgTocrop.name}
          />
        }
      >
        <Card.Meta title={rendition.name} description={`1200 x 630`} />
      </Card>
    </div>
  ));

  function getCroppedImage(sourceImage, cropConfig, fileName) {
    // creating the cropped image from the source image
    const canvas = document.createElement("canvas");
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        // returning an error
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        blob.name = fileName;
        // creating a Object URL representing the Blob object given
        const croppedImageUrl = window.URL.createObjectURL(blob);

        resolve(croppedImageUrl);
      }, "image/jpeg");
    });
  }

  const cropComplete = (c) => {
    // console.log('onComplete',c)
  }

  return (
    <>
      <Row>
        <Col span={6}>
          {croppers}
        </Col>
        <Col span={18}>
          <ReactCrop
            crop={cropConfig}
            src={`http://localhost:8000/${imgTocrop.path}` || defaultImage}
            onImageLoaded={(imageRef) => setImageRef(imageRef)}
            onComplete={(cropConfig) => cropImage(cropConfig)}
            onChange={(c) => setCropConfig(c)}
          />
        </Col>
      </Row>
      <Divider orientation="left">Select default Image</Divider>
      <Row style={{ padding: "10px" }}>{imageList}</Row>
    </>
  );
}

// export default ImageCropper
