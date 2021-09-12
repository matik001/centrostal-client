import { Button, ButtonProps } from "react-bootstrap";

export interface ToggleButtonProps extends ButtonProps{
    toggled:boolean;
    changeToggle: (newToggled:boolean)=>void;
    variantToggled: string;
    variantUntoggled: string;
    textToggled: string;
    textUntoggled:string;
}
const ToggleButton = ({toggled, changeToggle, variantToggled, variantUntoggled,
                        textToggled, textUntoggled, ...rest}:ToggleButtonProps)=>{
    return (
        <Button variant={toggled ? variantToggled : variantUntoggled} onClick={()=>changeToggle(!toggled)} {...rest}>
            {toggled ? textToggled : textUntoggled}
        </Button>
    )
};

export default ToggleButton;