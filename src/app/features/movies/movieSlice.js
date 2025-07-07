import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'ac2e9eec';

// Async thunk to fetch movies
export const searchMovies  = createAsyncThunk(
  'movies/searchMovies ',
  async ({ query, page = 1 }, thunkAPI) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`);
      console.log("API Response:", page); // Debugging line to check API response
      if (response.data.Response === "False") {
        return thunkAPI.rejectWithValue(response.data.Error);
      }
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Something went wrong!");
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    totalResults: 0,
    loading: false,
    error: null,
    query: '',
  },
  reducers: {
    clearMovies: (state) => {
      state.movies = [];
      state.totalResults = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies .pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies .fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.Search;
        state.totalResults = action.payload.totalResults;
        state.query = action.meta.arg.query; // Store the current query
      })
      .addCase(searchMovies .rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMovies } = movieSlice.actions;
export default movieSlice.reducer;
