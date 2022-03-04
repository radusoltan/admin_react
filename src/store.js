import { configureStore } from "@reduxjs/toolkit"
import { userSLice } from "./features/UserSlice"
import { categoryApi } from "./services/ctegories"
import { categorySlice } from "./features/CategorySlice"

export default configureStore({
  reducer: {
    user: userSLice.reducer,
    category: categorySlice.reducer,
    // [categoryApi.reducerPath]: categoryApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .concat([
      // categoryApi.middleware,
    ])
})