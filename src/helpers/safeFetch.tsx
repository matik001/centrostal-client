import { AxiosError } from "axios";

const safeFetch = async <T extends unknown>(  func: ()=>Promise<T>,
                    setErrorMsg: (error:string|null)=>void,
                    setLoading: (loading:boolean)=>void
                    )=>{
                        
    setLoading(true);
    setErrorMsg(null);

    let res:T|null = null;
    try {
        res = await func();
    } catch (err) {
        const error = err as AxiosError;
        const data = error?.response?.data;
        const errorFromServer = data && data.errors && Object.values(data.errors).join("\n");
        setErrorMsg(errorFromServer || error.message);
    }
    // if(isNewest == null || isNewest)
    setLoading(false);
    return res;
}

export default safeFetch;