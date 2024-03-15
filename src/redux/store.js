import { createStore , combineReducers,applyMiddleware } from "redux";
import {persistReducer} from 'redux-persist'
import AuthReducer from "./reducers";
import { thunk } from "redux-thunk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import persistStore from "redux-persist/es/persistStore";



const persistStorageConfig = {
    key  : "SocialBharat",
    storage : AsyncStorage
}


const RootReducer = combineReducers({
    AuthReducer,
    });
    

// const persistedState =  AsyncStorage.getItem('reduxStore') ? AsyncStorage.getItem('reduxStore') : {}


const persistedReducer =  persistReducer(persistStorageConfig ,  RootReducer)


export default store = createStore(persistedReducer, applyMiddleware(thunk));

export const persistor  = persistStore(store)

