import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import Cookies from 'universal-cookie'
const baseUrl = 'http://localhost:8000/admin'
const cookies = new Cookies()
const headers = {
  "X-Requested-With": "XMLHttpRequest",
  "X-CSRF-TOKEN": cookies.get("XSRF-TOKEN"),
};

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Categories"],
  endpoints: (build) => ({
    getCategories: build.query({
      query: (page = 1) => `/categories?page=${page}`,
      providesTags: (result, error, page) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Categories", id })),
              { type: "Categories", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Categories", id: "PARTIAL-LIST" }],
    }),
    addCategory: build.mutation({
      query(body) {
        return {
          url: "/categories",
          method: "POST",
          headers,
          body,
        };
      },
      invalidatesTags: [{ type: "Categories", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation
} = categoryApi