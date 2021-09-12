import React, { Fragment } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Order } from '../../../api/centrostalApi';
import { EditButton, ShowButton } from '../../UI/ImageButtons/ImageButtons';

export interface OrdersListProps{
    orders: Order[];
    handleViewOrder: (order:Order)=>void;
    handleEditOrder: (order:Order)=>void;
}

const OrdersList = ({orders, handleViewOrder, handleEditOrder}:OrdersListProps)=>{

    return  (
        <Fragment>
                <div>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Data zlecenia</th>
                                <th>Data ostatniej edycji</th>
                                <th>Data wykonania</th>
                                <th>Zlecający</th>
                                <th>Status</th>
                                <th>Podgląd</th>
                                <th>Edytuj</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order=>(
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.createdDate.toLocaleString()}</td>
                                    <td>{order.lastEditedDate?.toLocaleString()}</td>
                                    <td>{order.executedDate?.toLocaleString()}</td>
                                    <td>{order.orderingPerson}</td>
                                    <td style={{
                                        fontWeight: 'bold',
                                        color: order.status==='zlecone' ? '#ffc107'
                                            :  order.status==='zrealizowane' ? '#198754'
                                            :  '#dc3546'
                                    }}>{order.status}</td>
                                    <td>
                                        <ShowButton onClick={()=>handleViewOrder(order)} />
                                    </td>
                                    <td>
                                        {order.status==='zlecone' ? <EditButton onClick={()=>handleEditOrder(order)} /> : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
        </Fragment>
    );
};


export default OrdersList;