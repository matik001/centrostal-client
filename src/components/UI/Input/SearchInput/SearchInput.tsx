
import { Fragment, useCallback, useState } from "react";
import { Search } from "react-bootstrap-icons";
import FormControl, { FormControlProps } from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";

export interface SearchInputProps extends FormControlProps{
    text: string;
    handleTextChange: (text:string)=>void;
    suggestions: string[];
    isValid: boolean;
}

const SearchInput = ({text, 
                    handleTextChange, 
                    suggestions,
                    isValid,
                    style, 
                    ...addictionalProps}:SearchInputProps)=>{
    const changedTextHandler = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e)=>{
        handleTextChange(e.currentTarget.value);
    }, [handleTextChange]);
    
    const [focused, setFocused] = useState(false)
    const onFocus = useCallback(() => setFocused(true), [setFocused]);
    const onBlur = useCallback(() => {
        setTimeout(()=>setFocused(false), 300);
    }, [setFocused])
    return(
        <div style={style}>
            <InputGroup hasValidation style={{width: "100%"}}>
                <InputGroup.Text style={{width: 40}}>
                    <Search />
                </InputGroup.Text>
                <FormControl value={text} 
                            onChange={changedTextHandler} 
                            onFocus={onFocus}
                            onBlur={onBlur}
                            isValid={isValid}
                            {...addictionalProps}/>
                            
            </InputGroup>
            <ListGroup style={{
                ...(!focused ?  {display: "none"} : {}),
                marginLeft: 40
            }}>
                {suggestions.map((text, idx)=>(
                    <ListGroup.Item key={text}
                                    action
                                    onClick={()=>handleTextChange(text)}>{text}</ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    )
}


export default SearchInput;