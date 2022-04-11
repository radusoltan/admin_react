import React, { useEffect, useState } from 'react'
import {
  Spin,
  Button,
  Table,
  Modal,
  Pagination,
  Form,
  Input,
  Switch,
  Select,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux'
import { 
  getAll,
  categorySelector,
  deleteCategory, 
  updateCategory,
  addCategory,
  translateCategory
} from './../../../features/CategorySlice'
import { useTranslation } from 'react-i18next'
import i18n  from './../../../i18n'
import toast, { Toaster } from "react-hot-toast"
import { Link } from 'react-router-dom'







export const Categories = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [page,setPage] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  const [isNew,setIsNew] = useState(false)
  const [categoryId,setCategoryId] = useState(null)
  const [translate,setTranslate] = useState(false)
  const {Option} = Select
  const columns = [
    {
      title: t("pages.content.categories.table.title"),
      dataIndex: "title",
      key: "title",
      render: (text, { key }) => (
        <Link to={`/content/category/${key}`}>{text}</Link>
      ),
    },
    {
      title: "Actions",
      render: ({ key }) => (
        <>
          <Button icon={<EditOutlined />} onClick={()=>{
            setCategoryId(key)
            setIsEdit(true)
            setIsModalVisible(true)
          }} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              deleteCat(key)
            }}
          />
          <Button onClick={()=>{
            setTranslate(true)
            setCategoryId(key)
            setIsModalVisible(true);
            // translateCat({category:key,lang:i18n.language})
          }}>Translate</Button>
        </>
      ),
    },
  ];
  
  const {paginated, isFetching, isError, isSuccess} = useSelector(categorySelector)
  useEffect(() => dispatch(getAll()), []);
  
  
  if (isFetching || Object.keys(paginated).length == 0) {
    return <Spin />;
  }

  const changePage = page => {
    setPage(page)
    dispatch(getAll(page))
  }
  
  const addNewCategory = () => {
    setIsNew(true)
    setIsModalVisible(true)
  }

  const deleteCat = category => {
    
    dispatch(deleteCategory(category))
    if (isSuccess){
      toast.success(`Category ${category} deleted`)
    }
    dispatch(getAll(page))
  }
  
  const categories = paginated?.data.map(({id,translations})=>{
    
    const translation = translations.find(({category_id,locale,title})=>{
      if (category_id===id && locale===i18n.language){
        return {
          title
        }
      }
    })
    return translation?(
      {
        key:id,
        title:translation.title
      }
    ):(
      {
        key:id,
        title:'No title'
      }
    )    
  })

  const { total, per_page, current_page } = paginated;  


  const formFinish = async ({title,in_menu}) => {

    dispatch(addCategory({title,in_menu,lng:i18n.language}))

    toast.success('Category added')

    dispatch(getAll(page))
    
    setIsModalVisible(false);
    setIsNew(false)
  }
  
  const handleCancel = () => {
    setIsModalVisible(false);
  }

  const editCategory = (values) => {
    console.log(values)
    dispatch(updateCategory({ category:categoryId, values }))
    toast.success("Category added")
    dispatch(getAll(page))
    setIsModalVisible(false);
    setIsEdit(false)
    setCategoryId(null)
  }

  const translateCat = ({title,lng}) => {

    setIsModalVisible(true)
    
    dispatch(translateCategory({category:categoryId,lng,title}))
    dispatch(getAll(page))
    toast.success("Category translated");
    setIsModalVisible(false)
    setTranslate(false)
    setCategoryId(null)
  }

  const modalRender = ()=>{

    if (translate){
      const { translations} = paginated.data.find(({id})=>id===categoryId)
      return (<>
      <Form
        name="translate_category"
        onFinish={translateCat}
        initialValues={{
        title: translations.find(({ locale }) => locale === 'ro')
              .title,
            lng: i18n.language
          }}
        >
          <Form.Item name="lng" label="Language">
            <Select value={i18n.language}>
              <Option value="ro">RO</Option>
              <Option value="ru">RU</Option>
              <Option value="en">EN</Option>
            </Select>
          </Form.Item>
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form></>)
    }
    
    if (isEdit){
      const { in_menu, translations} = paginated.data.find(({id})=>id===categoryId)
      
      return (
        <Form
          name="edit_category"
          onFinish={editCategory}
          initialValues={{
            title: translations.find(({ locale }) => locale === i18n.language)
              .title,
            in_menu,
          }}
        >
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="in_menu" label="in_menu">
            <Switch defaultChecked={in_menu} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      );

    }


    if (isNew){      
      return (
        <Form
          name="new_category"
          onFinish={formFinish}
          initialValues={{ in_menu: false }}
        >
          <Form.Item
            label="title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="in_menu" name="in_menu" valuePropName="checked">
            <Switch defaultChecked={false} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )
    }    
  }
  
  return (
    <>
      <Button onClick={addNewCategory}>
        {t("pages.content.categories.add")}
      </Button>
      <Table columns={columns} dataSource={categories} pagination={false} />
      <Pagination
        defaultCurrent={page}
        total={total}
        current={current_page}
        defaultPageSize={per_page}
        onChange={changePage}
      />
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        {modalRender()}
      </Modal>
      <Toaster />
    </>
  );
}
