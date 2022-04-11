import {
  Button,
  Switch,
  Spin,
  Modal,
  Form,
  Select,
  Input,
  Table,
  Tag,
  Space,
  Pagination,
} from "antd";
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addArticle, categorySelector, getArticles } from '../../../features/CategorySlice'
import i18n from '../../../i18n'

export const CategoryArticles = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [pageState,setPageState] = useState(1)
  const {
    paginatedArticles,
    isFetching,
    article,
    isSuccess,
    isArticleSuccess,
  } = useSelector(categorySelector);
  const {category} = useParams()
  const [newArticle,setNewArticle] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {Option} = Select
  

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const changePage = page => {
    console.log(page);
    setPageState(page)
    dispatch(getArticles({category,page}))
  }
  const { current_page, total, per_page } = paginatedArticles;
  useEffect(() => {
    
    dispatch(getArticles({category,page:current_page}))
    
    
  }, [])
  useEffect(() => {
    if (isArticleSuccess) {
      navigate(`/content/article/${article.id}`)
    }
    if (isSuccess){
      // setPageState(current_page)
    }
  }, [isArticleSuccess,isSuccess]);
  if (isFetching || Object.keys(paginatedArticles).length===0) {
    return <Spin />;
  }
  
  // setPageState(current_page)
  const finishNewArticle = ({ lng, title }) => {
    const data = {
      lng,
      title,
    };
    dispatch(addArticle({ category, data }))
    dispatch(getArticles({category,page:current_page}))

  }

  const articles = paginatedArticles?.data.map(({ id, status, translations, created_at })=>{
    const translation = translations.find(({ category_id, locale, title }) => {
      if (locale === i18n.language) {
        return {
          title,
          status,
          created_at,
        };
      }
    });
    return translation
      ? {
          key: id,
          title: translation.title,
          status,
          created_at,
        }
      : {
          key: id,
          title: "No title",
          status,
          created_at,
        };
  })
  const columns = [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
      render: (text,{key})=><Link to={`/content/article/${key}`}>{text}</Link>      
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text,{status}) => {
        if(text==='N'){
          return 'New'
        }
        if (text==="S") {
          return "Submited"
        }
        if (text==='P'){
          return "Published"
        }
      }
    },
    {
      title: 'Created',
      key: 'created',
      dataIndex: 'created_at',
      render: (text,record) => {
        let date = new Date(text).toISOString().slice(0, 10)
        return date
      }
    }
  ]

  

  const renderModal = ()=>{
    
    if(newArticle){
      return (
        <Form name="category_new_article" onFinish={finishNewArticle} initialValues={{
          lng: i18n.language
        }}>
          <Form.Item name="lng" label='Language'>
            <Select value={i18n.language}>
              <Option value="ro">RO</Option>
              <Option value="ru">RU</Option>
              <Option value="en">EN</Option>
            </Select>
          </Form.Item>
          <Form.Item name="title" label='title'>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
  
  return (
    <>
      <Button
        onClick={() => {
          setIsModalVisible(true);
          setNewArticle(true);
        }}
      >
        add new
      </Button>
      <Table columns={columns} dataSource={articles} pagination={false} />
      <Pagination
        defaultCurrent={current_page}
        total={total}
        onChange={changePage}
        pageSize={per_page}
      />
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {renderModal()}
      </Modal>
    </>
  );
}
