import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_API_BASE_URL
const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token')
}

const createRequest = (url) => ({ url, headers })

export const imageApi = createApi({
  reducerPath: 'imagesApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Image'],
  endpoints: build => ({
    getArticleImages: build.query({
      query: (id) => createRequest(`/article/${id}/images`),
      providesTags: result => result
        ? // successful query
        [
          ...result.map(({ id }) => ({ type: 'Image', id })),
          { type: 'Image', id: 'LIST' },
        ]
        : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
        [{ type: 'Image', id: 'LIST' }]
    }),
    uploadArticleImages: build.mutation({
      query: ({article,body}) =>  ({
        url: `/article/${article}/upload-images`,
        method: 'POST',
        body,
        headers
      }),
      invalidatesTags: result => result
        ? // successful query
        [
          ...result.map(({ id }) => ({ type: 'Image', id })),
          { type: 'Image', id: 'LIST' },
        ]
        : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
        [{ type: 'Image', id: 'LIST' }]
    }),
    detachArticleImages: build.mutation({
      query: ({article,id}) => ({
        url: `/article/${article}/detach-images`,
        method: "POST",
        body: {id},
        headers
      }),
      invalidatesTags: result => result
        ? // successful query
        [
          ...result.map(({ id }) => ({ type: 'Image', id })),
          { type: 'Image', id: 'LIST' },
        ]
        : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
        [{ type: 'Image', id: 'LIST' }]
    })
  })
})

export const {
  useUploadArticleImagesMutation,
  useDetachArticleImagesMutation,
  useGetArticleImagesQuery
} = imageApi