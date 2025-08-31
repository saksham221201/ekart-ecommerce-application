import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoggedIn: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload.user;
            state.isLoggedIn = true;
        },
        logoutUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        }
    }
});

export const {loginUser, logoutUser} = authSlice.actions;

export default authSlice.reducer;