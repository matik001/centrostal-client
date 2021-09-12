import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { ArrowRepeat, PlusLg } from 'react-bootstrap-icons';
import { createOrder, getOrders, Order, OrderItem, orderToCreateOrder, updateOrder } from '../../api/centrostalApi';
import safeFetch from '../../helpers/safeFetch';
import { AddModalButton, RefreshModalButton } from '../UI/ImageButtons/ImageButtons';
import Spinner from '../UI/Spinner/Spinner';
import SquareButton from '../UI/SquareButton/SquareButton';
import EditOrderModal from './EditOrderModal/EditOrderModal';
import OrdersList from './OrdersList/OrdersList';

export interface OrdersManagerProps{
}

const OrdersManager = ({}:OrdersManagerProps)=>{

    const [orders, setOrders] = useState([] as Order[]);
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null as string|null);
    
    const createNewOrder = ()=>{
        return {
            id: 0,
            createdDate: new Date(),
            orderingPerson: "",
            status: "zlecone",
            orderItems: []
        } as Order;
    }
    const [editingOrder, setEditingOrder] = useState(createNewOrder());
    const [editingType, setEditingType] = useState('creating' as 'editing' | 'creating');
    const [isEditing, setIsEditing] = useState(false);

    const [isViewingOrder, setIsViewingOrder] = useState(false);
    const [viewingOrder, setViewingOrder] = useState(null as Order|null);

    const refreshOrders = useCallback(async ()=>{
        safeFetch(async ()=>{
            const newOrders = await getOrders();
            setOrders(newOrders);
        }, setErrorMsg, setLoading);
    }, []);

    
    useEffect(()=>{
        refreshOrders();
    },[refreshOrders]);

    const closeEditingHandler = useCallback(()=>{
        setIsEditing(false);
        if(editingType === 'editing')
            setEditingOrder(createNewOrder());
    }, [editingType]);

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
        if(editingType === 'creating'){
            await createOrder(orderToCreateOrder(editingOrder));
            await refreshOrders();
        }
        else{
            await updateOrder(editingOrder.id, orderToCreateOrder(editingOrder));
            await refreshOrders();
        }
        setEditingOrder(createNewOrder());
    }, [editingOrder, editingType, refreshOrders]);

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
    const hideViewingOrderHandler = useCallback(()=>{
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
                                     />
                            ) : null}
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