import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  createSlice,
  createEntityAdapter,
  createSelector
} from '@reduxjs/toolkit'
const baseUrl = process.env.REACT_APP_API_BASE_URL
const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = (url) => ({ url, headers })

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({baseUrl}),
  tagTypes: ['Articles'],
  endpoints: build => ({
    getArticle: build.query({
      query: (id) => createRequest(`article/${id}`),
    }),
    getArticleByCategory: build.query({
      query: ({page,id}) => createRequest(`category/${id}/articles?page=${page}`),
      providesTags: result => result ? [
        ...result.data.map(({ id }) => ({ type: 'Articles', id })),
        { type: 'Articles', id: 'PARTIAL-LIST' }
      ] : [
          [{ type: 'Artciles', id: 'PARTIAL-LIST' }]
      ]
    }),
    addCategoryArticle: build.mutation({
      query: ({id,body}) => ({
        url: baseUrl + `/category/${id}/add-article`,
        method: 'POST',
        body,
        headers
      }),
      invalidatesTags: [{ type: 'Articles', id: 'PARTIAL-LIST' }]
    }),
    updateArticle: build.mutation({
      query: ({id,body}) => ({
        url: `${baseUrl}/article/${id}`,
        method: 'PATCH',
        body,
        headers
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Articless', id }]
    })
  })
})

export const {
  useGetArticleQuery,
  useGetArticleByCategoryQuery,
  useAddCategoryArticleMutation,
  useUpdateArticleMutation
} = articleApi