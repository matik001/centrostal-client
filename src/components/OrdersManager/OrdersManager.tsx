import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { cancelOrder, createOrder, changeOrderStatus, getDefaultStatus, getOrders, Order, OrderItem, orderToCreateOrder, updateOrder } from '../../api/centrostalApi';
import safeFetch from '../../helpers/safeFetch';
import { AddModalButton, RefreshModalButton } from '../UI/ImageButtons/ImageButtons';
import Spinner from '../UI/Spinner/Spinner';
import EditOrderModal from './EditOrderModal/EditOrderModal';
import OrdersList from './OrdersList/OrdersList';
import ViewOrderModal from './ViewOrderModal/ViewOrderModal';

export interface OrdersManagerProps{
    isSupply: boolean;
}

const OrdersManager = ({isSupply}:OrdersManagerProps)=>{

    const [orders, setOrders] = useState([] as Order[]);
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null as string|null);
    
    const createNewOrder = useCallback(()=>{
        return {
            id: 0,
            createdDate: new Date(),
            orderingPerson: "",
            status: getDefaultStatus(),
            orderItems: [],
            isSupply: isSupply
        } as Order;
    },[isSupply]);

    const [editingOrder, setEditingOrder] = useState(createNewOrder());
    const [editingType, setEditingType] = useState('creating' as 'editing' | 'creating');
    const [isEditing, setIsEditing] = useState(false);

    const [isViewingOrder, setIsViewingOrder] = useState(false);
    const [viewingOrder, setViewingOrder] = useState(null as Order|null);

    useEffect(()=>{
        setEditingOrder(createNewOrder());
    },[isSupply, createNewOrder]);

    const refreshOrders = useCallback(async ()=>{
        safeFetch(async ()=>{
            const newOrders = await getOrders(isSupply);
            setOrders(newOrders);
        }, setErrorMsg, setLoading);
    }, [isSupply]);

    
    useEffect(()=>{
        refreshOrders();
    },[refreshOrders]);

    const closeEditingHandler = useCallback(()=>{
        setIsEditing(false);
        if(editingType === 'editing')
            setEditingOrder(createNewOrder());
    }, [editingType, createNewOrder]);

    const startCreatingHandler = useCallback(()=>{
        setIsEditing(true);
        setEditingType('creating');
    }, []);
    const startEditingHandler = useCallback((order:Order)=>{
        setIsEditing(true);
        setEditingType('editing');
        setEditingOrder({
            ...order,
            orderItems: [...order.orderItems]
        });
    }, []);
    
    const saveEditingHandler = useCallback(async ()=>{
        setIsEditing(false);
        if(editingType === 'creating')
            await createOrder(orderToCreateOrder(editingOrder));
        else
            await updateOrder(editingOrder.id, orderToCreateOrder(editingOrder));
        
        await refreshOrders();
        setEditingOrder(createNewOrder());
    }, [editingOrder, editingType, refreshOrders, createNewOrder]);

    const cancelOrderEditingHandler = useCallback(async ()=>{
        await updateOrder(editingOrder.id, orderToCreateOrder(editingOrder));
        await cancelOrder(editingOrder.id);
        setIsEditing(false);
        await refreshOrders();
        setEditingOrder(createNewOrder());


    }, [editingOrder, refreshOrders, createNewOrder]);

    const changeStatusEditingHandler = useCallback(async ()=>{
        await updateOrder(editingOrder.id, orderToCreateOrder(editingOrder));
        await changeOrderStatus(editingOrder.id);
        setIsEditing(false);
        await refreshOrders();
        setEditingOrder(createNewOrder());

    }, [editingOrder, refreshOrders, createNewOrder]);


    const addOrderItemHandler = useCallback((orderItem:OrderItem)=>{
        setEditingOrder(order=>{
            var idx = order.orderItems.findIndex(a=>a.item.id === orderItem.item.id);
            if(idx === -1){
                return{
                    ...order,
                    orderItems: [
                        ...order.orderItems,
                        orderItem  
                    ]
                }
            }
            else{
                const oldOrderItem = order.orderItems[idx];
                const newOrderItem = {
                    ...oldOrderItem,
                    amountDelta: oldOrderItem.amountDelta + orderItem.amountDelta
                } 
                return{
                    ...order,
                    orderItems: order.orderItems.map((obj, i)=>{
                            if(i !== idx)
                                return obj;
                            else{
                                return newOrderItem;
                            }
                        })
                }
            }
        });
    }, []);
    const removeOrderItemHandler = useCallback((orderItem:OrderItem)=>{
        setEditingOrder(order=>({  ////// Todo sprwadzic czy juz istnieje
            ...order,
            orderItems: order.orderItems.filter(a=>a.item.id !== orderItem.item.id)
        }));
    }, []);
    
    const changeOrderItemHandler = useCallback((orderItem:OrderItem)=>{
        setEditingOrder(order=>({  ////// Todo sprwadzic czy juz istnieje
            ...order,
            orderItems: order.orderItems.map(a=>a.item.id !== orderItem.item.id ? a : orderItem)
        }));
    }, []);

    const showViewingOrderHandler = useCallback((order:Order)=>{
        setViewingOrder(order);
        setIsViewingOrder(true);
    }, []);
    const closeViewingOrderHandler = useCallback(()=>{
        setViewingOrder(null);
        setIsViewingOrder(false);
    }, []);
    return  (
        <div style={{
            width: "94%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "3%"
        }}>
             {isLoading ? <Spinner /> : (
                 <Fragment>
                     {errorMsg ? (
                         <Alert variant="danger">
                             {errorMsg}
                         </Alert>
                     ):(
                        <Fragment>
                            {isEditing ? (
                                <EditOrderModal show={isEditing} type={editingType} handleClose={closeEditingHandler}
                                    handleSave={saveEditingHandler} order={editingOrder} handleAddOrderItem={addOrderItemHandler}
                                    handleChangeOrderItem={changeOrderItemHandler} handleRemoveOrderItem={removeOrderItemHandler}
                                    handleCancel={cancelOrderEditingHandler} handleChangeStatus={changeStatusEditingHandler} 
                                    isSupply={isSupply}
                                     />
                            ) : null}
                            {isViewingOrder ? (
                                <ViewOrderModal handleClose={closeViewingOrderHandler}
                                                order={viewingOrder as Order}
                                                show={isViewingOrder} />
                            ): null}
                            <OrdersList orders={orders} 
                                        handleViewOrder={showViewingOrderHandler} 
                                        handleEditOrder={startEditingHandler} />

                            <AddModalButton onClick={startCreatingHandler} />
                        </Fragment>
                     )}
                        <RefreshModalButton onClick={refreshOrders} />
                 </Fragment>
             )}
        </div>
    );
};


export default OrdersManager;