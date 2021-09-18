import { forwardRef } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { ArrowRepeat, CardText, Laptop, PlusLg, SaveFill, XCircle } from "react-bootstrap-icons";
import SquareButton from "../SquareButton/SquareButton";

export const EditButton = (props:ButtonProps)=>(
    <Button variant='primary' {...props}>
        <CardText  
            style={{
                marginRight: 6
            }}/>
        Edytuj
    </Button>
)

export const SaveButton = (props:ButtonProps)=>(
    <Button variant='primary' {...props}>
        <SaveFill  
            style={{
                marginRight: 6
            }}/>
        {props.children ?? 'Zapisz'} 
    </Button>
)

export const AddButton = forwardRef((props:ButtonProps, ref:any)=>(
    <Button variant='primary' {...props} ref={ref}>
        <PlusLg size="12" style={{
                marginRight: 6
            }}/>
        Dodaj
    </Button>
))
export const CloseButton = (props:ButtonProps)=>(
    <Button variant='secondary' {...props}>
        <XCircle style={{
                marginRight: 6
            }}/>
        Zamknij
    </Button>
)

export const ShowButton = (props:ButtonProps)=>(
    <Button variant='warning' {...props}>
        <Laptop style={{
                marginRight: 6,
            }}/>
        Pokaż
    </Button>
)

export const RefreshModalButton = (props:ButtonProps)=>(
    <SquareButton {...props}
        variant="info"
        style={{
            position: "fixed",
            right: 30,
            bottom: 90,
            ...props.style
        }}>
        <ArrowRepeat fontSize={22}/>
    </SquareButton>
)

export const AddModalButton = (props:ButtonProps)=>(
    <SquareButton {...props}
        variant="primary"
        style={{
            position: "fixed",
            right: 30,
            bottom: 30
        }}>
        <PlusLg />
    </SquareButton>
);