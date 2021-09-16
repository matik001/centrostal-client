export enum LocalStorageItemName {
    TOKEN = 'TOKEN',
    USER_ID = "USER_ID",
    EXPIRATION_TIME = "EXPIRATION_TIME",
    IS_ADMIN = "IS_ADMIN"
}

export const getStr = (key:LocalStorageItemName) => localStorage.getItem(key);
export const setStr = (key:LocalStorageItemName, value:string)=>localStorage.setItem(key, value);

export const getDate = (key:LocalStorageItemName) => {
    if(key == null)
        return null;
    const val = localStorage.getItem(key);
    if(val == null)
        return null;
    return new Date(parseInt(val));
}

export const setDate = (key:LocalStorageItemName, value:Date)=>{
    if(value == null)
        localStorage.setItem(key, value);
    else{
        localStorage.setItem(key, value.getTime().toString())
    }
}

export const getBoolean = (key:LocalStorageItemName) => {
    if(key == null)
        return null;
    const item = localStorage.getItem(key)
    if(item === null)
        return null
    return item === '1';
}

export const setBoolean = (key:LocalStorageItemName, value:boolean)=>{
    if(value == null)
        localStorage.setItem(key, value);
    else{
        localStorage.setItem(key, value ? '1' : '0')
    }
}


export const clearAll = ()=>localStorage.clear();

