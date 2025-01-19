"use client"
import {combineReducers,configureStore} from "@reduxjs/toolkit"
import {TypedUseSelectorHook, useSelector, useStore} from "react-redux";
import  Folders  from "./slices/folders";
import  Workspaces  from "./slices/workspaces";
const rootReducer= combineReducers({
Folders,
Workspaces
})

export const store=configureStore({
    reducer:rootReducer,
     middleware:(getDefaultMiddleware)=>{
      return  getDefaultMiddleware({
            serializableCheck:false
        })
    }
})


export type AppDispatch=typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector