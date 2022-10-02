import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
}

export const userSlice = createSlice({  // Reducer de usuarios con sus acciones que modifican su estado
  
  name: 'user',

  initialState,

  reducers: {
    
    loginStart: ( state ) => {                  // Las acciones reciben el state como estuviera y la action con la carga útil
        state.loading = true
    },
    loginSuccess: ( state, action ) => {
        state.loading = false
        state.currentUser = action.payload
    },
    loginFailure: ( state ) => {
        state.loading = false
        state.error = true
    },
    logout: ( state ) => {
        state.currentUser = null;
        state.loading = false;
        state.error = false;
    },                    //channel._id
     subscription: (state, action) => {
      if (state.currentUser.subscribedUsers.includes(action.payload)) { // Si el usuario ya esta suscrito al canal y le da al bton de subscription
        state.currentUser.subscribedUsers.splice(                       // procedemos a borrarlo del campo subcribedUsers
          state.currentUser.subscribedUsers.findIndex(
            (channelId) => channelId === action.payload
          ),
          1
        );
      } else {
        state.currentUser.subscribedUsers.push(action.payload);         // Si el usuario no esta suscrito al canal se mete la id del canal en el campo subcribedUsers
      }
    },
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, subscription } = userSlice.actions;

export default userSlice.reducer