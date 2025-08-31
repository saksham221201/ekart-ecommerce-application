import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    data: null,
    isError: false
}

export const getProductById = createAsyncThunk("getProductById", async (productId) => {
    const productByIdResponse = await fetch(`http://localhost:8081/v1/api/products/${productId}`);
    return productByIdResponse.json();
});

const productByIdSlice = createSlice({
    name: "product",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getProductById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getProductById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        });
        builder.addCase(getProductById.rejected, (state, action) => {
            console.error("Error in fetching Product by Id", action.payload);
            state.isLoading = false;
            state.isError = true;
        });
    }
});

export default productByIdSlice.reducer;