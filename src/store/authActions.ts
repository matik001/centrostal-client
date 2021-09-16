import { AxiosError } from "axios";
import type { AppThunkAction } from ".";
import * as centrostalApi from '../api/centrostalApi'
import * as  localStorageManager from './localStorageManager'
import { LocalStorageItemName } from "./localStorageManager";

export interface LogoutAction {
    type: 'AUTH_LOGOUT';
}
export interface LoginStartedAction {
    type: 'AUTH_STARTED';
}
export interface LoginSucessfulAction{
    type: "AUTH_SUCESSFUL";
    token: string;
    userId: string;
    isAdmin: boolean;
}
export interface LoginError{
    type: "AUTH_ERROR";
    error: string;
}

export type AuthAction = LogoutAction | LoginStartedAction | LoginSucessfulAction | LoginError;

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
            dispatch(AuthActions.logout());
            return;
        }
        dispatch({type:"AUTH_SUCESSFUL", token, userId, isAdmin});
    }
};

