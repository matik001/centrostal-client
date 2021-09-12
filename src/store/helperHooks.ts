import { useDispatch, useSelector } from "react-redux";
import { ApplicationState, ApplicationThunkAction } from ".";
import { Dispatch } from 'react';

export const useSelectorTyped = (selector: (state:ApplicationState)=>any)=> useSelector(selector);
export const useDispatchTyped = () => useDispatch() as Dispatch<ApplicationThunkAction>;  
