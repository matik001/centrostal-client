import ListGroup from "react-bootstrap/ListGroup";
import { ItemTemplate } from "../../../api/centrostalApi";
import ItemTemplateElement from "./ItemTemplateElement/ItemTemplateElement";

export interface ItemTemplatesListProps{
    itemTemplates:ItemTemplate[];
    handleStartEditing:(item:ItemTemplate)=>void;
}

const ItemTemplatesList = ({itemTemplates, handleStartEditing }:ItemTemplatesListProps) => {
    return (
        <ListGroup>
            {itemTemplates.map(itemTemplate =>(
                <ListGroup.Item key={itemTemplate.id}>
                    <ItemTemplateElement itemTemplate={itemTemplate} handleStartEditing={handleStartEditing} />
                </ListGroup.Item>))}
        </ListGroup>
    )
}

export default ItemTemplatesList;