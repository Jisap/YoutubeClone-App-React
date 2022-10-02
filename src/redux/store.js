import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import videoReducer from './videoSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = { // Definimos un almacenamiento físico en webstorage con redux-persist
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({ user:userReducer, video:videoReducer });   // Combinamos los reducers en uno

const persistedReducer = persistReducer(persistConfig, rootReducer);  // Almacenamos los reducers combinados 

export const store = configureStore({       // Definimos nuestro store, donde almacenaremos los estados definidos por nuestros reducers. 
  reducer: persistedReducer,                // Los user y video guardados en persistReducer se usarán en todos nuestros componentes
    middleware: ( getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck:{
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),                  
});

export const persistor = persistStore( store ); // Hacemos persistente nuestro store