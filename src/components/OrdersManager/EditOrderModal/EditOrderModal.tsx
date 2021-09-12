import { Fragment, useCallback, useEffect } from "react";
import { Filter, PlusLg, SaveFill, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FormSelect } from "react-bootstrap";
import { useState } from "react";
import { getItems, getItemTemplates, Item, Order, OrderItem, searchItemNames } from "../../../api/centrostalApi";
import SearchInput from "../../UI/Input/SearchInput/SearchInput";
import ToggleButton from "../../UI/ToggleButton/ToggleButton";
import OrderItemList from "./OrderItemList/OrderItemList";
import { AddButton, CloseButton, SaveButton } from "../../UI/ImageButtons/ImageButtons";

export interface EditOrderModalProps{
  show: boolean;
  handleClose: ()=>void;
  handleSave: ()=>void;
  order: Order;
  type: 'creating'|'editing';
  handleAddOrderItem: (orderItem:OrderItem)=>void;
  handleChangeOrderItem: (orderItem:OrderItem)=>void;
  handleRemoveOrderItem: (orderItem:OrderItem)=>void;
}

const EditOrderModal = ({show, handleClose, handleSave, order, type,
                        handleAddOrderItem, handleChangeOrderItem, handleRemoveOrderItem}:EditOrderModalProps) => {
    
    const [itemNamePattern, setItemNamePattern] = useState("");
    const itemNamePatternChangedHandler = useCallback((text:string)=>{
        setItemNamePattern(text);
    }, []);
    const [itemNameSuggestions, setItemNameSuggestions] = useState([] as string[]);
    const [currents, setCurrents] = useState([] as string[]);
    const [steelTypes, setSteelTypes] = useState([] as string[]);
    const [current, setCurrent] = useState(null as string|null);    
    const [steelType, setSteelType] = useState(null as string|null);
    const [isOriginal, setOriginal] = useState(true as boolean);

    const [isItemNameValid, setItemNameValid] = useState(false);
    const [isCurrentValid, setCurrentValid] = useState(false);
    const [isSteelTypeValid, setSteelTypeValid] = useState(false);
    const [canAdd, setCanAdd] = useState(false);
    const [itemToAdd, setItemToAdd] = useState(null as Item|null);

    useEffect(()=>{
        const valid = current !== null && currents.includes(current);
        setCurrentValid(valid);
    }, [current, currents]);
    useEffect(()=>{
        const valid = steelType !== null && steelTypes.includes(steelType);
        setSteelTypeValid(valid);
    }, [steelType, steelTypes]);

    useEffect(()=>{
        const valid = isCurrentValid && isItemNameValid && isSteelTypeValid;
        setCanAdd(valid);
    }, [isCurrentValid, isItemNameValid, isSteelTypeValid]);

    useEffect(()=>{
        const fetchItemToAdd = async ()=>{
            if(canAdd){
                const items = await getItems({
                    current: parseInt(current as string),
                    isOriginal: isOriginal,
                    pattern: itemNamePattern,
                    steelType: steelType as string
                });
                if(items.length !== 1)  return;
                const item = items[0];
                setItemToAdd(item);
            }
            else{
                setItemToAdd(null);
            }
        };
        fetchItemToAdd();
    }, [canAdd, current, isOriginal, itemNamePattern, steelType]);

    useEffect(()=>{
        let isNewest = true;
        const updateSuggestions = async ()=>{
            if(show){
                const itemNames = await searchItemNames(itemNamePattern);
                if(!isNewest)
                    return;
                if(itemNames.length === 1 
                            && itemNames[0] === itemNamePattern){
                    setItemNameValid(true);
                    setItemNameSuggestions([]);
                }
                else{
                    setItemNameSuggestions(itemNames);
                    setItemNameValid(false);
                }
            }
        }
        updateSuggestions();
        return ()=>{
            isNewest = false;
        }
    }, [itemNamePattern, show]);
    useEffect(()=>{
        let isNewest = true;
        const updateItemTemplate = async ()=>{
            if(isItemNameValid){
                const itemTemplates = (await getItemTemplates(itemNamePattern));
                if(!isNewest || itemTemplates.length !== 1 || itemTemplates[0].name !== itemNamePattern)
                    return;
                const itemTemplate = itemTemplates[0];
                setItemNamePattern(itemTemplate.name);
                setCurrents(itemTemplate.currents.map(a=>a.toString()));
                setSteelTypes(itemTemplate.steelTypes);
            }
            else{
                setCurrents([]);
                setSteelTypes([]);
                setCurrent("");
                setSteelType("");
            }
        };
        updateItemTemplate();
        return ()=>{
            isNewest = false;
        }
    }, [itemNamePattern, isItemNameValid]);

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
        const newOrderItem = {
            amountDelta: 1,
            item:itemToAdd
        } as OrderItem;
        handleAddOrderItem(newOrderItem);
    }, [itemToAdd, handleAddOrderItem]);

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
                `${order.id} - edycja`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'self-start',
                        columnGap: 5
                    }}>
                <SearchInput placeholder="Wybierz nazwę towaru"
                            handleTextChange={itemNamePatternChangedHandler}
                            isValid={isItemNameValid}
                            text={itemNamePattern}
                            suggestions={itemNameSuggestions}
                            style={{
                                flexShrink: 0.3,
                                flexBasis: 400
                            }}
                            />
                <FormSelect isValid={isSteelTypeValid}
                            onChange={e=>setSteelType(e.currentTarget.value)}>
                    <option>Wybierz materiał</option>
                    {steelTypes.map(steelType=>(
                        <option value={steelType} key={steelType}>
                            {steelType}
                        </option>
                    ))}
                </FormSelect>

                <FormSelect isValid={isCurrentValid}
                            onChange={e=>setCurrent(e.currentTarget.value)}>
                    <option>Wybierz prąd</option>
                    {currents.map(current=>(
                        <option value={current} key={current}>
                            {current}A
                        </option>
                    ))}
                </FormSelect>
                <ToggleButton toggled={isOriginal}
                              changeToggle={(toggled)=> setOriginal(toggled)} 
                              textToggled="Oryginał"
                              textUntoggled="Zamiennik"
                              variantToggled="success"
                              variantUntoggled="warning"
                              />
                <AddButton onClick={addHandler}
                            disabled={!canAdd}
                            style={{
                                flexShrink: 0,
                                margin: "auto",
                                marginTop: 0
                            }} />
            </div>
            <div className="mt-4"></div>
            <OrderItemList handleChangeAmount={changeAmountHandler} 
                            handleDelete={deleteOrderItemHandler}
                            orderItems={order.orderItems} />
          </Modal.Body>
          <Modal.Footer>
            <CloseButton onClick={handleClose} />
            <SaveButton onClick={handleSave} />
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
}

export default EditOrderModal;