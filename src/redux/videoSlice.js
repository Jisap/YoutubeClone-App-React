import { createSlice } from "@reduxjs/toolkit";

const initialState = {                        // Estado inicial de video
  currentVideo: null,
  loading: false,
  error: false,
};

export const videoSlice = createSlice({       // Reducer de video que modifican su estado a través de sus acciones
  name: "video",                              // Nombre
  initialState,                               // Estado inicial
  reducers: {                                 // Acciones de videos

    fetchStart: (state) => {                  // Empezar petición de video
      state.loading = true;
    },
    fetchSuccess: (state, action) => {        // Petición de video exitosa
      state.loading = false;
      state.currentVideo = action.payload;
      //console.log(state.currentVideo)
    },
    fetchFailure: (state) => {                // Petición de video fallida
      state.loading = false;
      state.error = true;
    },
    like: (state, action) => {                                          // Video gustó
      if (!state.currentVideo.likes.includes(action.payload)) {         // Si like (id del usuario) no existe en el state del video
        state.currentVideo.likes.push(action.payload);                  // lo metemos en el
        state.currentVideo.dislikes.splice(                             // y borramos el dislike (id del usuario) en la posición
          state.currentVideo.dislikes.findIndex(                        // del usuario que lo creo
            (userId) => userId === action.payload
          ),
          1
        );
      }
    },
    dislike: (state, action) => {
      if (!state.currentVideo.dislikes.includes(action.payload)) {    // Video no gusto
        state.currentVideo.dislikes.push(action.payload);
        state.currentVideo.likes.splice(
          state.currentVideo.likes.findIndex(
            (userId) => userId === action.payload
          ),
          1
        );
      }
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, like, dislike } = videoSlice.actions;

export default videoSlice.reducer;