import {Upload} from 'antd'
import axios from '../lib/axios'
import cookies from "../lib/cookies"
const csrf = async () => axios.get("/sanctum/csrf-cookie")
const imageUpload = ()=><Upload  ></Upload>

export const base64ToBlob = () => {

}

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export function base64StringtoFile(base64String, contentType = "", sliceSize = 512) {
  

  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays)
  return blob

  // var arr = base64String.split(","),
  //   mime = arr[0].match(/:(.*?);/)[1],
  //   bstr = atob(arr[1]),
  //   n = bstr.length,
  //   u8arr = new Uint8Array(n);
  // while (n--) {
  //   u8arr[n] = bstr.charCodeAt(n);
  // }
  // return new File([u8arr], filename, { type: mime });
}