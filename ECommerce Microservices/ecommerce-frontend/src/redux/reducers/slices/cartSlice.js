import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CART_USER_URL } from "../../../constants/Constant";

const initialState = {
    isLoading: false,
    data: null,
    isError: false
}

export const getCartByUserId = createAsyncThunk("getCartByUserId", async (userId) => {
    const cartByUserIdResponse = await fetch(`${CART_USER_URL}${userId}`);
    return cartByUserIdResponse.json();
});

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getCartByUserId.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCartByUserId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        });
        builder.addCase(getCartByUserId.rejected, (state, action) => {
            console.error("Error in fetching Cart by Id", action.payload);
            state.isLoading = false;
            state.isError = true;
        });
    }
});

export default cartSlice.reducer;