import {
  Button,
  FormControl, FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, PortalProps, Spinner
} from "@chakra-ui/react";
import TextInput from "../../input/TextInput";
import {Fragment, useEffect, useState} from "react";
import {NewCategoryRequest} from "../../../types/dto/Category";
import React from "react";
import {FocusableElement} from "@chakra-ui/utils";

interface INewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCallback: (value: NewCategoryRequest) => void;
  inTransaction: boolean;
}

const NewCategoryModal = (props: INewCategoryModalProps) => {
  const {isOpen, onClose, onSaveCallback, inTransaction} = props;
  const [categoryName, setCategoryName] = useState<string>("");

  const modalOpen = (): boolean => isOpen && !inTransaction;

  const onSave = () => {
    if (categoryName.length > 0) {
      const request: NewCategoryRequest = {name: categoryName, technicalSpecificationRequests: []};
      onSaveCallback(request);
    }
  }

  const showHideClassName = modalOpen() ? "modal display-block" : "modal display-none";

  return(
    <Fragment>
      <Modal
        isOpen={modalOpen()}
        onClose={onClose}
        size="l"
      >
        <div className={showHideClassName}>
          <div className={"modal-main"}>

            <ModalHeader>Új kategória létrehozása</ModalHeader>

            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Kategória neve</FormLabel>
                <TextInput value={categoryName} setValue={setCategoryName} placeholder={"Kategória 1"} />
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

export default NewCategoryModal;
