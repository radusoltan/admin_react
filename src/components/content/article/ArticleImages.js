import { Card, Button, Row, Image, Modal, Popconfirm } from "antd";
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  UploadOutlined,
  DeleteOutlined,
  FileImageOutlined
} from "@ant-design/icons"
import { ImageUploader } from "../images/ImageUploader"
import { ImageEditMeta } from "../images/ImageEditMeta"
import { ImageCropper } from "../images/imageCropper"
import { getImagesByArticle, imageSelector, detachImage } from "../../../features/ImageSlice"


export const ArticleImages = (props) => {
  const { article, onArticleImages } = props;

  const dispatch = useDispatch()

  const {isFetching, isSuccess, articleImages} = useSelector(imageSelector)
  const [images,setImages] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [upload,setUpload] = useState(false)
  const [edit,setEdit] = useState(false)
  const [crop,setCrop] = useState(false)
  const [width, setWidth] = useState("70%");
  
  useEffect(()=>dispatch(getImagesByArticle(article)),[])
  useEffect(()=>{
    if (isSuccess){
      setImages(articleImages)
      onArticleImages(articleImages)
    }
  },[isSuccess])

  const showModal = () => {
    setIsModalVisible(true)
  };

  const handleOk = () => {
    setIsModalVisible(false)
    setUpload(false);
    setEdit(false);
    setCrop(false);
    dispatch(getImagesByArticle(article))
  };

  const handleCancel = () => {
    setIsModalVisible(false)
    setUpload(false)
    setEdit(false)
    setCrop(false)
  };

  const detachImage = id => {
    // dispatch(detachImage({article,image:id}))
  }
  const cancel = (e) => {
    
  }

  const imagesList = images.map(({ id, path, name }) => {
    return (
      <Row
        style={{
          margin: "0 0 10px 0",
          border: "1px solid #CCC",
          padding: "10px",
        }}
        key={id}
      >
        <Image src={`http://localhost:8000/${path}`} width={67} />
        {/* <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={()=>detachImage(id)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        > */}
          <DeleteOutlined
            style={{ marginLeft: "auto", fontSize: 12, float: "right" }}
            onClick={()=>detachImage(id)}
          />
        {/* </Popconfirm> */}
      </Row>
    );
  });

  const addImage = () => {
    showModal()
    setUpload(true)
    setCrop(false)
    setEdit(false)
  };
  const editMetaData = () => {
    showModal()
    setWidth('90%')
    setEdit(true)
    setUpload(false)
    setCrop(false)
    console.log("ArticleImages edit");
  };
  const cropImages = () => {
    showModal()
    setCrop(true)
    setUpload(false)
    setEdit(false)
    // console.log("ArticleImages crop");
  };

  const renderModal = upload ? (<ImageUploader article={article} onUpload={()=>{        
        dispatch(getImagesByArticle(article))
        // setUpload(false);
        // setEdit(true)        
      }} />) :
      edit ? (<ImageEditMeta onEdit={()=>{
        setEdit(false)
        setCrop(true)
      }} />) :
      crop ? (<ImageCropper images={images} />) : ('')


  const buttons = images.length === 0 ? (
      <Button
        style={{ margin: "0 10px 10px 0" }}
        icon={<UploadOutlined />}
        onClick={addImage}
      >
        Upload
      </Button>
    ) : (
      <>
        <Button
          style={{ margin: "0 10px 10px 0" }}
          icon={<UploadOutlined />}
          onClick={addImage}
        >
          Upload
        </Button>
        <Button
          style={{ margin: "0 10px 10px 0" }}
          icon={<UploadOutlined />}
          onClick={() => editMetaData()}
        >
          Edit
        </Button>
        <Button
          style={{ margin: "0 10px 10px 0" }}
          icon={<FileImageOutlined />}
          onClick={() => cropImages()}
        >
          Place
        </Button>
      </>
    )
  

  return (
    <>
      <Card title={"Article Images"} loading={isFetching}>
        <Row>
          {buttons}
        </Row>
        {imagesList}
      </Card>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={width}
      >
        {renderModal}
      </Modal>
    </>
  )
}
