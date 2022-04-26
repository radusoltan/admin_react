import { Col, Row, Card } from "antd"
import { useEffect, useState } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

const basePath = 'http://nginx.local/'

export const Cropper = ({ images, mainImage, renditions, rendition}) => {

  console.log('Cropper')

  const imgTocrop = images.find(({ id }) => id === mainImage)


  const selected = renditions.find(({id})=>id===rendition)

  console.log(selected);

  const [croppedImage, setCroppedImage] = useState(undefined)
  const [cropConfig, setCropConfig] = useState(
    // default crop config
    {
      unit: "%",
      width: 100,
      // height: 9,
      aspect: 16 / 9,
    }
  )
  const [imageRef, setImageRef] = useState()
  
  const onImageCropped = image => {

  }

  async function cropImage(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImage(
        imageRef,
        crop,
        "croppedImage.jpeg" // destination filename
      );

      // calling the props function to expose
      // croppedImage to the parent component
      setCroppedImage(croppedImage);
    }
  }

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

  return <>
    <Row>
      <Col span={6}>
        {
          renditions.map((rendition) => (
            <div
              onClick={() => {
                setCropConfig({
                  width: rendition.width,
                  aspect: rendition.width / rendition.height,
                  unit: "%",
                });
              }}
            >
              <Card
                hoverable
                cover={
                  <img
                    src={croppedImage? croppedImage : `http://nginx.local/${imgTocrop.path}`}
                    style={{ padding: "10px" }}
                    alt={imgTocrop.name}
                    crossorigin="anonymous"
                  />
                }
              >
                <Card.Meta title={rendition.name} description={`1200 x 630`} />
              </Card>
            </div>
          ))
        }
      </Col>
      <Col span={18}>
        <ReactCrop
          crop={cropConfig}
          src={`http://nginx.local/${imgTocrop.path}`}
          onImageLoaded={(imageRef) => setImageRef(imageRef)}
          onComplete={(cropConfig) => cropImage(cropConfig)}
          onChange={(c) => setCropConfig(c)}
        />
      </Col>
    </Row>
  </>

}