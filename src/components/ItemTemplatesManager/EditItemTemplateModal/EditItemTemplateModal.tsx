import { Fragment } from "react";
import { PlusCircle, SaveFill, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import { UpdateItemTemplate } from "../../../api/centrostalApi";
import { ListGroupItem } from "react-bootstrap";
import { useState } from "react";
import ToggleButton from "../../UI/ToggleButton/ToggleButton";
import { AddButton, CloseButton, SaveButton } from "../../UI/ImageButtons/ImageButtons";

export interface EditItemTemplateModalProps{
  show: boolean;
  handleClose: ()=>void;
  handleSave: ()=>void;
  itemTemplate: UpdateItemTemplate;
  allSteelTypes:string[];
  handleEditName: (newName:string)=>void;
  handleEditNumber: (newNumber:number)=>void;
  handleAddCurrent: (current:number)=>void;
  handleDeleteCurrent: (current:number)=>void;
  handleAddSteelType: (steelName:string)=>void;
  handleDeleteSteelType: (steelName:string)=>void;
}

const EditItemTemplateModal = ({show, handleClose, 
            handleAddCurrent, handleAddSteelType, handleDeleteCurrent,
            handleDeleteSteelType, handleEditName, handleEditNumber,
            handleSave, itemTemplate, allSteelTypes}:EditItemTemplateModalProps) => {
    
    const [current, setCurrent] = useState("");
    return ( 
      <Fragment>
        <Modal show={show} 
               onHide={handleClose} 
               size="xl">
               
          <Modal.Header>
            <Modal.Title>{`${itemTemplate.name} - edycja`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <InputGroup className="mb-3">
                  <InputGroup.Text>Nazwa</InputGroup.Text>
                  <FormControl value={itemTemplate.name} onChange={(e)=>handleEditName(e.currentTarget.value)} />
              </InputGroup>
              <InputGroup className="mb-3">
                  <InputGroup.Text>Numer</InputGroup.Text>
                  <FormControl type="number" value={itemTemplate.number} onChange={(e)=>handleEditNumber(parseInt(e.currentTarget.value))} />
              </InputGroup>
              <div style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly"
              }}>
                    <div>
                        <fieldset>
                            <legend style={{textAlign: "center"}}>Wybierz możliwe natężenia</legend>
                            <hr />
                            <InputGroup style={{marginBottom: 7}}>
                                <FormControl 
                                    type="number"
                                    placeholder="Wybierz prąd" 
                                    onChange={e=>setCurrent(e.target.value)}
                                    value={current} />
                                <InputGroup.Text>A</InputGroup.Text>
                                <AddButton style={{
                                                marginLeft: 7,
                                            }}
                                        disabled={isNaN(parseInt(current))}
                                        onClick={()=>{
                                            setCurrent("");
                                            handleAddCurrent(parseInt(current));
                                        }} />
                            </InputGroup>
                            <ListGroup>
                                {itemTemplate.currents.map( (current, idx)=>(
                                    <ListGroupItem key={current}
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                        {current.toString()}A
                                        <Button variant="danger" 
                                                onClick={()=>handleDeleteCurrent(current)}>
                                            Usuń
                                        </Button>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </fieldset>
                    </div>
                    <div>
                        <fieldset>
                            <legend style={{textAlign: "center"}}>Wybierz możliwe materiały</legend>
                            <hr />
                            <div style={{
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                {allSteelTypes.map(steel=>{
                                    const isToggled = itemTemplate.steelTypes.includes(steel); 
                                    return (
                                        <ToggleButton 
                                            changeToggle={(toggle)=>toggle ? handleAddSteelType(steel) : handleDeleteSteelType(steel)}
                                            textToggled={steel}
                                            textUntoggled={steel}
                                            variantToggled="success"
                                            variantUntoggled="warning"
                                            toggled={isToggled}
                                            style={{
                                                marginBottom: 7
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </fieldset>

                    </div>
               </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <CloseButton onClick={handleClose} />
            <SaveButton onClick={handleSave} />
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
}

export default EditItemTemplateModal;