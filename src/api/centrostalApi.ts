import axios from 'axios'
import combinedStore from '../store';
import * as localStorageManager from '../store/localStorageManager'

const BASE_URL = process.env.REACT_APP_API_PATH;

const centrostalApiAxios = axios.create({
    baseURL: BASE_URL,
    timeout: 5000
})
centrostalApiAxios.interceptors.response.use(response => {
    return response;
 }, error => {
   if (error?.response?.status === 401) {
    combinedStore.dispatch({
        type: 'AUTH_LOGOUT'
    });
   }
   throw error;
 });

const getAuthConfig = ()=>{
    const config = {
        headers: {
            Authorization: `Bearer ${localStorageManager.getStr(localStorageManager.LocalStorageItemName.TOKEN)}`
        }
    };
    return config;
}


export enum Roles{
    ADMIN='admin',
    BLOCKED='blocked',
    CHAIRMAN='chairman'
}
export interface LoginResponseData{
    userId:string;
    firstname: string;
    lastname:string;
    username:string;
    token:string;
    expirationTime:Date;
    roles:string[];
}
export const login = async (email:string, password:string)=>{
    const data =  (await centrostalApiAxios.post("/login", {
            username: email,
            password: password
        })).data;
    if(data)
        data.expirationTime = new Date(data?.expirationTime);
    return data as LoginResponseData;
};

export interface RegistrationData{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
}

export const register = async (data:RegistrationData)=>{
    const res = (await centrostalApiAxios.post("/register", data)).data;

    res.expirationTime = new Date(res.expirationTime);
    return res as LoginResponseData;
};

export const getSteelTypes = async ()=>{    
    const res = (await centrostalApiAxios.get("/steel", getAuthConfig())).data;

    return res as string[];
}


export interface CreateItem{
    id:number;
    name: string;
    number:number;
    amount:number;
    current:number;
    isOriginal:boolean;
    steelType:string;
    minStock:number;
}
export interface Item extends CreateItem{
    id:number;
}
export interface GetItemsFilter{
    pattern?:string;
    steelType?:string;
    number?:number;
    current?:number;
    isOriginal?:boolean;
}
export const getItems = async (filters?:GetItemsFilter)=>{    
    filters = filters || {
        pattern: undefined,
        current: undefined,
        isOriginal: undefined,
        number: undefined,
        steelType: undefined
    };
    const res = (await centrostalApiAxios.get("/item", {
        ...getAuthConfig(),
        params: filters
    })).data;
    return res as Item[];
}
export const getItem = async (id:number)=>{    
    const res = (await centrostalApiAxios.get(`/item/${id}`, {
        ...getAuthConfig()
    })).data;
    return res as Item;
}
export const createItem = async (item:CreateItem)=>{    
    const res = (await centrostalApiAxios.post(`/item`, item, {
        ...getAuthConfig()
    })).data;
    return res as Item;
}
export const updateItem = async (id:number, item:CreateItem)=>{    
    const res = (await centrostalApiAxios.put(`/item/${id}`, item, {
        ...getAuthConfig()
    })).data;
    return res as Item;
}



export interface OrderItem{
    amountDelta: number;
    item: Item;
    priceOne?:number;
}

type StatusName = "edytowalne"|"wydane"|"anulowane"|"zrealizowane"
|"utworzone"|"zapytane"|"nie zatwierdzone"
|"zatwierdzone"|"zam??wione";

export interface OrderStatus{
    name:StatusName;

    canAnyoneEdit: boolean;
    canAdminEdit: boolean;
    canChairmanEdit: boolean;

    canAnyoneCancel: boolean;
    canAdminCancel: boolean;
    canChairmanCancel: boolean;

    canAnyoneChangeStatus: boolean;
    canAdminChangeStatus: boolean;
    canChairmanChangeStatus: boolean;
    shouldShowPrice:boolean;

    color:string;
    nextStatusMsg?: string;
}

export const getDefaultStatus = ()=> ({
    name:"edytowalne",

    canAnyoneEdit: false,
    canAdminEdit: false,
    canChairmanEdit: false,

    canAnyoneCancel: false,
    canAdminCancel: false,
    canChairmanCancel: false,

    canAnyoneChangeStatus: false,
    canAdminChangeStatus: false,
    canChairmanChangeStatus: false,

    color:"#ff0000",

    nextStatusMsg: "Przeka?? dalej"
} as OrderStatus);  

export interface Order{
    id:number;
    createdDate: Date;
    lastEditedDate?: Date;
    executedDate?: Date;
    status:OrderStatus;
    isSupply: boolean;
    orderingPerson:string;
    orderItems:OrderItem[];
}
const orderDtoToOrder = (elem:any)=>{
    elem.createdDate = new Date(elem.createdDate);
    if(elem.lastEditedDate)
        elem.lastEditedDate = new Date(elem.lastEditedDate);
    if(elem.executedDate)
        elem.executedDate = new Date(elem.executedDate);
    return elem as Order;
};
export const getOrders = async (isSupply?:boolean)=>{    
    const res = (await centrostalApiAxios.get("/order", {
        ...getAuthConfig(),
        params: {
            isSupply: isSupply
        }
    })).data;
    const orders = res.map((x:any)=>orderDtoToOrder(x));
        return orders as Order[];
}


export interface CreateOrderItem{
    amountDelta: number;
    itemId: number;
    priceOne?:number;
}
export interface CreateOrder{
    isSupply: boolean;
    orderItems: CreateOrderItem[];
}

export const orderToCreateOrder = (order:Order)=>{
    return {
        ...order,
        orderItems: order.orderItems.map(x=>({
            amountDelta: x.amountDelta,
            itemId: x.item.id,
            priceOne: x.priceOne
        }))
    } as CreateOrder;
}

export const createOrder = async (createOrder:CreateOrder)=>{
    const res = (await centrostalApiAxios.post("/order", createOrder, getAuthConfig())).data;
    return res;
}

export const updateOrder = async (id:number, order:CreateOrder)=>{
    await centrostalApiAxios.put(`/order/${id}`, order, getAuthConfig());
}

export const changeOrderStatus = async (id:number)=>{
    await centrostalApiAxios.patch(`/order/${id}/next_status`, null, getAuthConfig());
}

export const cancelOrder = async (id:number)=>{
    await centrostalApiAxios.patch(`/order/${id}/cancel`, null, getAuthConfig());
}

export const searchItemNames = async (pattern:string)=>{
    const res = (await centrostalApiAxios.get("/item/names", {
        ...getAuthConfig(),
        params: {
            pattern: pattern
        }
    })).data;
    return res;
}