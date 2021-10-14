import { Fragment } from "react";
import { Button, FormControl, Table } from "react-bootstrap";
import { OrderItem } from "../../../api/centrostalApi";

export interface OrderItemListProps{
    orderItems:OrderItem[];
    handleChangeAmount?: (orderItem:OrderItem, amount:number)=>void;
    handleDelete?: (orderItem:OrderItem)=>void;
    isSupply: boolean;
    type: 'edit' | 'noedit';
}

const OrderItemList = ({orderItems,handleChangeAmount, handleDelete, type, isSupply }:OrderItemListProps)=>{
    return  (
        <Fragment>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nazwa</th>
                        <th>Numer</th>
                        <th>Oryginał</th>
                        <th>Rodzaj stali</th>
                        <th>Prąd</th>
                        <th>Minimalnie</th>
                        {type==='edit' ? (
                            <th>Na stanie</th>
                        ):null}
                        <th style={{
                            width: 100}}>
                                Zmiana
                        </th>
                        {type==='edit' ? (
                            <th>Akcja</th>
                        ) : null}
                    </tr>
                </thead>
                <tbody>
                    {orderItems.map(orderItem=>{
                        const newAmount = orderItem.item.amount + (isSupply ? orderItem.amountDelta : -orderItem.amountDelta);
                        return (
                            <tr key={orderItem.item.id}>
                                <td>{orderItem.item.id}</td>
                                <td>{orderItem.item.name}</td>
                                <td>{orderItem.item.number}</td>
                                <td>{orderItem.item.isOriginal ? "Oryginał" : "Zamiennik"}</td>
                                <td>{orderItem.item.steelType}</td>
                                <td>{orderItem.item.current}A</td>
                                <td>{orderItem.item.minStock}</td>
                                {type === 'edit' ? (
                                    <Fragment>
                                        
                                        <td style={{
                                                color: (isSupply ? (newAmount >= orderItem.item.minStock ? '#25ba75' : '#dc3546') 
                                                                 : (newAmount >= 0 ? '#25ba75' : '#dc3546')),
                                                fontWeight: 'bold'
                                        }}>
                                            {orderItem.item.amount} ({isSupply ? '+' : '-'}{orderItem.amountDelta})
                                        </td>
                                        <td>
                                            <FormControl type="number" min={1}
                                                        value={orderItem.amountDelta.toString()} 
                                                        onChange={(e)=>handleChangeAmount!(orderItem, parseInt(e.currentTarget.value) || 0)} />
                                        </td>
                                        <td>
                                            <Button variant="danger"
                                                    onClick={()=>handleDelete!(orderItem)}>
                                                Usuń
                                            </Button>
                                        </td>
                                    </Fragment>
                                ): 
                                    <td style={{
                                        color: (isSupply ? '#25ba75' : '#dc3546'),
                                        fontWeight: 'bold'
                                    }}>{isSupply ? '+' : '-'}{orderItem.amountDelta}</td>
                                }
                            </tr>
                    )})}
                </tbody>
            </Table>
                  
        </Fragment>
    );
};



export default OrderItemList;