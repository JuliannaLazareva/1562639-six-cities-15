import type { TypedUseSelectorHook } from 'react-redux';

import { useDispatch, useSelector, useStore } from 'react-redux';

import type {store} from '../store';
import type { AppDispatch, RootState } from '../types/store';
import { ActionCreatorsMapObject, AsyncThunk, bindActionCreators, createAsyncThunk } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { AxiosInstance } from 'axios';

const useAppDispatch = useDispatch<AppDispatch>;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppStore: () => typeof store = useStore;

const useActionCreators = <Actions extends ActionCreatorsMapObject>(actions: Actions): BoundActions<Actions> => {
  const dispatch = useAppDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => bindActionCreators(actions, dispatch), []);
};

type BoundActions<Actions extends ActionCreatorsMapObject> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any> ? BoundAsyncThunk<Actions[key]> : Actions[key];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BoundAsyncThunk<Thunk extends AsyncThunk<any, any, any>> = (...args: Parameters<Thunk>) => ReturnType<ReturnType<Thunk>>;

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>();

export {useActionCreators, useAppDispatch, useAppSelector, useAppStore, createAppAsyncThunk};
