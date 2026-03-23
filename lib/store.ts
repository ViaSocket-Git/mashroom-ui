import { configureStore } from "@reduxjs/toolkit";
import clustersReducer from "./features/clustersSlice";
import toolsReducer from "./features/toolsSlice";
import aiClientsReducer from "./features/aiClientsSlice";

export const store = configureStore({
  reducer: {
    clusters: clustersReducer,
    tools: toolsReducer,
    aiClients: aiClientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
