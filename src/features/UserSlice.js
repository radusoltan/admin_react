import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from './../lib/axios'
import Cookies from 'universal-cookie'
// console.log(axios)
const csrf = () => axios.get('/sanctum/csrf-cookie')
// import axios from 'axios'
// const csrf = async () => await axios.get('sanctum/csrf-cookie')
const cookies = new Cookies()
export const loginUser = createAsyncThunk(
  'user/login',
  async ({email, password},thunkAPI) => {
    
    await csrf()
    
    try { 
      const response = await axios.post('/login',{email,password},{headers:{'XSRF-TOKEN':cookies.get('XSRF-TOKEN')}})

      if (response.status === 204){
        return true
      } else {
        return thunkAPI.rejectWithValue(response)
      }
    } catch(e){
      
      return thunkAPI.rejectWithValue(e)
      
    }
    // axios.get('/sanctum/csrf-cookie').then(response=>{
    
    // })
    
  }
)

export const fetchLoggedUser = createAsyncThunk(
  'user/getLogged',
  async (thunkAPI) => {
    try {
      
      const response = await axios.get("/admin/getLoggedUser", {
        headers: {
          "XSRF-TOKEN": cookies.get("XSRF-TOKEN"),
        },
      });

      if (response.status === 200){
        return response.data.user
      } else {
        return thunkAPI.rejectWithValue(response)
      }

    } catch (e){
      return thunkAPI.rejectWithValue(e)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (thunkAPI) => {
    try {
      const response = axios.post('/logout',{},{
        headers: {
          'XSRF-TOKEN': cookies.get('XSRF-TOKEN')
        }
      })

      if (response.status === 204){
        if (cookies.get("XSRF-TOKEN")){
          cookies.remove('laravel_session')
          cookies.remove("XSRF-TOKEN")
        }          
        return true
      } else {
        return thunkAPI.rejectWithValue(response)
      }

    } catch (e){
      return thunkAPI.rejectWithValue(e)
    }
  }
)

export const userSLice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    email: '',
    permissions: [],
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  },
  reducers: {
    clearState: state => {
      state.isError = false
      state.isSuccess = false
      state.isFetching = false
      state.username = ''
      state.email = ''
      state.permissions = []

      return state
    }
  },
  extraReducers: {
    [loginUser.pending]: state => {
      state.isFetching = true
    },
    [loginUser.fulfilled]: (state)=>{
      state.isSuccess = true
      state.isFetching = false

      return state
    },
    [loginUser.rejected]: (state,{payload}) => {
      console.log('login rejected',payload.response.data)
      state.isError = true
      state.errorMessage = payload.response.data.message
      state.isFetching = false

      return state
    },
    [fetchLoggedUser.pending]: (state)=>{
      state.isFetching = true
    },
    [fetchLoggedUser.fulfilled]: (state,{payload})=>{
      
      state.username = payload.name
      state.email = payload.email
      state.isFetching = false
      state.isSuccess = true
      return state
    },
    [fetchLoggedUser.rejected]: (state,{payload})=>{

    },
    [logoutUser.pending]: state => {
      state.isFetching = true
    },
    [logoutUser.fulfilled]: (state,{payload}) => {
      
    },
    [logoutUser.rejected]: (state,{payload}) => {
      console.log('logout User', payload)
      state.isFetching = false
      state.isError = true
      state.errorMessage = payload.response.data.message
    }
  }
})

export const {clearState} = userSLice.actions
export const userSelector = state => state.user