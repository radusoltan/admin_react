import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";

export const BodyEditor = ({initialValue,onBodyEdit,images}) => {
  const [value,setValue] = useState()
  
  // const image_list = 

  // console.log(list);
  
  useEffect(() => setValue(initialValue ?? ''),[initialValue])
  return  < Editor
    apiKey="aywo416v6fszmnbeapee6mhh1rusgyfzjbdetttu6qydo8pu"
    initialValue = { initialValue }
    value = { value }
    onEditorChange = {(newValue, editor) => {
      setValue(newValue)
      onBodyEdit(newValue)
    }}
    init={{
      height: 500,
      menubar: false,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | blocks | myButton |' +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help |'+
        'image',
      setup: editor => {
        editor.ui.registry.addButton('myButton', {
          icon: 'user',
          onAction: function (_) {
            editor.insertContent('&nbsp;<strong>It\'s my icon button!</strong>&nbsp;');
          }
        });
      },
      image_list: images.map(({ name, path }) => ({
        title: name,
        value: `http://nginx.local/${path}`
      })),
      image_advtab: true,
      a11y_advanced_options: true,
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    }}
  />
}