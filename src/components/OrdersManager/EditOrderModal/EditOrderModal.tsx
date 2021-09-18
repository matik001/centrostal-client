import { Fragment, useCallback, useEffect, useRef } from "react";
import { Toggles, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Alert, Overlay, Popover } from "react-bootstrap";
import { useState } from "react";
import { getItems, Item, Order, OrderItem } from "../../../api/centrostalApi";
import OrderItemList from "../OrderItemList/OrderItemList";
import { AddButton, CloseButton, SaveButton } from "../../UI/ImageButtons/ImageButtons";
import Spinner from "../../UI/Spinner/Spinner";
import safeFetch from "../../../helpers/safeFetch";
import ItemsFilter from "../../ItemsFilter/ItemsFilter";

export interface EditOrderModalProps{
  show: boolean;
  handleClose: ()=>void;
  handleSave: ()=>void;
  handleCancel: ()=>void;
  handleFinish: ()=>void;
  order: Order;
  type: 'creating'|'editing';
  handleAddOrderItem: (orderItem:OrderItem)=>void;
  handleChangeOrderItem: (orderItem:OrderItem)=>void;
  handleRemoveOrderItem: (orderItem:OrderItem)=>void;
}

const EditOrderModal = ({show, handleClose, handleSave, order, type,
                        handleAddOrderItem, handleChangeOrderItem, handleRemoveOrderItem,
                        handleCancel, handleFinish}:EditOrderModalProps) => {
    
    const [itemNamePattern, setItemNamePattern] = useState("");
    const [current, setCurrent] = useState(null as string|null);    
    const [steelType, setSteelType] = useState(null as string|null);
    const [isOriginal, setOriginal] = useState(null as boolean|null);

    const [itemCandidates, setItemCandidates] = useState([] as Item[]);
    const [canAdd, setCanAdd] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null as string|null);

    const addBtnRef = useRef(null);

    useEffect(()=>{
        let isNewest = true;
        
        safeFetch(async ()=>{
            const candidates = await getItems({
                current: parseInt(current as string) || undefined,
                isOriginal: isOriginal ?? undefined,
                pattern: itemNamePattern,
                steelType: steelType as string
            });
            if(isNewest)
                setItemCandidates(candidates);
        }, setErrorMsg, setLoading)
        return ()=>{
            isNewest = false;
        }
    }, [itemNamePattern, current, steelType, isOriginal]);

    const changeAmountHandler = useCallback((orderItem: OrderItem, amount: number)=>{
        const changedOrderItem = {
            ...orderItem,
            amountDelta: amount
        } as OrderItem;
        handleChangeOrderItem(changedOrderItem);
    }, [handleChangeOrderItem]);
    const deleteOrderItemHandler = useCallback((orderItem: OrderItem) => {
        handleRemoveOrderItem(orderItem);
    }, [handleRemoveOrderItem]);

    const addHandler = useCallback(()=>{
        const exactNameItems = itemCandidates.filter(a=>a.name.toLowerCase() === itemNamePattern.toLowerCase());
        const itemToAdd = exactNameItems[0] ?? itemCandidates[0];
        const newOrderItem = {
            amountDelta: 1,
            item:itemToAdd
        } as OrderItem;
        handleAddOrderItem(newOrderItem);
        setItemNamePattern('');
        setSteelType(null);
        setCurrent(null);
        setOriginal(null);
    }, [itemCandidates, handleAddOrderItem, itemNamePattern]);

    return ( 
      <Fragment>
        <Modal show={show} 
               onHide={handleClose} 
               size="xl">
               
          <Modal.Header>
            <Modal.Title>{
                type === 'creating' ? 
                'Tworzenie nowego zamówienia' 
                :
                `Edycja zamówienia nr ${order.id}`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMsg ? (
                <Alert variant="danger">
                    {errorMsg}
                </Alert>
            ) : null}
            <div className="mb-3" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent:'space-between',
                        columnGap: 5
                    }}>
                <div style={{
                    flexGrow: 1
                }}>
                    <ItemsFilter current={current}
                                handleCurrentChange={setCurrent}
                                steelType={steelType}
                                handleSteelChange={setSteelType}
                                namePattern={itemNamePattern}
                                handleNamePatternChange={setItemNamePattern}
                                isOriginal={isOriginal}
                                handleIsOriginalChange={setOriginal}
                                isEverythingChoosen={canAdd}
                                handleIsEverythingChoosenChange={setCanAdd}
                                itemCandidates={itemCandidates}
                    />
                </div>
                <AddButton onClick={addHandler}
                            disabled={!canAdd}
                            style={{
                                alignSelf: 'start',
                                flexShrink: 0
                            }} 
                            ref={addBtnRef} />
                <Overlay target={addBtnRef.current} show={canAdd} placement="bottom-end" >
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                    <Popover {...props} placement={placement}>
                        Na stanie: {itemCandidates[0] && itemCandidates[0].amount}
                    </Popover>
                    )}
                </Overlay>
            </div>
            <div className="mt-4"></div>
            <OrderItemList handleChangeAmount={changeAmountHandler} 
                            handleDelete={deleteOrderItemHandler}
                            orderItems={order.orderItems} type='edit' />

            {isLoading ? <Spinner /> : null}
          </Modal.Body>
          <Modal.Footer>
            {type === 'editing' ? (
                <Fragment>
                    <Button variant="danger" onClick={handleCancel}>
                        <Trash style={{
                                    marginRight: 6
                                }}/>
                        Anuluj zamówienie
                    </Button>
                    <Button variant='warning' onClick={handleFinish}>
                        <Toggles style={{
                                marginRight: 6
                            }}/>
                        Oznacz jako zrealizowane
                    </Button>
                </Fragment>
            ):null}
            <SaveButton onClick={handleSave}>{type==='editing' ? 'Aktualizuj' : "Zapisz"}</SaveButton>
            <CloseButton onClick={handleClose} />
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
}

export default EditOrderModal;