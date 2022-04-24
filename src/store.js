import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { categoryApi } from './services/categories'
import { userApi } from './services/user'
import { articleApi } from './services/articles'
import { imageApi } from './services/images'
export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [articleApi.reducerPath]: articleApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      categoryApi.middleware,
      userApi.middleware,
      articleApi.middleware,
      imageApi.middleware
    ]),
})
setupListeners(store.dispatch)