import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import i18n from "../i18n"
import axios from "../lib/axios"
import cookies from "../lib/cookies"

const csrf = async () => axios.get("/sanctum/csrf-cookie")

export const getAll = createAsyncThunk(
  'category/all',
  async (page=1,thunkAPI) => {
    await csrf()
    try {

      const response = await axios.get(`/admin/categories?page=${page}`);

      if (response.status === 200){

        return response.data

      }

    } catch (e){
      return thunkAPI.rejectWithValue(e)
    }
 }  
)

export const getCategory = createAsyncThunk(
  'category/show',
  async (category,thunkAPI) => {

    await csrf()

    try {

      const response = await axios.get(`/admin/categories/${category}`)

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

export const addCategory = createAsyncThunk(
  'category/add',
  async (data,thunkAPI) => {
    try {

      await csrf()

      const response = await axios.post(`/admin/categories`,data,{
        headers: {'XSRF-TOKEN':cookies.get('XSRF-TOKEN')}
      })

      if (response.status === 200){
        return response
      } else {
        return thunkAPI.rejectWithValue(response)
      }

    } catch (e){
      console.log("Add category catch", e);
      return thunkAPI.rejectWithValue(e)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (category,thunkAPI) => {
    try {

      await csrf()

      const response = await axios.delete(`/admin/categories/${category}`, {
        headers: { "XSRF-TOKEN": cookies.get("XSRF-TOKEN") },
      })

      if (response.status === 200){
        return true
      } else {
        return thunkAPI.rejectWithValue(response)
      }

    } catch (e) {
      console.log("delete category e", e);
      return thunkAPI.rejectWithValue(e)
    }
  }
)

// export const publishCategory = createAsyncThunk(
//   'category/publish',
//   async ({key,in_menu},thunkAPI) => {
//     try {

//       await csrf()

//       const response = await axios.post(
//         `/admin/categories/${key}/publish`,{in_menu},
//         {
//           headers: {
//             "XSRF-TOKEN": cookies.get("XSRF-TOKEN"),
//           },
//         }
//       )

//       if (response.status === 200){
//         return true
//       } else {
//         return thunkAPI.rejectWithValue(response)
//       }

//     } catch (e){
//       return thunkAPI.rejectWithValue(e)
//     }
//   }
// )

export const translateCategory = createAsyncThunk(
  'category/translate',
  async ({category,lng,title},thunkAPI) => {
    await csrf()

    const response = await axios.post(
      `/admin/categories/${category}/translate`,
      {
        title,
        lng,
      },
      {
        headers: { "XSRF-TOKEN": cookies.get("XSRF-TOKEN") },
      }
    );

    if (response.status===200){
      return response.data
    } else {
      return thunkAPI.rejectWithValue(response)
    }

  }
)

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({category,values},thunkAPI) => {
    try {
      const data = {
        lng: i18n.language,
        title: values.title,
        in_menu: values.in_menu
      } 
      await csrf()
      const response = await axios.patch(
        `/admin/categories/${category}`,
        data,
        {headers: {'XSRF-TOKEN':cookies.get('XSRF-TOKEN')}}
      )

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

export const getArticles = createAsyncThunk(
  'category/articles',
  async (category,thunkAPI) => {
    try{
      await csrf()

      const response = await axios.get(
        `/admin/categories/${category}/articles`,
        {
          headers: { "XSRF-TOKEN": cookies.get("XSRF-TOKEN") },
        }
      );

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

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    isFetching: false,
    isError: false,
    isSuccess: false,
    paginated: {},
    errorMessage: '',
    category: {},
    paginatedArticles: {}
  },
  reducers: {},
  extraReducers: {
    [getAll.pending]: (state) => {
      state.isFetching = true
    },
    [getAll.fulfilled]: (state,{payload}) => {
      // console.log('getAll categories',payload)
      state.isSuccess = true
      state.isFetching = false
      state.paginated = payload
    },
    [getCategory.pending]: state => {
      state.isFetching = true
    },
    [getCategory.fulfilled]: (state,{payload}) => {
      console.log("getCategory fulfilled", payload);
      state.isFetching = false
      state.isSuccess = true
      state.category = payload

    },
    [getCategory.rejected]: (state,{payload}) => {
      console.log('getCategory rejected', payload)
      state.isError = true
    },
    [deleteCategory.pending]: state => {
      state.isFetching = true
    },
    [deleteCategory.fulfilled]: (state,{payload}) => {
      state.isSuccess = true
      state.isFetching = false
    },
    [deleteCategory.rejected]: (state,{payload}) => {
      console.log('delete category',payload);
      state.isError = true
      state.isSuccess = false
      state.isFetching = false
    },
    [addCategory.pending]: state => {
      state.isFetching = true
    },
    [addCategory.fulfilled]: (state,{payload}) => {
      state.isSuccess = true
      state.isFetching = false

    },
    [addCategory.rejected]: (state,{payload}) => {
      console.log('addCategory rejected',payload)
      state.isError = true
      state.isSuccess = false
      state.isFetching = false
    },
    [updateCategory.pending]: state => {
      state.isFetching = true
    },
    [updateCategory.fulfilled]: (state,{payload}) => {
      state.isSuccess = true
      state.isError = false
    },
    [getArticles.pending]: (state)=>{
      state.isFetching = true
    },
    [getArticles.fulfilled]: (state,{payload})=>{
      state.isFetching = false
      state.isSuccess = true
      state.isError = false
      state.paginatedArticles = payload
    },
    [getAll.fulfilled]: (state,{payload})=>{
      state.isFetching = false
      state.isSuccess = true
      state.paginated = payload
      
    },
    [translateCategory.pending]: state=>{
      state.isFetching = true
    },
    [translateCategory.fulfilled]: (state,{payload})=>{
      
      state.isFetching = false
      state.isSuccess = true
      state.isError = false
    }
    // [publishCategory.pending]: (state)=>{
    //   state.isFetching = true
    // },
    // [publishCategory.fulfilled]: (state)=>{
    //   state.isFetching = false
    //   state.isSuccess = true
    //   state.isError = false
    // },
    // [publishCategory.rejected]: ()=>{}
  }
}) 

export const categorySelector = state => state.category