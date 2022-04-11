import { configureStore } from "@reduxjs/toolkit"
import { userSLice } from "./features/UserSlice"
import { categorySlice } from "./features/CategorySlice"
import { articleSlice } from "./features/ArticleSlice"
import { imageSlice } from "./features/ImageSlice"

export default configureStore({
  reducer: {
    user: userSLice.reducer,
    category: categorySlice.reducer,
    article: articleSlice.reducer,
    image: imageSlice.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
    .concat([
      
    ])
})