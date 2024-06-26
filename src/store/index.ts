import { configureStore } from '@reduxjs/toolkit';

import { offersSlice } from './slices/offers';
import { createAPI } from '../services/api';
import { userSlice } from './slices/user';
import { OfferSlice } from './slices/offer';
import { reviewSlice } from './slices/reviews';
import { favoritesSlice } from './slices/favorites';

export const api = createAPI();

export const store = configureStore({
  reducer: {
    [offersSlice.name]: offersSlice.reducer,
    [OfferSlice.name]: OfferSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [reviewSlice.name]: reviewSlice.reducer,
    [favoritesSlice.name]: favoritesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});
