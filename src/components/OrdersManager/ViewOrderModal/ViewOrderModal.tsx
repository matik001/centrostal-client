import { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { Order } from "../../../api/centrostalApi";
import OrderItemList from "../OrderItemList/OrderItemList";

export interface ViewOrderModalProps{
    show: boolean;
    handleClose: ()=>void;
    order: Order;
}

const ViewOrderModal = ({show, handleClose, order}:ViewOrderModalProps)=>{
    return ( 
        <Fragment>
          <Modal show={show} 
                 onHide={handleClose} 
                 size="xl" >
                 
            <Modal.Header closeButton>
              <Modal.Title>
                  {`Zamówienie nr ${order.id}`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <OrderItemList orderItems={order.orderItems} type='noedit' />
            </Modal.Body>
            {/* <Modal.Footer>
              <SaveButton onClick={handleSave}>{type==='editing' ? 'Aktualizuj' : "Zapisz"}</SaveButton>
              <CloseButton onClick={handleClose} />
            </Modal.Footer> */}
          </Modal>
        </Fragment>
    )
}
  


export default ViewOrderModal;