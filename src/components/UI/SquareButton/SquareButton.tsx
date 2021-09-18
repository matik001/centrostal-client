import React from 'react';
import { Button } from 'react-bootstrap';
import { ButtonProps } from 'react-bootstrap/Button';
import style from './SquareButton.module.css'

export interface SquareButtonProps extends ButtonProps{
    children: React.ReactNode
}

const SquareButton = ({children, ...additionalProps}:SquareButtonProps)=>(
    <Button {...additionalProps} className={style.button}>
        {children}
    </Button>
)


export default SquareButton;