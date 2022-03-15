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
import {
  ItemResponse,
  NewItemRequest,
  TechnicalSpecInfoRequest,
  UpdateItemRequest
} from "../../../types/dto/InventoryItem";
import FloatNumberInput from "../../input/FloatNumberInput";
import {CategoryResponse} from "../../../types/dto/Category";
import {useQuery} from "react-query";
import {getCategory} from "../../../services/queries";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";
import TechSpecInfoEditor from "./TechSpecInfoEditor";

interface IEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCallback: (value: UpdateItemRequest) => void;
  inTransaction: boolean;
  item: ItemResponse;
  categoryId: number;
}

const EditItemModal = ({isOpen, onClose, onSaveCallback, inTransaction, item, categoryId}: IEditItemModalProps) => {
  const [description, setDescription] = useState<string>(item.description);
  const [stock, setStock] = useState<number>(item.stock);
  const [lowLevel, setLowLevel] = useState<number>(item.lowLevel);
  const [specInfoRequests, setSpecInfoRequests] = useState<TechnicalSpecInfoRequest[]>([]);

  const {data: category} = useQuery('relevantCategory', () => getCategory(categoryId));

  const onSave = () => {
    if (description.length > 0 && stock >= 0 && lowLevel >= 0 && specInfoRequests.find(r => r.value === "") === undefined) {
      const request: UpdateItemRequest = {
        description: description,
        stock: stock,
        lowLevel: lowLevel,
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

              <Flex mt="5%" mb="4">
                <TechSpecInfoEditor
                  technicalSpecifications={category.technicalSpecifications}
                  listOfTechSpecInfo={item.listOfTechnicalSpecInfo}
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

export default EditItemModal;
