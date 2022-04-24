import React from 'react'
import { Form, Modal, Input, Switch, Button, Spin, Select, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useGetCategoryQuery } from '../../../services/categories'
import i18n from '../../../i18n'

export const CategoryCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm()
  const {t} = useTranslation()
  return (<Modal
    visible={visible}
    title="Create a new collection"
    okText="Create"
    cancelText="Cancel"
    onCancel={()=>{
      form.resetFields()
      onCancel()
    }}
    onOk={() => {
      form
        .validateFields()
        .then((values) => {
          form.resetFields();
          console.log(values)
          onCreate(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
          // form.resetFields();
        });
    }}
  >
    <Form
      form={form}
      layout="vertical"
      name="new_category_form"
      initialValues={{
        in_menu: false
        // modifier: 'public',
      }}
    >
      <Form.Item
        label={t('pages.content.categories.form.title')}
        name="title"
        rules={[{ required: true, message: t('pages.content.categories.form.error_title') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t('pages.content.categories.form.in_menu')} name="in_menu" valuePropName="checked">
        <Switch defaultChecked={false} />
      </Form.Item>
    </Form>
  </Modal>)
}

export const EditCategoryForm = ({ id, visible, onEdit, onCancel }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const {data,isLoading} = useGetCategoryQuery({id})

  if (isLoading){
    return <Spin />
  }

  const {translations, in_menu} = data
  
  return <Modal 
    visible={visible} 
    onCancel={() => {
      form.resetFields()
      onCancel()
    }}
    onOk={() => {
      form
        .validateFields()
        .then((values) => {
          form.resetFields()
          const body = {
            lng: i18n.language,
            ...values
          }
          onEdit({id,body})
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
          // form.resetFields();
        });
    }}
  >
    <Form form={form} layout="vertical" name="edit_category_form" initialValues={{
      in_menu,
      title: translations.find(({locale})=>locale===i18n.language).title
    }} >
      <Form.Item label={t('pages.content.categories.form.title')}
      name="title"
      rules={[{ required: true, message: t('pages.content.categories.form.error_title') }]}>
        <Input />
      </Form.Item>
      <Form.Item label={t('pages.content.categories.form.in_menu')} name="in_menu" valuePropName="checked">
        <Switch defaultChecked={false} />
      </Form.Item>
    </Form>
  </Modal>
  // const {data, isLoading} = useGetCategoryQuery(id)

}

export const TranslateCategoryform = ({id,visible,onTranslate,onCancel}) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  console.log('TranslateCategoryForm', id)
  const {data,isLoading} = useGetCategoryQuery({id})
  const { Option } = Select
  if (isLoading) {
    return <Spin />
  }

  const { translations} = data
  return <Modal
    visible={visible}
    onCancel={() => {
      form.resetFields()
      onCancel()
    }}
    onOk={() => {
      form
        .validateFields()
        .then((body) => {
          console.log(body)
          form.resetFields()
          // const body = {
          //   lng: i18n.language,
          //   ...values
          // }
          onTranslate({ id, body })
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
          // form.resetFields();
        });
    }}
  >
    <Form
      form={form}
      layout="vertical" 
      name="translate_category_form"
    >
      {
        translations.map(({locale,title,id})=>(<div key={id}>
          <p>{locale}</p>
          <h3>{title}</h3></div>))
      }
      <Divider />
      <Form.Item name='lng' label="Language">
        <Select value={i18n.language}>
          <Option value='ro'>RO</Option>
          <Option value="en">EN</Option>
          <Option value="ru">RU</Option>
        </Select>
      </Form.Item>
      <Form.Item name='title' label='Tile' rules={[{ required: true, message: t('pages.content.categories.form.error_title') }]}>
        <Input />
      </Form.Item>
    </Form>
  </Modal>  
}
