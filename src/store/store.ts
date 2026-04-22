import { configureStore } from '@reduxjs/toolkit'
import workflowReducer from './workflowSlice'

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for React Flow objects
    }),
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch