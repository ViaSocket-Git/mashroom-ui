import { configureStore } from "@reduxjs/toolkit";
import clustersReducer from "./features/clustersSlice";
import toolsReducer from "./features/toolsSlice";
import aiClientsReducer from "./features/aiClientsSlice";
import skillsReducer from "./features/skillsSlice";

export const store = configureStore({
  reducer: {
    clusters: clustersReducer,
    tools: toolsReducer,
    aiClients: aiClientsReducer,
    skills: skillsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
