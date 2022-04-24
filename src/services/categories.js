import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_BASE_URL
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = (url) => ({ url, headers })

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Categories'],
  endpoints: build => ({
    getCategories: build.query({
      query: (page) => createRequest(`categories?page=${page}`),
      providesTags: result => 
        result ? [
          ...result.data.map(({id}) => ({type: 'Categories',id})),
          { type: 'Categories', id: 'PARTIAL-LIST'}
        ] : [
            [{ type: 'Categories', id: 'PARTIAL-LIST'}]
        ]
    }),
    getCategory: build.query ({
      query: ({id}) => createRequest(`category/${id}`),
      providesTags: (result, error, id) => [{ type: 'Categoris', id }],
    }),
    addCategory: build.mutation({
      query: data => ({
        url: baseUrl+'/category',
        method: 'POST',
        body: data,
        headers        
      }),
      invalidatesTags: [{ type: 'Categories', id: 'PARTIAL-LIST' }]
    }),
    updateCategory: build.mutation({
      query: ({id,body}) => ({
        url: `${baseUrl}/category/${id}`,
        method: 'PATCH',
        body,
        headers
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Categories', id }]
    }),
    translate: build.mutation({      
      query: ({id,body}) => ({
        url: `${baseUrl}/category/${id}/translate`,
        method: 'POST',
        body,
        headers
      }),
      invalidatesTags: (result,error,{id}) => [{type: 'Categories',id}]
    }),
    publish: build.mutation({
      query: (id) => ({
        url: `${baseUrl}/category/${id}/publish`,
        method: 'PATCH',
        headers
      }),
      invalidatesTags: (result,error,{id}) => [{type:'Categories',id}]
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `${baseUrl}/category/${id}`,
        method: 'DELETE',
        headers
      }),
      invalidatesTags: (result,error,id) => [{ type: 'Categories', id: 'PARTIAL-LIST' }]
    })
  })
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useTranslateMutation,
  useDeleteCategoryMutation,
  usePublishMutation
} = categoryApi