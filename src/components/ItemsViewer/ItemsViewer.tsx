import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { ArrowRepeat } from 'react-bootstrap-icons';
import { getItems, Item} from '../../api/centrostalApi';
import safeFetch from '../../helpers/safeFetch';
import { RefreshModalButton } from '../UI/ImageButtons/ImageButtons';
import Spinner from '../UI/Spinner/Spinner';
import SquareButton from '../UI/SquareButton/SquareButton';

export interface ItemsViewerProps{
}

const ItemsViewer = ({}:ItemsViewerProps)=>{

    const [items, setItems] = useState([] as Item[]);
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null as string|null);


    const refreshItemTemplates = useCallback(async ()=>{
        safeFetch(async ()=>{
            const newItem = await getItems();
            setItems(newItem);
        }, setErrorMsg, setLoading);
    }, []);

    
    useEffect(()=>{
        refreshItemTemplates();
    },[refreshItemTemplates]);
    return  (
        <Fragment>
            {isLoading ? <Spinner /> : (
                <div style={{
                    width: "94%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "3%"
                }}>
                    {errorMsg ? (
                        <Alert variant="danger">
                            {errorMsg}
                        </Alert>
                    ) : (
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
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item=>(
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.number}</td>
                                        <td>{item.isOriginal ? "Oryginał" : "Zamiennik"}</td>
                                        <td>{item.steelType}</td>
                                        <td>{item.current}A</td>
                                        <td>{item.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    <RefreshModalButton onClick={refreshItemTemplates} style={{bottom: 30}} />
                </div>
            )}
        </Fragment>
    );
};


export default ItemsViewer;