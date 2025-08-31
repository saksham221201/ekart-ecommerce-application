import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    password: null,
    isForgot: false,
};

export const tempPasswordSlice = createSlice({
    name: 'temp',
    initialState,
    reducers: {
        setTempPassword: (state, action) => {
            state.password = action.payload.user;
            state.isForgot = true;
        },
        clearTempPassword: (state) => {
            state.password = null;
            state.isForgot = false;
        }
    }
});

export const {setTempPassword, clearTempPassword} = tempPasswordSlice.actions;

export default tempPasswordSlice.reducer;