import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "@chakra-ui/react";
import TextInput from "../../input/TextInput";
import React, {Fragment, useState} from "react";
import {NewItemRequest, TechnicalSpecInfoRequest} from "../../../types/dto/InventoryItem";
import FloatNumberInput from "../../input/FloatNumberInput";
import TechnicalSpecificationCreator from "../category/TechnicalSpecificationCreator";
import TechSpecInfoEditor from "./TechSpecInfoEditor";
import {
  CategoryResponse,
  TechnicalSpecEnumListItemRequest,
  TechnicalSpecificationUpdateRequest
} from "../../../types/dto/Category";
import {useQuery} from "react-query";
import {getCategory} from "../../../services/queries";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";

interface INewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCallback: (value: NewItemRequest) => void;
  inTransaction: boolean;
  categoryId: number;
}

const NewItemModal = ({isOpen, onClose, onSaveCallback, inTransaction, categoryId}: INewItemModalProps) => {
  const [itemName, setItemName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [specInfoRequests, setSpecInfoRequests] = useState<TechnicalSpecInfoRequest[]>([]);

  const {data: category} = useQuery('relevantCategory', () => getCategory(categoryId));

  const onSave = () => {
    if (itemName.length > 0 && description.length > 0 && price >= 0 && specInfoRequests.find(r => r.value === "") === undefined) {
      const request: NewItemRequest = {
        name: itemName,
        description: description,
        price: price,
        listOfTechnicalSpecInfo: specInfoRequests
      };
      onSaveCallback(request);
    }
  }

  const handleTechSpecInfoEditorCallback = (requests: TechnicalSpecInfoRequest[]) => {
    setSpecInfoRequests(requests);
  }

  const showHideClassName = (isOpen && !inTransaction) ? "modal display-block" : "modal display-none";

  if (category === undefined) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </AuthenticatedLayout>
    )
  }

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

              <Flex mt="5%" mb="4">
                <TechSpecInfoEditor
                  technicalSpecifications={category.technicalSpecifications}
                  listOfTechSpecInfo={[]}
                  callback={handleTechSpecInfoEditorCallback}
                />
              </Flex>
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
