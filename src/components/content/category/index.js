import React, { useEffect, useState } from 'react'
import { Card, Button, Table, Switch, Pagination } from 'antd'
import { Link } from 'react-router-dom'
import { useGetCategoriesQuery, useAddCategoryMutation, useUpdateCategoryMutation, useTranslateMutation, useDeleteCategoryMutation, usePublishMutation } from '../../../services/categories'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { useTranslation } from 'react-i18next'
import { CategoryCreateForm, EditCategoryForm, TranslateCategoryform } from './_form'
import i18n from '../../../i18n'
import toast, { Toaster } from 'react-hot-toast'


export const Categories = () => {
  const [page,setPage] = useState(1)
  const [isNew,setIsNew] = useState(false)
  const [isEdit,setIsEdit] = useState(false)
  const [isTranslate,setIsTranslate] = useState(false)
  const [category,setCategory] = useState(null)
  const [pagination,setPagination] = useState({})

  const [addCategory] = useAddCategoryMutation()
  const [update] = useUpdateCategoryMutation()
  const [translate] = useTranslateMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [publish] = usePublishMutation()

  const {data,isLoading,error, isSuccess} = useGetCategoriesQuery(page)
  const {t} = useTranslation()

  useEffect(()=>{
    if (isSuccess){
      const {current_page,per_page,total} = data
      setPagination({
        current_page,
        per_page,
        total        
      })
      
    }
  },[isSuccess])

  const onCreate = ({title,in_menu}) => {
    addCategory({ title, in_menu, lng: i18n.language })
    toast.success(t('pages.content.categories.messages.added'))
    setIsNew(false)
  }

  const onEdit = (vals) => {
    update(vals)
    setIsEdit(false)
    setCategory(null)
    toast.success(t('pages.content.categories.messages.updated'))
  }

  const onTranslate = (values) => {
    translate(values)
    setIsTranslate(false)
    setCategory(null)
    toast.success(t('pages.content.categories.messages.translated'))
  }

  const handleDelete = key => {
    deleteCategory(key)

  }

  const changePage = page => {
    setPage(page)
  }

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
      title: t('pages.content.categories.table.in_menu'),
      dataIndex: 'in_menu',
      key: 'in_menu',
      render: (text, { key, in_menu }) => (
        <Switch onChange={() => {/* publish(key) */}} checked={in_menu} />
      )
    },
    {
      title: "Actions",
      render: ({ key }) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => {
            setIsEdit(true)
            setCategory(key)
            // return <EditCategoryForm id={category} visible={isEdit} onEdit={onEdit} />
          }} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              handleDelete(key)
            }}
          />
          <Button onClick={() => {
            setIsTranslate(true)
            setCategory(key)
          }}>Translate</Button>
        </>
      ),
    },
  ];

  const categories = data?.data.map(({ id, in_menu, translations }) => {

    const translation = translations.find(({ locale }) => locale === i18n.language)

    return translation ? (
      {
        key: id,
        title: translation.title,
        in_menu
      }
    ) : ({
      key: id,
      title: 'No title',
      in_menu
    })

  })

  // const { total, per_page, current_page} = 
  const {current_page,total,per_page} = !Object.keys(pagination).length === 0 ? pagination : {current_page: page, total: 10, per_page:10}
  return (<Card loading={isLoading} extra={<Button onClick={()=>{setIsNew(true)}}>
    {t("pages.content.categories.add")}
  </Button>}>

    <Table columns={columns} dataSource={categories} pagination={false} />
    <Pagination
      total={total}
      defaultCurrent={current_page}
      onChange={changePage}
    />
    <CategoryCreateForm visible={isNew}
      onCreate={onCreate}
      onCancel={() => {
        setIsNew(false);
      }} />
      {
        // console.log('render',isEdit??'this')
      isEdit?
      <EditCategoryForm 
        id={category} 
        visible={isEdit} 
        onCancel={()=>{
          setIsEdit(false)
          setCategory(null)
        }}
        onEdit={onEdit} />:
      isTranslate? 
      <TranslateCategoryform 
        visible={isTranslate}
        id={category} 
        onTranslate={onTranslate} 
        onCancel={()=>{
          setIsTranslate(false)
          setCategory(null)
        }}

      />:''
      }
      <Toaster />
  </Card>)
}
