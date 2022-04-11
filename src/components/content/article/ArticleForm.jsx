import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast"
import {
  Spin,
  Button,
  Form,
  Input,
  Switch,
  Select,
  Row,
  Col,
  Card,
  Divider
} from "antd"
import {getArticle, articleSelector} from './../../../features/ArticleSlice'
import i18n from '../../../i18n'
import { Editor } from "@tinymce/tinymce-react"
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill"
import { ArticleImages } from './ArticleImages'

export const ArticleForm = () => {
  const editorRef = useRef(null)
  const { Option } = Select
  const {article} = useParams()
  const dispatch = useDispatch()
  const {
    article: apiArticle,
    isFetching,
    isSuccess,
  } = useSelector(articleSelector)

  const [articleTitle,setArticleTitle] = useState('')
  const [articleLead,setArticleLead] = useState('')
  const [articleBody,setArticleBody] = useState('')
  const [isAlert,setIsAlert] = useState(false)
  const [isFlash,setIsFlash] = useState(false)
  const [isBreaking,setIsBreaking] = useState(false)
  const [articleStatus,setArticleStatus] = useState('')
  const [images,setImages] = useState([])


  const modules = {
    toolbar: [
      [{ header: [1, 2, 3,4, false] }],
      [
        "bold",
        "italic",
        "underline"
      ],
      [
        "strike",
        "blockquote",
        {"font":[]},
        {"size":[]},
        "script",
      ],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        {align: []}
      ],
      ["link", "image"],
      // ["clean"],
    ],
  };

  const formats = [
    // "header",
    // "bold",
    // "italic",
    // "underline",
    // "strike",
    // "blockquote",
    // "list",
    // "bullet",
    // "indent",
    // "link",
    // "image",
    // "align"
  ];

  useEffect(()=>{
    dispatch(getArticle(article))
  },[])
  
  useEffect(()=>{
    if (isSuccess){
      const { is_breaking, is_alert, is_flash, status } = apiArticle
      const {title, lead,body} = apiArticle.translations.find(({locale})=>locale===i18n.language)


      setArticleTitle(title)
      setArticleBody(body)
      setArticleLead(lead)
      setIsFlash(is_flash)
      setIsAlert(is_alert)
      setIsBreaking(is_breaking)
      setArticleStatus(status)
      
      
    }
  },[isSuccess])
  
  if (isFetching || Object.keys(apiArticle).length===0){
    return <Spin />
  }
  const saveArticle = ()=>{
    console.log('save')
  }
  const updateArticle = (values) => {
    console.log(values)
  }
  
  
  const onChange = val => {
    setArticleBody(val)
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <div className="article-buttons">
            <Button>Close</Button>
            <Button>{"Save & Close"}</Button>
            <Button onClick={saveArticle}>Save</Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <h3>Title</h3>
          <Input value={articleTitle} />
        </Col>
      </Row>

      <Row>
        <Col span={18}>
          <h3>Lead</h3>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={articleLead}
          />
          <h3>Body</h3>
          <Editor
            apiKey="aywo416v6fszmnbeapee6mhh1rusgyfzjbdetttu6qydo8pu"
            // onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={articleBody}
            init={{
              plugins: "link image code",
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | code",
            }}
            // onEditorChange={(newText) => setArticleBody(newText)}
          />
        </Col>
        <Col span={6}>
          <Card>
            <h3>Status</h3>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              // onChange={handleChange}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <h3>Alerts</h3>

            <span>FLASH</span>
            <Switch defaultChecked={isFlash} />
            <span>ALERT</span>
            <Switch defaultChecked={isAlert} />
            <span>BREAKING</span>
            <Switch defaultChecked={isBreaking} />
          </Card>
          <ArticleImages article={article} onArticleImages={list=>{
            
            setImages(list)
          }} />
        </Col>
      </Row>
    </>
  );
}
