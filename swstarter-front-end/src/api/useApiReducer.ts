import { useReducer } from 'react';

export type ApiState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | string | null;
};

type Action<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: Error | string | null  };

function apiReducer<T>(state: ApiState<T>, action: Action<T>): ApiState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

export function useApiReducer<T>() {
  return useReducer(apiReducer, initialState as ApiState<T>);
}