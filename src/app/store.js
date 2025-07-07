import { configureStore } from '@reduxjs/toolkit';
import reducer from './features/movies/movieSlice';


export const store = configureStore({
  reducer: {
    movies: reducer,
  },
});
