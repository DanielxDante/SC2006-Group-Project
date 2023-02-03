import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '@/components/slice/test'
import menuReducer from '@/components/slice/menu'
import sideBarReducer from '@/components/slice/sideBar'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    menu: menuReducer,
    sideBar: sideBarReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch