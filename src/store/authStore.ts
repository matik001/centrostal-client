import { AxiosError } from 'axios';
import { AppThunkAction } from './';
import * as localStorageManager from './localStorageManager';
import { LocalStorageItemName } from './localStorageManager';
import * as centrostalApi from '../api/centrostalApi'
// STATE

export interface AuthState {
    token: string | null,
    userId: string | null,
    isAdmin: boolean,
    error: string | null,
    redirectPath: string | null
}


// ACTIONS 


interface LogoutAction {
    type: 'AUTH_LOGOUT';
}
interface LoginStartedAction {
    type: 'AUTH_STARTED';
}
interface LoginSucessfulAction{
    type: "AUTH_SUCESSFUL";
    token: string;
    userId: string;
    isAdmin: boolean;
}
interface LoginError{
    type: "AUTH_ERROR";
    error: string;
}


export type AuthAction = LogoutAction | LoginStartedAction | LoginSucessfulAction | LoginError;

// ACTION CREATORS

export const AuthActions = {
    login: (email:string, password:string ) : AppThunkAction<AuthAction> => async (dispatch, getState)=>{
        dispatch({type: "AUTH_STARTED"});
        try {
            const data = await centrostalApi.login(email, password);
            dispatch({type:"AUTH_SUCESSFUL", 
                      token:data.token, 
                      userId: data.userId, 
                      isAdmin: data.isAdmin});

            localStorageManager.setStr(LocalStorageItemName.TOKEN, data.token);
            localStorageManager.setStr(LocalStorageItemName.USER_ID, data.userId);
            localStorageManager.setDate(LocalStorageItemName.EXPIRATION_TIME, data.expirationTime);
            localStorageManager.setBoolean(LocalStorageItemName.IS_ADMIN, data.isAdmin);
        } catch (error) {
            const err = error as AxiosError;
            dispatch({type: 'AUTH_ERROR', error:err.response?.data || err.message});
        }
    },
    register: (data:centrostalApi.RegistrationData ) : AppThunkAction<AuthAction> => async (dispatch, getState)=>{
        dispatch({type: "AUTH_STARTED"});
        try {
            const res = await centrostalApi.register(data);
            dispatch({type:"AUTH_SUCESSFUL", 
                      token:res.token, 
                      userId: res.userId,
                      isAdmin: res.isAdmin});

            localStorageManager.setStr(LocalStorageItemName.TOKEN, res.token);
            localStorageManager.setStr(LocalStorageItemName.USER_ID, res.userId);
            localStorageManager.setDate(LocalStorageItemName.EXPIRATION_TIME, res.expirationTime);
            localStorageManager.setBoolean(LocalStorageItemName.IS_ADMIN, res.isAdmin);
        } catch (error) {
            const err = error as AxiosError;
            dispatch({type: 'AUTH_ERROR', error:err.message});
        }
    },
    logout: ():LogoutAction => {
        localStorageManager.clearAll();
        return {
            type: "AUTH_LOGOUT"
        }
    },
    autoLogin: ():AppThunkAction<AuthAction> => async(dispatch, getState)=>{
        const token = localStorageManager.getStr(LocalStorageItemName.TOKEN)
        const userId = localStorageManager.getStr(LocalStorageItemName.USER_ID)
        const expiration = localStorageManager.getDate(LocalStorageItemName.EXPIRATION_TIME)
        const isAdmin = localStorageManager.getBoolean(LocalStorageItemName.IS_ADMIN)

        if(token === null || userId === null || expiration === null || isAdmin === null || expiration < new Date()){
            dispatch({type: 'AUTH_LOGOUT'});
            return;
        }
        dispatch({type:"AUTH_SUCESSFUL", token, userId, isAdmin});
    }
};


// REDUCER
    
const initialState = {
    token: null,
    userId: null,
    error: null,
    redirectPath: null,
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
            res = initialState;
            break;
        case 'AUTH_SUCESSFUL':{
            const actionData = (action as LoginSucessfulAction);
            res = {
                token: actionData.token,
                userId: actionData.userId,
                error: null,
                redirectPath: null,
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
                redirectPath: "/login",
                isAdmin: false
            }
            break;
        }
    }
    centrostalApi.updateAuthConfig(res.token);

    return res;
};

