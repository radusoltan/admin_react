import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from './../lib/axios'
import cookies from '../lib/cookies'

const csrf = async () => axios.get('/sanctum/csrf-cookie')



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

      if (response.status === 200) {        
        return response.data;
      } else {
        return thunkAPI.rejectWithValue('response');
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
        // if (cookies.get("XSRF-TOKEN")){
          // cookies.remove('laravel_session')
          // cookies.remove("XSRF-TOKEN")

        // }          
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
    errorMessage: '',
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
      // console.log(payload)
      state.username = payload.user.name
      state.email = payload.user.email
      state.isFetching = false
      state.isSuccess = true
      state.permissions = payload.permissions
      return state
    },
    [fetchLoggedUser.rejected]: (state)=>{
      state.isFetching = false
      state.isSuccess = false
      state.isError = true
    },
    [logoutUser.pending]: state => {
      state.isFetching = true
    },
    [logoutUser.fulfilled]: (state,{payload}) => {
      state.isFetching = false
      state.isSuccess = true
      state.isError = false
      state.username = ''
      state.email = ''
      state.errorMessage = ''
      return state
    },
    [logoutUser.rejected]: (state,{payload}) => {
      console.log('logout User', payload)
      state.isFetching = false
      state.isError = true
      state.errorMessage = payload.response.message
    }
  }
})

export const {clearState} = userSLice.actions
export const userSelector = state => state.user