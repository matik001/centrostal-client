import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { getItems, Item} from '../../api/centrostalApi';
import safeFetch from '../../helpers/safeFetch';
import ItemsFilter, { AmountFilter } from '../ItemsFilter/ItemsFilter';
import { RefreshModalButton } from '../UI/ImageButtons/ImageButtons';
import Spinner from '../UI/Spinner/Spinner';

export interface ItemsViewerProps{
}

const ItemsViewer = ({}:ItemsViewerProps)=>{

    const [items, setItems] = useState([] as Item[]);
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null as string|null);

    const [itemNamePattern, setItemNamePattern] = useState("");
    const [current, setCurrent] = useState(null as string|null);    
    const [steelType, setSteelType] = useState(null as string|null);
    const [isOriginal, setOriginal] = useState(null as boolean|null);
    const [amountFilter, setAmountFilter] = useState(AmountFilter.nonZero);
    const [refresh, setRefresh] = useState(false);

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
                case AmountFilter.nonZero:
                    candidates = candidates.filter(a=>a.amount !== 0)
                    break;
                case AmountFilter.negative:
                    candidates = candidates.filter(a=>a.amount < 0)
                    break;
                case AmountFilter.positive:
                    candidates = candidates.filter(a=>a.amount > 0)
                    break;
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
                                        <th>Ilość</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item=>(
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.number}</td>
                                            <td>{item.steelType}</td>
                                            <td>{item.current}A</td>
                                            <td>{item.isOriginal ? "Oryginał" : "Zamiennik"}</td>
                                            <td>{item.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Fragment>
                    )}
                    <RefreshModalButton onClick={refreshItemTemplates} style={{bottom: 30}} />
                </div>
            )}
        </div>
    );
};


export default ItemsViewer;