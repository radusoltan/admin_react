import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGetArticleByCategoryQuery, useAddCategoryArticleMutation } from '../../../services/articles'
import { Card, Button, Modal, Form, Select, Input, Spin, Table, Pagination } from 'antd'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n'
import toast, { Toaster } from 'react-hot-toast'

export const ArticleList = () => {
  const {category} = useParams()
  const [page,setPage] = useState(1)
  
  const [visible,setVisible] = useState(false)
  const {t} = useTranslation()
  const {Option} = Select
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [addCategoryArticle,{isLoading: addIsLoading,data:addData,isSuccess:addSuccess}] = useAddCategoryArticleMutation()
  const { data, isLoading, isSuccess } = useGetArticleByCategoryQuery({ id: category, page })
  
  useEffect(() => {
    if (addSuccess) {
      const { id } = addData
      navigate(`/content/article/${id}`)
    }
    
    // if (isLoading) {
    //   return <Spin />
    // }
  }, [addSuccess])

  const pageChange = page => setPage(page)
  
  const columns = [
    {
      title: t("pages.content.categories.table.title"),
      dataIndex: "title",
      key: "title",
      render: (text, { key }) => (
        <Link to={`/content/article/${key}`}>{text}</Link>
      ),
    },
    {
      title: "Status",
      dataIndex: 'status',
      key: 'status',
      render: text => <h3>{text}</h3>
    },
    {
      title: "Created",
      dataIndex: 'created_at',
      key: 'created_at',
      render: text => {
        const date = new Date(text)
        return <span>{date.getDate() + ' / ' + date.getMonth() + ' / ' + date.getFullYear()}</span>
      }
    }
  ]
  
  const articles = data?.data.map(({ id,created_at,is_alert,is_breaking,is_flash,status,translations})=>{
    const {title} = translations.find(({locale})=>locale===i18n.language)??'NoTitle'
    return {
      key: id,
      is_alert,
      is_breaking,
      is_flash,
      status,
      title,
      created_at
    }
  })

  
  
  const handleCancel = () => {
    form.resetFields()
    setVisible(false);
  }

  return (<Card loading={isLoading} extra={<Button onClick={() => { setVisible(true) }}>
    {t("pages.content.categories.add")}
  </Button>}>

    <Table columns={columns} dataSource={articles} pagination={false} />
    <Pagination
      onChange={pageChange}
      defaultCurrent={page}
      defaultPageSize={10}
      total={15}
     />
    <Modal 
      visible={visible} 
      onCancel={handleCancel} 
      onOk={()=>{
        form.
          validateFields()
          .then(body=>{
            addCategoryArticle({ id: category, body })
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          });
      }}
    >
      <Form
        form={form}
        name="new_article_form"
        initialValues={{
          lng: i18n.language
        }}
        
      >
        <Form.Item 
          name='lng' 
          label="Select Language"
        >
          <Select>
            <Option value='ro'>RO</Option>
            <Option value='ru'>RU</Option>
            <Option value='en'>EN</Option>
          </Select>
        </Form.Item>
        <Form.Item name="title" label='title'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
    <Toaster />
  </Card>
  )
}
