import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Alert, FormControl, Table } from 'react-bootstrap';
import { createOrder, getDefaultStatus, getItems, Item, Order, OrderItem, orderToCreateOrder, updateItem} from '../../api/centrostalApi';
import safeFetch from '../../helpers/safeFetch';
import { useSelectorTyped } from '../../store/helperHooks';
import ItemsFilter, { AmountFilter } from '../ItemsFilter/ItemsFilter';
import EditOrderModal from '../OrdersManager/EditOrderModal/EditOrderModal';
import { GenerateOrderModalButton, RefreshModalButton } from '../UI/ImageButtons/ImageButtons';
import Spinner from '../UI/Spinner/Spinner';

export interface ItemsViewerProps{
}

const ItemsViewer = ({}:ItemsViewerProps)=>{
    const isAdmin = useSelectorTyped(state=>state.auth?.isAdmin);

    const [items, setItems] = useState([] as Item[]);
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null as string|null);

    const [itemNamePattern, setItemNamePattern] = useState("");
    const [current, setCurrent] = useState(null as string|null);    
    const [steelType, setSteelType] = useState(null as string|null);
    const [isOriginal, setOriginal] = useState(null as boolean|null);
    const [amountFilter, setAmountFilter] = useState(AmountFilter.positive);
    const [refresh, setRefresh] = useState(false);

    const createNewOrder = useCallback(()=>{
        const newOrder = {
            id: 0,
            createdDate: new Date(),
            orderingPerson: "",
            status: getDefaultStatus(),
            orderItems: [],
            isSupply: true
        } as Order;
        for(const item of items){
            const orderAmount = item.minStock - item.amount;
            if(orderAmount >= 1){
                newOrder.orderItems.push({
                    amountDelta: orderAmount,
                    item: item,
                });
            }
        }
        return newOrder;
    },[items]);

    const [order, setOrder] = useState(createNewOrder());
    const [isOrderOpen, setOrderOpen] = useState(false);

    const closeOrderHandler = useCallback(()=>{
        setOrderOpen(false);
    }, []);

    const openOrderHandler = useCallback(()=>{
        setOrder(createNewOrder());
        setOrderOpen(true);
    }, [createNewOrder]);
    const saveOrderHandler = useCallback(async ()=>{
        setOrderOpen(false);
        await createOrder(orderToCreateOrder(order));
        /// todo redirect to orders 
    }, [order]);


    const addOrderItemHandler = useCallback((orderItem:OrderItem)=>{
        setOrder(order=>{
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
        setOrder(order=>({  
            ...order,
            orderItems: order.orderItems.filter(a=>a.item.id !== orderItem.item.id)
        }));
    }, []);
    
    const changeOrderItemHandler = useCallback((orderItem:OrderItem)=>{
        setOrder(order=>({ 
            ...order,
            orderItems: order.orderItems.map(a=>a.item.id !== orderItem.item.id ? a : orderItem)
        }));
    }, []);


    const changeMinAmountHandler = useCallback((item:Item, newMinStock:number)=>{
        setItems(oldItems=>{
            const newItem = {...item,  minStock: newMinStock};
            updateItem(item.id, newItem);
            return oldItems.map(a=>a.id === item.id 
                    ? newItem
                    : a)
        });
    }, []);

    useEffect(()=>{
        let isNewest = true;
        
        safeFetch(async ()=>{
            let candidates = await getItems({
                current: parseInt(current as string) || undefined,
                isOriginal: isOriginal ?? undefined,
                pattern: itemNamePattern,
                steelType: steelType as string
            });
            if(candidates === null || candidates === undefined)
                candidates = [];

            switch (amountFilter) { /// Todo move it to server side, not to send too much data
                case AmountFilter.all:
                    break;
                case AmountFilter.positive:
                    candidates = candidates.filter(a=>a.amount !== 0 || a.minStock > 0);
                    break;
                // case AmountFilter.nonZero:
                //     candidates = candidates.filter(a=>a.amount !== 0)
                //     break;
                // case AmountFilter.negative:
                //     candidates = candidates.filter(a=>a.amount < 0)
                //     break;
                default:
                    break;
            }

            if(isNewest)
                setItems(candidates);
        }, setErrorMsg, setLoading)
        return ()=>{
            isNewest = false;
        }
    }, [itemNamePattern, current, steelType, isOriginal, amountFilter, refresh]);

    const refreshItemTemplates = useCallback(async ()=>{
        setRefresh(old=>!old);
    }, []);

    
    return  (
        <div style={{
            width: "94%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "3%"
        }}>
            {isOrderOpen ? (
                <EditOrderModal show={isOrderOpen} type='creating' handleClose={closeOrderHandler}
                    handleSave={saveOrderHandler} order={order} handleAddOrderItem={addOrderItemHandler}
                    handleChangeOrderItem={changeOrderItemHandler} handleRemoveOrderItem={removeOrderItemHandler}
                    isSupply={true} />
            ) : null}
            <ItemsFilter current={current}
                handleCurrentChange={setCurrent}
                steelType={steelType}
                handleSteelChange={setSteelType}
                namePattern={itemNamePattern}
                handleNamePatternChange={setItemNamePattern}
                isOriginal={isOriginal}
                handleIsOriginalChange={setOriginal}
                amountFilter={amountFilter}
                handleAmountFilterChange={setAmountFilter}
                itemCandidates={items}
            />
            {isLoading ? <Spinner /> : (
                <div>
                    {errorMsg ? (
                        <Alert variant="danger">
                            {errorMsg}
                        </Alert>
                    ) : (
                        <Fragment>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Nazwa</th>
                                        <th>Numer</th>
                                        <th>Rodzaj stali</th>
                                        <th>Prąd</th>
                                        <th>Jakość</th>
                                        <th style={{width: 100}}>
                                            Minimalnie</th>
                                        <th>Na stanie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item=>{
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.number}</td>
                                                <td>{item.steelType}</td>
                                                <td>{item.current}A</td>
                                                <td>{item.isOriginal ? "Oryginał" : "Zamiennik"}</td>
                                                <td>
                                                    {isAdmin ? 
                                                        <FormControl type="number" 
                                                                    min={0}
                                                                    value={item.minStock.toString()} 
                                                                    onChange={(e)=>changeMinAmountHandler(item, parseInt(e.currentTarget.value) || 0)} />
                                                        :
                                                        item.minStock
                                                    }
                                                </td>
                                                <td style={{
                                                            color: item.amount < item.minStock ? '#dc3546' : '#06bd68',
                                                            fontWeight: 'bold'
                                                        }}>
                                                    {item.amount}
                                                </td>
                                            </tr>
                                        )
                                        
                                    })}
                                </tbody>
                            </Table>
                        </Fragment>
                    )}
                    <GenerateOrderModalButton onClick={openOrderHandler} style={{bottom: 30}} />
                    <RefreshModalButton onClick={refreshItemTemplates} />
                </div>
            )}
        </div>
    );
};


export default ItemsViewer;