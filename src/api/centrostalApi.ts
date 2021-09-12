import axios from 'axios'
import * as localStorageManager from '../store/localStorageManager'

const BASE_URL = 'https://localhost:44322';

const centrostalApiAxios = axios.create({
    baseURL: BASE_URL,
    timeout: 3000,
})
const authConfig = {
    headers: {  },
}
export const updateAuthConfig = (token:string|null)=>{

    authConfig.headers = {
        Authorization: `Bearer ${token}`
    }
}
updateAuthConfig(localStorageManager.getStr(localStorageManager.LocalStorageItemName.TOKEN));


export interface LoginResponseData{
    userId:string;
    firstname: string;
    lastname:string;
    username:string;
    token:string;
    expirationTime:Date;
    isAdmin:boolean;
}
export const login = async (email:string, password:string)=>{
    const data =  (await centrostalApiAxios.post("/login", {
            username: email,
            password: password
        })).data;
    data.expirationTime = new Date(data.expirationTime);
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


export interface ItemTemplate{
    id:number;
    name: string;
    number:number;
    currents:number[];
    steelTypes:string[];
}
export interface UpdateItemTemplate{
    name: string;
    number:number;
    currents:number[];
    steelTypes:string[];
}
export const getItemTemplates = async (pattern:string = "")=>{    
    const res = (await centrostalApiAxios.get("/item/template", {
        ...authConfig,
        params: {
            pattern: pattern
        }
    })).data;
    
    return res as ItemTemplate[];
}
export const createItemTemplate = async (data:UpdateItemTemplate)=>{
    const res = (await centrostalApiAxios.post("/item/template", data, authConfig)).data;
    return res;
}
export const getItemTemplate = async (id:number)=>{
    const res = (await centrostalApiAxios.get(`/item/template/${id}`, authConfig)).data;

    return res as ItemTemplate;
}

export const updateItemTemplate = async (id:number, itemTemplate:UpdateItemTemplate)=>{
    await centrostalApiAxios.put(`/item/template/${id}`, itemTemplate, authConfig);
}

export const deleteItemTemplate = async (id:number)=>{
    await centrostalApiAxios.delete(`/item/template/${id}`, authConfig);
}


export const getSteelTypes = async ()=>{    
    const res = (await centrostalApiAxios.get("/steel", authConfig)).data;

    return res as string[];
}



export interface Item{
    id:number;
    name: string;
    number:number;
    amount:number;
    current:number;
    isOriginal:boolean;
    steelType:string;
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
        ...authConfig,
        params: filters
    })).data;
    return res as Item[];
}


export interface OrderItem{
    amountDelta: number;
    item: Item;
}
export interface Order{
    id:number;
    createdDate: Date;
    lastEditedDate?: Date;
    executedDate?: Date;
    status:"zlecone"|"zrealizowane"|"anulowane";
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
export const getOrders = async ()=>{    
    const res = (await centrostalApiAxios.get("/order", authConfig)).data;
    const orders = res.map((x:any)=>orderDtoToOrder(x));
        return orders as Order[];
}


export interface CreateOrderItem{
    amountDelta: number;
    itemId: number;
}
export interface CreateOrder{
    orderItems: CreateOrderItem[];
}

export const orderToCreateOrder = (order:Order)=>{
    return {
        ...order,
        orderItems: order.orderItems.map(x=>({
            amountDelta: x.amountDelta,
            itemId: x.item.id
        }))
    } as CreateOrder;
}

export const createOrder = async (createOrder:CreateOrder)=>{    
    const res = (await centrostalApiAxios.post("/order", createOrder, authConfig)).data;
    return res;
}

export const updateOrder = async (id:number, order:CreateOrder)=>{
    await centrostalApiAxios.put(`/order/${id}`, order, authConfig);
}

export const searchItemNames = async (pattern:string)=>{
    const res = (await centrostalApiAxios.get("/item/names", {
        ...authConfig,
        params: {
            pattern: pattern
        }
    })).data;
    return res;
}