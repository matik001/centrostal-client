import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { AuthActions } from "../../store/authActions";
import { useDispatchTyped } from "../../store/helperHooks";

const Logout = (props:any)=>{
    const dispatch = useDispatchTyped();
    useEffect(()=>{
        dispatch(AuthActions.logout());
    }, [dispatch])
    return <Redirect to="/" />
}

export default Logout;