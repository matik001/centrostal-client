import { Fragment } from "react";
import { Badge, Button } from "react-bootstrap";
import { CardText } from "react-bootstrap-icons";
import { ItemTemplate } from "../../../../api/centrostalApi";
import { EditButton } from "../../../UI/ImageButtons/ImageButtons";

export interface ItemTemplateElementProps{
    itemTemplate:ItemTemplate;
    handleStartEditing:(itemTemplate:ItemTemplate)=>void;
}
const ItemTemplateElement = ({itemTemplate, handleStartEditing}:ItemTemplateElementProps)=>{

    return(
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: 'center'
        }}>
            <div style={{
                marginRight: 'auto'
            }}>
                <span style={{
                    fontWeight: 'bold',
                    marginRight: "50px"
                }}>
                    {itemTemplate.name}
                </span>
                <span style={{
                    fontWeight: 'bold',
                    color: "gray",
                    marginRight: "50px"
                }}>
                    {itemTemplate.number} 
                </span>
                {itemTemplate.currents.map(current => (
                    <Fragment key={current}>
                        <Badge bg="primary" style={{cursor: 'default'}}>
                            {`${current.toString()}A`}
                        </Badge>
                        {' '}
                    </Fragment>
                ))}
                {itemTemplate.steelTypes.map(steelType => (
                    <Fragment key={steelType}>
                        <Badge bg="warning" style={{cursor: 'default'}}>
                            {`${steelType.toString()}`}
                        </Badge>
                        {' '}
                    </Fragment>
                ))}
            </div>
            <EditButton onClick={()=>handleStartEditing(itemTemplate)} />
            {/* <Button variant="danger" 
                    onClick={()=>handleDeleteQuestion(question.id)}
                    style={{
                        marginLeft: 5
                    }}>
                        Delete
            </Button> */}
        </div>
    );
}

export default ItemTemplateElement;

