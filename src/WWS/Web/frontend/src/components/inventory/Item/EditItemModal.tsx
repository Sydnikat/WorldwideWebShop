import {Button, FormControl, FormLabel, Modal, ModalBody, ModalFooter, ModalHeader, Spinner} from "@chakra-ui/react";
import TextInput from "../../input/TextInput";
import React, {Fragment, useState} from "react";
import {ItemResponse, NewItemRequest, UpdateItemRequest} from "../../../types/dto/InventoryItem";
import FloatNumberInput from "../../input/FloatNumberInput";

interface IEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCallback: (value: UpdateItemRequest) => void;
  inTransaction: boolean;
  item: ItemResponse;
}

const EditItemModal = ({isOpen, onClose, onSaveCallback, inTransaction, item}: IEditItemModalProps) => {
  const [description, setDescription] = useState<string>(item.description);
  const [stock, setStock] = useState<number>(item.stock);
  const [lowLevel, setLowLevel] = useState<number>(item.lowLevel);

  const onSave = () => {
    if (description.length > 0 && stock >= 0 && lowLevel >= 0) {
      const request: UpdateItemRequest = {description: description, stock: stock, lowLevel: lowLevel};
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

            <ModalHeader>{item.name} termék adatai</ModalHeader>

            <ModalBody pb={6}>
              <FormControl mb="4">
                <FormLabel>Termék leírása</FormLabel>
                <TextInput value={description} setValue={setDescription} placeholder={"Termékinfó"} isTextArea={true}/>
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Készletinfó</FormLabel>
                <FloatNumberInput value={stock} setValue={setStock}/>
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Alacsony szint megadása</FormLabel>
                <FloatNumberInput value={lowLevel} setValue={setLowLevel} />
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

export default EditItemModal;
