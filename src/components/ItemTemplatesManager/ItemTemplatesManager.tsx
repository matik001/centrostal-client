import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { ArrowRepeat, PlusLg } from 'react-bootstrap-icons';
import { createItemTemplate, getItemTemplates, getSteelTypes, ItemTemplate, updateItemTemplate } from '../../api/centrostalApi';
import safeFetch from '../../helpers/safeFetch';
import { AddModalButton, RefreshModalButton } from '../UI/ImageButtons/ImageButtons';
import Spinner from '../UI/Spinner/Spinner';
import SquareButton from '../UI/SquareButton/SquareButton';
import EditItemTemplateModal from './EditItemTemplateModal/EditItemTemplateModal';
import ItemTemplatesList from './ItemTemplatesList/ItemTemplatesList';

export interface ItemTemplatesManagerProps{
}

const ItemTemplatesManager = ({}:ItemTemplatesManagerProps)=>{

    const [itemTemplates, setItemTemplates] = useState([] as ItemTemplate[]);
    const [isLoading, setLoading] = useState(false);

    const createNewEditingItem = ()=>{
        return {
            id:0,
            name: "Nowa nazwa towaru",
            number: 0,
            currents: [],
            steelTypes: []
        } as ItemTemplate;
    }
    const [editingItem, setEditingItem] = useState(createNewEditingItem());
    const [editingType, setEditingType] = useState('creating' as 'editing' | 'creating');
    const [isEditing, setIsEditing] = useState(false);

    const [steelTypes, setSteelTypes] = useState([] as string[]);

    const [errorMsg, setErrorMsg] = useState(null as string|null);

    const refreshItemTemplates = useCallback(async ()=>{
        await safeFetch(async ()=>{
            const newItemTemplates = await getItemTemplates();
            const newSteelTypes = await getSteelTypes();
            setItemTemplates(newItemTemplates);
            setSteelTypes(newSteelTypes);
        }, setErrorMsg, setLoading);
    }, []);

    
    useEffect(()=>{
        refreshItemTemplates();
    },[refreshItemTemplates]);


    const editNameHandler = useCallback((name:string)=>{
        setEditingItem(item=>{
            const newItem = {...item};
            newItem.name = name;
            return newItem;
        });
    }, []);
    
    const editNumberHandler = useCallback((number:number)=>{
        setEditingItem(item=>{
            const newItem = {...item};
            newItem.number = number;
            return newItem;
        });
    }, []);
    const addCurrentHandler = useCallback((current:number)=>{
        setEditingItem(item=>{
            if(item.currents.includes(current))
                return item;
            const newItem = {...item};
            newItem.currents = [...newItem.currents, current];
            newItem.currents = newItem.currents.sort((a, b)=>a-b);
            return newItem;
        });
    }, []);
    const removeCurrentHandler = useCallback((current:number)=>{
        setEditingItem(item=>{
            const newItem = {...item};
            newItem.currents = newItem.currents.filter(a=>a !== current)
            return newItem;
        });
    }, []);

    const addSteelHandler = useCallback((steelName:string)=>{
        setEditingItem(item=>{
            if(item.steelTypes.includes(steelName))
                return item;
            const newItem = {...item};
            newItem.steelTypes.push(steelName);
            return newItem;
        });
    }, []);

    const removeSteelHandler = useCallback((steelName:string)=>{
        setEditingItem(item=>{
            const newItem = {...item};
            newItem.steelTypes = newItem.steelTypes.filter(a=>a !== steelName)
            return newItem;
        });
    }, []);

    const closeEditingHandler = useCallback(()=>{
        setIsEditing(false);
        if(editingType === 'editing')
            setEditingItem(createNewEditingItem());
    }, [editingType]);

    const saveEditingHandler = useCallback(async ()=>{
        setIsEditing(false);
        if(editingType === 'creating'){
            await createItemTemplate(editingItem)
            await refreshItemTemplates();
        }
        else{
            await updateItemTemplate(editingItem.id, editingItem)
            await refreshItemTemplates();
        }
        setEditingItem(createNewEditingItem());
    }, [editingItem, editingType, refreshItemTemplates]);
    

    const startCreatingHandler = useCallback(()=>{
        setIsEditing(true);
        setEditingType('creating');
    }, []);
    const startEditingHandler = useCallback((item:ItemTemplate)=>{
        setIsEditing(true);
        setEditingType('editing');
        setEditingItem({
            id:item.id,
            name: item.name,
            number: item.number,
            currents: [...item.currents],
            steelTypes: [...item.steelTypes]
        });
    }, []);

    return  (
        <Fragment>
            {isLoading ? <Spinner /> : (
                <div style={{
                    width: "94%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "3%"
                }}>
                    {isEditing ? (
                        <EditItemTemplateModal show={isEditing} handleAddCurrent={addCurrentHandler}
                            handleAddSteelType={addSteelHandler} handleClose={closeEditingHandler}
                            handleDeleteCurrent={removeCurrentHandler} handleDeleteSteelType={removeSteelHandler}
                            handleEditName={editNameHandler} handleEditNumber={editNumberHandler}
                            handleSave={saveEditingHandler} itemTemplate={editingItem} allSteelTypes={steelTypes} />
                    ) : null}
                    {errorMsg ? (
                        <Alert variant="danger">
                            {errorMsg}
                        </Alert>
                    ) :(                       
                        <Fragment>
                            <ItemTemplatesList itemTemplates={itemTemplates}
                                            handleStartEditing={startEditingHandler}/>

                            <AddModalButton onClick={startCreatingHandler} />
                        </Fragment>
                    )}
                    <RefreshModalButton onClick={refreshItemTemplates} />
                </div>
            )}
        </Fragment>
    );
};


export default ItemTemplatesManager;