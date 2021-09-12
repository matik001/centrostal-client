import { Fragment } from "react";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";
import { OrderItem } from "../../../../api/centrostalApi";

export interface OrderItemListProps{
    orderItems:OrderItem[];
    handleChangeAmount: (orderItem:OrderItem, amount:number)=>void;
    handleDelete: (orderItem:OrderItem)=>void;
}

const OrderItemList = ({orderItems,handleChangeAmount, handleDelete }:OrderItemListProps)=>{
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
                        <th>Ilość</th>
                        <th style={{
                            width: 100}}>
                                Zmiana
                        </th>
                        <th>Akcja</th>
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
                            <td>{orderItem.item.amount}</td>
                            <td>
                                <FormControl type="number"
                                            value={orderItem.amountDelta.toString()} 
                                            onChange={(e)=>handleChangeAmount(orderItem, parseInt(e.currentTarget.value) || 0)} />
                            </td>
                            <td>
                                <Button variant="danger"
                                        onClick={()=>handleDelete(orderItem)}>
                                    Usuń
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
                  
        </Fragment>
    );
};



export default OrderItemList;