import { Fragment } from "react";
import { Button, FormControl, Table } from "react-bootstrap";
import { OrderItem } from "../../../api/centrostalApi";

export interface OrderItemListProps{
    orderItems:OrderItem[];
    handleChangeAmount?: (orderItem:OrderItem, amount:number)=>void;
    handleDelete?: (orderItem:OrderItem)=>void;
    type: 'edit' | 'noedit';
}

const OrderItemList = ({orderItems,handleChangeAmount, handleDelete, type }:OrderItemListProps)=>{
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
                        <th>Na stanie</th>
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
                    {orderItems.map(orderItem=>(
                        <tr key={orderItem.item.id}>
                            <td>{orderItem.item.id}</td>
                            <td>{orderItem.item.name}</td>
                            <td>{orderItem.item.number}</td>
                            <td>{orderItem.item.isOriginal ? "Oryginał" : "Zamiennik"}</td>
                            <td>{orderItem.item.steelType}</td>
                            <td>{orderItem.item.current}A</td>
                            <td style={{
                                    color: (orderItem.item.amount + orderItem.amountDelta >= 0  ? '#25ba75' : '#dc3546'),
                                    fontWeight: 'bold'
                            }}>
                                {orderItem.item.amount}
                            </td>
                            {type === 'edit' ? (
                                <Fragment>
                                    <td>
                                        <FormControl type="number"
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
                                    color: (orderItem.amountDelta>=0 ? '#25ba75' : '#dc3546'),
                                    fontWeight: 'bold'
                                }}>{orderItem.amountDelta>0 ? '+' : ''}{orderItem.amountDelta}</td>
                            }
                        </tr>
                    ))}
                </tbody>
            </Table>
                  
        </Fragment>
    );
};



export default OrderItemList;