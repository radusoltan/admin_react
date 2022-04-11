import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import i18n from "../i18n"
import axios from "../lib/axios"
import cookies from "../lib/cookies"
const csrf = async () => axios.get("/sanctum/csrf-cookie")

export const addArticleImage = createAsyncThunk(
  "article/images/add",
  async ({ article, data }, thunkAPI) => {
    // await csrf();

    try {
      const response = await axios.post(
        `/admin/articles/${article}/addImages`,
        data,
        {
          headers: {
            "XSRF-TOKEN": cookies.get("XSRF-TOKEN"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        return response.data
      } else {
        return thunkAPI.rejectWithValue(response);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const getImagesByArticle = createAsyncThunk(
  "images/by/article",
  async(article, thunkAPI) => {

    // await csrf()

    try {
      const response = await axios.get(`/admin/images/getByArticle/${article}`)
      if (response.status === 200){
        return response.data
      } else {
        return thunkAPI.rejectWithValue(response)
      }
    } catch (e){
      return thunkAPI.rejectWithValue(e)
    }

  }
)

export const detachImage = createAsyncThunk(
  'image/detach',
  async ({article,image},thunkAPI) => {
    // await csrf()
    try{
      const response = await axios.post(`/admin/article/${article}/detach`,{image},{
        headers: {
          "XSRF-TOKEN": cookies.get("XSRF-TOKEN")
        }
      })
      console.log('detach response',response)
    } catch (e){
      return thunkAPI.rejectWithValue(e)
    }
  }
)
export const imageSlice = createSlice({
  name: "image",
  initialState: {
    isSuccess: false,
    isFetching: false,
    isError: false,
    paginatedImages: {},
    error: {},
    image: {},
    articleImages: []
  },
  reducers: {},
  extraReducers: {
    [getImagesByArticle.rejected]: (state, {payload}) => {
      state.isSuccess = false
      state.isError = true
      state.error = payload
      state.isFetching = false
    },
    [getImagesByArticle.pending]: state => {
      state.isFetching = true
    },
    [getImagesByArticle.fulfilled]: (state,{payload}) => {
      state.isFetching = false
      state.isSuccess = true
      state.articleImages = payload.images
    },
    [detachImage.pending]: state => {
      state.isFetching = true
    },
    [detachImage.rejected]: (state,{payload}) => {
      state.isError = true
      state.isSuccess = false
      state.error = payload
      state.isFetching = false
    },
    [detachImage.fulfilled]: (state,{payload}) => {
      state.isFetching = false
      state.isSuccess = true
      state.isError = false
      state.articleImages = payload
    },
    [addArticleImage.pending]: status => {
      status.isFetching = true
    },
    [addArticleImage.fulfilled]: (status,{payload}) => {
      status.isFetching = false
      status.isSuccess = true
      status.articleImages = payload.images
    },
    [addArticleImage.rejected]: (status, {payload}) => {
      status.isFetching = false
      status.isSuccess = false
      status.isError = true
      status.error = payload
    }
  }
})

export const imageSelector = (state) => state.image