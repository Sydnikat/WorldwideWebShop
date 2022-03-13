import {Button, FormControl, FormLabel, Modal, ModalBody, ModalFooter, ModalHeader, Spinner} from "@chakra-ui/react";
import TextInput from "../../input/TextInput";
import React, {Fragment, useState} from "react";
import {NewItemRequest} from "../../../types/dto/InventoryItem";
import FloatNumberInput from "../../input/FloatNumberInput";

interface INewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCallback: (value: NewItemRequest) => void;
  inTransaction: boolean;
}

const NewItemModal = ({isOpen, onClose, onSaveCallback, inTransaction}: INewItemModalProps) => {
  const [itemName, setItemName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const onSave = () => {
    if (itemName.length > 0 && description.length > 0 && price >= 0) {
      const request: NewItemRequest = {name: itemName, description: description, price: price, listOfTechnicalSpecInfo: []};
      onSaveCallback(request);
    }
  }

  const showHideClassName = (isOpen && !inTransaction) ? "modal display-block" : "modal display-none";

  return(
    <Fragment>
      <Modal
        isOpen={isOpen && !inTransaction}
        onClose={onClose}
        size="l"
      >
        <div className={showHideClassName}>
          <div className={"modal-main"}>

            <ModalHeader>Új termék létrehozása</ModalHeader>

            <ModalBody pb={6}>
              <FormControl mb="4">
                <FormLabel>Termék neve</FormLabel>
                <TextInput value={itemName} setValue={setItemName} placeholder={"Termék 1"} />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Termék leírása</FormLabel>
                <TextInput value={description} setValue={setDescription} placeholder={"Termékinfó"} />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Termék ára</FormLabel>
                <FloatNumberInput value={price} setValue={setPrice} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onSave} disabled={inTransaction}>
                {inTransaction ? <Spinner /> : "Mentés" }
              </Button>
              <Button onClick={onClose} disabled={inTransaction}>Vissza</Button>
            </ModalFooter>

          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

export default NewItemModal;
