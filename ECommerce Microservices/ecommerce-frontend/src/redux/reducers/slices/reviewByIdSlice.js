import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    data: null,
    isError: false
}

export const getReviewByProductId = createAsyncThunk("getReviewByProductId", async (productId) => {
    const getReviewByProductIdResponse = await fetch(`http://localhost:8087/v1/api/reviews/${productId}`);
    return getReviewByProductIdResponse.json();
});

const reviewByIdSlice = createSlice({
    name: "review",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getReviewByProductId.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getReviewByProductId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        });
        builder.addCase(getReviewByProductId.rejected, (state, action) => {
            console.error("Error in fetching Review by Id", action.payload);
            state.isLoading = false;
            state.isError = true;
        });
    }
});

export default reviewByIdSlice.reducer;