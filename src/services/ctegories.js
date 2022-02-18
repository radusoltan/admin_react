import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import Cookies from 'universal-cookie'
const baseUrl = 'http://localhost:8000/admin/categories'
const cookies = new Cookies()
const headers = {
  "XSRF-TOKEN": cookies.get("XSRF-TOKEN"),
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Categories'],
  endpoints: build => ({
    getCategories: build.query({
      query: ()=>'/',
    })
  })
});

export const {
  useGetCategoriesQuery
} = categoryApi