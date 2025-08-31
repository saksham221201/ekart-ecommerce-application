import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    data: null,
    isError: false
}

export const getProducts = createAsyncThunk("getProducts", async () => {
    const productsResponse = await fetch("http://localhost:8081/v1/api/products");
    return productsResponse.json();
});

const productSlice = createSlice({
    name: "products",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        });
        builder.addCase(getProducts.rejected, (state, action) => {
            console.error("Error in fetching Products", action.payload);
            state.isLoading = false;
            state.isError = true;
        });
    }
});

export default productSlice.reducer;