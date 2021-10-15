import { Fragment } from "react";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";
import { OrderItem } from "../../../api/centrostalApi";

export interface OrderItemListProps{
    orderItems:OrderItem[];
    shouldShowPrice:boolean;
    handleChangeAmount?: (orderItem:OrderItem, amount:number)=>void;
    handleChangePrice?: (orderItem:OrderItem, price:number)=>void;
    handleDelete?: (orderItem:OrderItem)=>void;
    isSupply: boolean;
    type: 'edit' | 'noedit';
}

const OrderItemList = ({orderItems,handleChangeAmount, handleDelete, handleChangePrice, type, isSupply, shouldShowPrice }:OrderItemListProps)=>{
    const totalPrice = orderItems.reduce((sum, x)=>sum+x.amountDelta*(x.priceOne ?? 0.0), 0.0);
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
                        {shouldShowPrice ? (
                            <th style={{width: 150}}>
                                Cena(1szt.)
                            </th>
                        ): null}
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
                                    </Fragment>
                                ): 
                                    <td style={{
                                        color: (isSupply ? '#25ba75' : '#dc3546'),
                                        fontWeight: 'bold'
                                    }}>{isSupply ? '+' : '-'}{orderItem.amountDelta}</td>
                                }
                                {shouldShowPrice ? (
                                    type==='edit' ? (
                                        <td>
                                            <InputGroup>
                                                <FormControl 
                                                    type="number" 
                                                    step="0.01"
                                                    value={orderItem.priceOne}
                                                    onChange={(e)=>handleChangePrice!(orderItem, parseFloat(e.currentTarget.value) || 0)}
                                                    />
                                                <InputGroup.Text>zł.</InputGroup.Text>
                                            </InputGroup>
                                        </td>
                                    ) :(
                                        <td>{orderItem.priceOne?.toFixed(2)} zł.</td>
                                    )
                                ): null}

                                {type==='edit' ?(
                                    <td>
                                        <Button variant="danger"
                                                onClick={()=>handleDelete!(orderItem)}>
                                            Usuń
                                        </Button>
                                    </td>
                                ):null}
                                    

                            </tr>
                    )})}
                </tbody>
            </Table>
            {shouldShowPrice ? (
                <h4 style={{
                    textAlign: 'right'
                }}>Łączna cena<h3>{totalPrice.toFixed(2)} zł.</h3></h4>
            ):null}
        </Fragment>
    );
};



export default OrderItemList;