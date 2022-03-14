import {
  Button, Flex,
  FormControl, FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, PortalProps, Spinner
} from "@chakra-ui/react";
import TextInput from "../../input/TextInput";
import {Fragment, useState} from "react";
import {NewCategoryRequest, NewTechnicalSpecificationRequest} from "../../../types/dto/Category";
import React from "react";
import TechnicalSpecificationCreator from "./TechnicalSpecificationCreator";

interface INewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCallback: (value: NewCategoryRequest) => void;
  inTransaction: boolean;
}

const NewCategoryModal = (props: INewCategoryModalProps) => {
  const {isOpen, onClose, onSaveCallback, inTransaction} = props;
  const [categoryName, setCategoryName] = useState<string>("");
  const [newTechSpecRequests, setNewTechSpecRequests] = useState<NewTechnicalSpecificationRequest[]>([]);

  const modalOpen = (): boolean => isOpen && !inTransaction;

  const validateRequest = (): boolean => {
    return categoryName.length > 0 &&
      newTechSpecRequests.find(ts => !ts.isEnumList && !ts.isBoolean && !ts.isNumber && !ts.isString) === undefined &&
      newTechSpecRequests.find(ts => ts.name.length === 0) === undefined &&
      newTechSpecRequests.find(ts => ts.isEnumList && ts.listOfEnumNames.length === 0) === undefined
  }

  const onSave = () => {
    if (validateRequest()) {
      const request: NewCategoryRequest = {name: categoryName, technicalSpecificationRequests: newTechSpecRequests};
      onSaveCallback(request);
    }
  }

  const handleTechSpecCreatorCallback = (requests: NewTechnicalSpecificationRequest[]) => {
    setNewTechSpecRequests(requests);
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

              <Flex mt="5%">
                <TechnicalSpecificationCreator callback={handleTechSpecCreatorCallback} />
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onSave} disabled={!validateRequest() || inTransaction}>
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
