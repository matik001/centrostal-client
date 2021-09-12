import { combineReducers, configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { AuthAction, authReducer, AuthState } from './authStore';


export interface ApplicationState {
  auth: AuthState | undefined;
  // myQuizzes: QuizzesState | undefined;
  // weatherForecasts: WeatherForecasts.WeatherForecastsState | undefined;
}

type ApplicationAction = AuthAction;
export type ApplicationThunkAction = ApplicationAction|AppThunkAction<ApplicationAction>;

export const reducers = {
  auth: authReducer,
  // myQuizzes: quizzesReducer
  // weatherForecasts: WeatherForecasts.reducer
};
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, 
  getState: () => ApplicationState): void;
}

const middlewares = [
    thunk
]
const rootReducer = combineReducers({
  ...reducers,
});

const combinedStore =  configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: middlewares
});



export default combinedStore;