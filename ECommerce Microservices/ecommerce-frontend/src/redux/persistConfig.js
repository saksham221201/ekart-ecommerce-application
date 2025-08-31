import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage,
    whiteList: ["auth", "cart", "products", "product", "order", "user", "temp", "category", "review", "brand"],
};

export default persistConfig;