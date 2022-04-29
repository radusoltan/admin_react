import React,{useEffect, useState} from "react"
import { useParams } from "react-router-dom"
import { useGetArticleQuery, useUpdateArticleMutation } from "../../../services/articles"
import {Form, Card, Spin, Input, Row, Col, Switch, Select, Divider, Button} from 'antd'
import i18n from "../../../i18n"
import { BodyEditor } from "./editor"
import { ArticleImages } from "../images/articleImages"
import { useGetArticleImagesQuery } from "../../../services/images"

export const ArticleFrom = (props) => {

  const [form] = Form.useForm()
  const {article} = useParams()
  const { TextArea } = Input;
  const {data,isLoading,isSuccess} = useGetArticleQuery(article)
  const {data:images,isSuccess: imagesSuccess} = useGetArticleImagesQuery(article)
  const [updateArticle] = useUpdateArticleMutation()
  const [articleBody,setArticleBody] = useState()
  const [articleImages,setArticleImages] = useState([])
  const onFinish = vals => {
    console.log('article form vals', vals)
  }

  useEffect(()=>{
    if (isSuccess){
      const { translations } = data
      const { body } = translations.find(({ locale }) => locale === i18n.language)
      setArticleBody(body)
    }

    if (imagesSuccess) {
      console.log('_form images',images)
      setArticleImages(
        images.map(({id})=>(id))
      )
    }

  },[isSuccess, imagesSuccess])

  if (isLoading){
    return <Spin />
  }
  
  const {id,is_alert,is_breaking,is_flash,status, translations} = data

  const {title,lead} = translations.find(({locale})=>locale===i18n.language)
  
  // console.log('_form articleImages',articleImages)

  return <Card extra={<>
    <Button onClick={()=>{
      console.log('save',id)
      form.
        validateFields()
        .then(values=>{
          
          updateArticle({
            id:article,
            body:{
              ...values,
              articleBody,
              lng:i18n.language,
              attachedImages: articleImages}})
        })
    }} >Save</Button>
  </>}>
    <Form
      form={form}
      initialValues={{
        title: title,
        lead: lead,
        // body: body,
        is_flash,
        is_alert,
        is_breaking,
        status
      }}
      onFinish={onFinish}
      layout='vertical'
    >
      <Form.Item name="title" label="Title">
        <Input />
      </Form.Item>
      <Row>
        <Col span={18}>
          <Card>
            <Form.Item name='lead' label='Lead'>
            <TextArea />
          </Form.Item>
          {/* <Form.Item name="body" label='Body'> */}
              
              <BodyEditor initialValue={articleBody} onBodyEdit={body=>setArticleBody(body)} images={images} />
              
          {/* </Form.Item> */}
          </Card>          
        </Col>
        <Col span={24-18}>
          <Card>
          <Form.Item name='status' label="Status">
            <Select >
              <Select.Option value='N'>New</Select.Option>
              <Select.Option value='S'>Submited</Select.Option>
              <Select.Option value='P'>Published</Select.Option>
            </Select>
          </Form.Item>
          <Divider />
            <Form.Item name="is_flash" label="FLASH" valuePropName="checked">
              <Switch defaultChecked={is_flash}  />
          </Form.Item>
            <Form.Item name='is_alert' label="ALERT" valuePropName="checked">
            <Switch defaultChecked={is_alert} />
          </Form.Item>
            <Form.Item name='is_breaking' label="BREAKING" valuePropName="checked">
            <Switch defaultChecked={is_breaking} />
          </Form.Item>
          </Card>
          
            <ArticleImages 
              article={article}
              // images={images}
            />
          
        </Col>
      </Row>
      
    </Form>
  </Card>
}