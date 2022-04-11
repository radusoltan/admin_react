import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import i18n from "../i18n"
import axios from "../lib/axios"
import cookies from "../lib/cookies"
const csrf = async () => axios.get("/sanctum/csrf-cookie");

const updateArticle = createAsyncThunk(
  'article/update',
  async ({article,data},thunkAPI)=>{
    await csrf()
    try{
      const response = axios.patch(`/admin/articles/${article}`, data, {
        headers: { "XSRF-TOKEN": cookies.get("XSRF-TOKEN") },
      });
    } catch (e){
      return thunkAPI.rejectWithValue(e)
    }
  }
)

// export const addArticleImage = createAsyncThunk(
//   'article/images/add',
//   async ({article,data},thunkAPI) => {
//     await csrf()
    
//     try {
//       const response = await axios.post(
//         `/admin/articles/${article}/addImages`,
//         data,
//         {
//           headers: {
//             "XSRF-TOKEN": cookies.get("XSRF-TOKEN"),
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200){
//         // console.log('addArticleImages',response)
//       } else {
//         return thunkAPI.rejectWithValue(response)
//       }
//     } catch (e){
//       return thunkAPI.rejectWithValue(e)
//     }
//   }
// )

export const getArticle = createAsyncThunk(
  'article/get',
  async (article,thunkAPI) => {
    await csrf()
    try{
      const response = await axios.get(`/admin/articles/${article}`, {
        headers: {
          "XSRF-TOKEN": cookies.get("XSRF-TOKEN"),
          
        },
      });
      if (response.status === 200){
        return response.data.article
      } else {
        return thunkAPI.rejectWithValue(response)
      }
    } catch (e){
      return thunkAPI.rejectWithValue(e)
    }
  }
)

export const articleSlice = createSlice({
  name: 'article',
  initialState: {
    isSuccess: false,
    isFetching: false,
    isError: false,
    paginatedArticles: {},
    error: {},
    article: {},
    images: [],
  },
  reducers: {},
  extraReducers: {
    [updateArticle.pending]: state=>{
      state.isFetching = true
    },
    [updateArticle.fulfilled]: (state,{payload}) => {
      console.log('update article',payload)
    },
    [getArticle.pending]: state => {
      state.isFetching = true
    },
    [getArticle.fulfilled]: (state,{payload}) => {
      state.isFetching = false
      state.isError = false
      state.isSuccess = true
      state.article = payload
      state.images = payload.images
    },
    [getArticle.rejected]: (state,{payload}) => {
      state.isError = true
      state.error = payload
    }
  }
})

export const articleSelector = (state) => state.article