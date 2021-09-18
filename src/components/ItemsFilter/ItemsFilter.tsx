import { useMemo } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { FormSelect } from "react-bootstrap";
import { Item } from "../../api/centrostalApi";
import SearchInput from "../UI/Input/SearchInput/SearchInput";


export enum AmountFilter{
    all = "Wybierz ilość",
    nonZero = "Niezerowa",
    positive = "Dodatnia",
    negative = "Ujemna"
}
export interface ItemsFilterProps{
    namePattern: string;
    handleNamePatternChange: (namePattern:string)=>void;

    current: string|null;
    handleCurrentChange: (current:string|null)=>void;

    steelType: string|null;
    handleSteelChange: (steelType:string|null)=>void;
    
    isOriginal: boolean|null;
    handleIsOriginalChange: (isOriginal:boolean|null)=>void;

    isEverythingChoosen?: boolean;
    handleIsEverythingChoosenChange?: (val:boolean)=>void;
    
    amountFilter?: AmountFilter;
    handleAmountFilterChange?: (filter:AmountFilter)=>void;

    itemCandidates: Item[];
}


const ItemsFilter = ({current, handleCurrentChange, handleIsOriginalChange, handleSteelChange,
                        isOriginal, steelType, itemCandidates, handleNamePatternChange, namePattern,
                    handleIsEverythingChoosenChange, isEverythingChoosen, amountFilter, handleAmountFilterChange}:ItemsFilterProps)=>{
    

    const [names, setNames] = useState([] as string[]);
    const [currents, setCurrents] = useState([] as string[])
    const [steelTypes, setSteelTypes] = useState([] as string[])

    const [isItemNameValid, setItemNameValid] = useState(false);
    const [isCurrentValid, setCurrentValid] = useState(false);
    const [isSteelTypeValid, setSteelTypeValid] = useState(false);

    const amountOptions = useMemo(()=>[AmountFilter.all, AmountFilter.nonZero, AmountFilter.positive, AmountFilter.negative], []);

    useEffect(()=>{
        const newNameSuggestions = [...new Set(itemCandidates.map(item=>item.name))];
        setNames(newNameSuggestions);
    }, [itemCandidates]);
    useEffect(()=>{
        const newSteelTypes = [...new Set(itemCandidates.map(item=>item.steelType))];
        setSteelTypes(newSteelTypes)
    }, [itemCandidates]);
    useEffect(()=>{
        const newCurrents = [...new Set(itemCandidates.map(item=>item.current))];
        setCurrents(newCurrents.map(a=>a.toString()));
    }, [itemCandidates]);
    
    
    useEffect(()=>{
        const valid = namePattern !== null && names.includes(namePattern);
        setItemNameValid(valid);
    }, [namePattern, names]);
    useEffect(()=>{
        const valid = current !== null && currents.includes(current);
        setCurrentValid(valid);
        if(!valid)
            handleCurrentChange(null);
    }, [current, currents, handleCurrentChange]);
    useEffect(()=>{
        const valid = steelType !== null && steelTypes.includes(steelType);
        setSteelTypeValid(valid);
        if(!valid)
            handleSteelChange(null);
    }, [steelType, steelTypes, handleSteelChange]);
    

    useEffect(()=>{
        const valid = isCurrentValid && isItemNameValid && isSteelTypeValid && itemCandidates.length >= 1;
        handleIsEverythingChoosenChange?.call(null, valid);
    }, [isCurrentValid, isItemNameValid, isSteelTypeValid, itemCandidates, handleIsEverythingChoosenChange]);


    const itemNamePatternChangedHandler = useCallback((text:string)=>{
        handleNamePatternChange(text);
    }, [handleNamePatternChange]);

    return (
        <Fragment>
            <div className="mb-3" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'self-start',
                        flexWrap: 'nowrap',
                        columnGap: 5
                    }}>
                <SearchInput placeholder="Wybierz nazwę towaru"
                            handleTextChange={itemNamePatternChangedHandler}
                            isValid={isItemNameValid}
                            text={namePattern}
                            suggestions={names}
                            style={{
                                flex:1
                            }}
                            />
                <FormSelect isValid={isSteelTypeValid}
                            onChange={e=>handleSteelChange(e.currentTarget.value)}
                            style={{
                                flex: 0.6
                            }}
                            value={steelType === null ? "" : steelType}>
                    <option  value="">Wybierz materiał</option>
                    {steelTypes.map(steelType=>(
                        <option value={steelType} key={steelType}>
                            {steelType}
                        </option>
                    ))}
                </FormSelect>

                <FormSelect isValid={isCurrentValid}
                            onChange={e=>handleCurrentChange(e.currentTarget.value)}
                            style={{
                                flex: 0.4, 
                            }}
                            value={current === null ? "" : current}>
                    <option value="">Wybierz prąd</option>
                    {currents.map(current=>(
                        <option value={current} key={current}>
                            {current}A
                        </option>
                    ))}
                </FormSelect>
                <FormSelect isValid={isOriginal !== null}
                            onChange={e=>handleIsOriginalChange(e.currentTarget.value === "original" ? true
                                                                : e.currentTarget.value === "substitute" ? false
                                                                : null)}
                            value={isOriginal ? 'original' : 
                                    isOriginal === false ? 'substitute' : ""}
                            style={{
                                flex: 0.4, 
                            }}>
                    <option value="">Wybierz jakość</option>
                    <option value="original">Oryginał</option>
                    <option value="substitute">Zamiennik</option>
                </FormSelect>
                {amountFilter ? (
                    <FormSelect isValid={amountFilter !== AmountFilter.all}
                                onChange={e=>handleAmountFilterChange && handleAmountFilterChange(e.currentTarget.value as AmountFilter)}
                                value={amountFilter}
                                style={{
                                    flex: 0.4, 
                                }}>
                        {amountOptions.map(filter => (
                            <option value={filter}>{filter}</option>
                        ))}
                    </FormSelect>
                ) : null}
                
            </div>
        </Fragment>
    );
}

export default ItemsFilter;