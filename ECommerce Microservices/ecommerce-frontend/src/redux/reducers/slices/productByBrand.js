import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    data: null,
    isError: false
}

export const getProductsByBrand = createAsyncThunk("getProductsByBrand", async (brand) => {
    const productsByBrandResponse = await fetch(`http://localhost:8081/v1/api/products/brand/${brand}`);
    return productsByBrandResponse.json();
});

const productsByBrandSlice = createSlice({
    name: "brand",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getProductsByBrand.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getProductsByBrand.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        });
        builder.addCase(getProductsByBrand.rejected, (state, action) => {
            console.error("Error in fetching Product by Brand", action.payload);
            state.isLoading = false;
            state.isError = true;
        });
    }
});

export default productsByBrandSlice.reducer;