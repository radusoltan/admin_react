import { configureStore } from "@reduxjs/toolkit"
import { userSLice } from "./features/UserSlice"
import { categoryApi } from "./services/ctegories"

export default configureStore({
  reducer: {
    user: userSLice.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .concat([
      categoryApi.middleware,
    ])
})