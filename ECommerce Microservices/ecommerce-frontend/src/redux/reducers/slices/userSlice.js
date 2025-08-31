import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    data: null,
    isError: false
}

export const getUserById = createAsyncThunk("getUserById", async (userId) => {
    const userByIdResponse = await fetch(`http://localhost:8083/v1/api/users/${userId}`);
    return userByIdResponse.json();
});

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(getUserById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getUserById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
            state.isError = false;
        });
        builder.addCase(getUserById.rejected, (state, action) => {
            console.error("Error in fetching User by Id", action.payload);
            state.isLoading = false;
            state.isError = true;
        });
    }
});

export default userSlice.reducer;