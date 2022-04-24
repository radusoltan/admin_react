import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_BASE_URL
const userHeaders = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = (url) => ({ url, headers: userHeaders })
export const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({baseUrl}),
  endpoints: (build) => ({
    getLoggedUser: build.query({
      query: ()=>createRequest('check-auth',userHeaders)
    })
  })
})

export const { useGetLoggedUserQuery } = userApi