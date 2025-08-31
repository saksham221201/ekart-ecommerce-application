import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    data: null,
    isError: false
}

export const getOrderDetails = createAsyncThunk("getOrderDetails", async (userId) => {
    const getAllOrderDetailsResponse = await fetch(`http://localhost:8082/v1/api/orders`);
    const allOrderDetails = await getAllOrderDetailsResponse.json();
    
    // Filtering the order based on userId
    const filteredOrderDetails = allOrderDetails.filter(order => order.user.userId === userId);
    return filteredOrderDetails;
});

const orderSlice = createSlice({
    name: "order",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getOrderDetails.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        });
        builder.addCase(getOrderDetails.rejected, (state, action) => {
            console.error("Error in fetching Order by UserId", action.payload);
            state.isError = true;
            state.isLoading = false;
        });
    }
});

export default orderSlice.reducer;