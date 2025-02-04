import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export type User = {
  name: string,
  email: string,
  id: string,
  cookie: string,
}

export type UserType = User

const initState:User = {
  name: '',
  email: '',
  id: '',
  cookie: '',
}



export const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    logout: (state) => {
      state.name = ""
      state.email = ""
      state.id = ""
      state.cookie = ""
    },
    login: (state, action:PayloadAction<User>) => {
      console.log(action.payload)
      state.name = action.payload.name
      state.email = action.payload.email
      state.id = action.payload.id
      state.cookie = action.payload.cookie
    },
    updateName: (state, action:PayloadAction<User>) => {
      state.name = action.payload.name
    },
    updateEmail: (state, action:PayloadAction<User>) => {
      state.email = action.payload.email
    },
  }
})



export default userSlice.reducer
export const { logout, login, updateName, updateEmail } = userSlice.actions