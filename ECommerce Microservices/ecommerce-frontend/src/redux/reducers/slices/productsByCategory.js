import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    data: null,
    isError: false
}

export const getProductsByCategory = createAsyncThunk("getProductsByCategory", async (category) => {
    const productsByCategoryResponse = await fetch(`http://localhost:8081/v1/api/products/category/${category}`);
    return productsByCategoryResponse.json();
});

const productsByCategorySlice = createSlice({
    name: "category",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getProductsByCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getProductsByCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        });
        builder.addCase(getProductsByCategory.rejected, (state, action) => {
            console.error("Error in fetching Product by Category", action.payload);
            state.isLoading = false;
            state.isError = true;
        });
    }
});

export default productsByCategorySlice.reducer;