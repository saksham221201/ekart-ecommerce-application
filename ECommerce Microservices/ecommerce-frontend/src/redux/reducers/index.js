import authSlice from "./slices/authSlice";
import productSlice from "./slices/productSlice";
import productByIdSlice from "./slices/productByIdSlice";
import cartSlice from "./slices/cartSlice";
import orderSlice from "./slices/orderSlice";
import userSlice from "./slices/userSlice";
import reviewByIdSlice from "./slices/reviewByIdSlice";
import productsByCategory from "./slices/productsByCategory";
import productByBrand from "./slices/productByBrand";
import tempPasswordSlice from "./slices/tempPasswordSlice";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import persistConfig from "../persistConfig";

const rootReducer = combineReducers({
    authSlice: authSlice,
    productSlice: productSlice,
    productByIdSlice: productByIdSlice,
    cartSlice: cartSlice,
    orderSlice: orderSlice,
    userSlice: userSlice,
    tempPasswordSlice: tempPasswordSlice,
    productsByCategory: productsByCategory,
    productByBrand: productByBrand,
    reviewByIdSlice: reviewByIdSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;