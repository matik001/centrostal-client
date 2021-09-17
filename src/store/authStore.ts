import { AxiosError } from 'axios';
import { AppThunkAction } from './';
import type { AuthAction, LoginError, LoginSucessfulAction } from './authActions';
// STATE

export interface AuthState {
    token: string | null,
    userId: string | null,
    isAdmin: boolean,
    error: string | null,
    redirectPath?: string
}




// ACTION CREATORS

// REDUCER
    
const initialState = {
    token: null,
    userId: null,
    error: null,
    redirectPath: undefined,
    isAdmin: false
};

export const authReducer = (state: AuthState | undefined, action: AuthAction): AuthState => {
if (state === undefined) {
        return initialState;
    }
    let res = state;
    switch (action.type) {
        case 'AUTH_LOGOUT':
            res = initialState;
            break;

        case 'AUTH_STARTED':
            res = {
                ...initialState,
            };
            break;
        case 'AUTH_SUCESSFUL':{
            const actionData = (action as LoginSucessfulAction);
            res = {
                token: actionData.token,
                userId: actionData.userId,
                error: null,
                redirectPath: actionData.redirectPath,
                isAdmin: actionData.isAdmin
            }
            break;
        }
        case 'AUTH_ERROR':{
            const actionData = (action as LoginError);
            res =  {
                token: null,
                userId: null,
                error: actionData.error,
                redirectPath: undefined,
                isAdmin: false
            }
            break;
        }
        case 'AUTH_CLEAR_REDIRECT':
            res = {
                ...res,
                redirectPath: undefined
            }
    }

    return res;
};

