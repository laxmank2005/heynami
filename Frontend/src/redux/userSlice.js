import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  value: 0,
}

const userSlice = createSlice({
  name: 'user',
  initialState:{
    authUser: null
  },
  reducers: {
  setAuthUser: (state, action) => {
    state.authUser = action.payload;
  }
}
})

// Action creators are generated for each case reducer function
export const {setAuthUser} = userSlice.actions

export default userSlice.reducer