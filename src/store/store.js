import { configureStore } from "@reduxjs/toolkit";
import watchesReducer from "./watchesSlice";

export const store = configureStore({
  reducer: {
    watches: watchesReducer,
  },
});
