import {
  Button, Flex,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "@chakra-ui/react";
import {Fragment, useState} from "react";
import {
  CategoryResponse,
  NewCategoryRequest,
  NewTechnicalSpecificationRequest, TechnicalSpecEnumListItemRequest,
  TechnicalSpecificationUpdateRequest
} from "../../../types/dto/Category";
import React from "react";
import TechnicalSpecificationCreator from "./TechnicalSpecificationCreator";
import TechnicalSpecificationEditor from "./TechnicalSpecificationEditor";
import {useQuery} from "react-query";
import {getCategory} from "../../../services/queries";
import AuthenticatedLayout from "../../../layout/AuthenticatedLayout";

interface IEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCallback: (requests: TechnicalSpecificationUpdateRequest[]) => void;
  inTransaction: boolean;
  categoryId: number;
}

const EditCategoryModal = (props: IEditCategoryModalProps) => {
  const {isOpen, onClose, onSaveCallback, inTransaction, categoryId} = props;
  const [newTechSpecRequests, setNewTechSpecRequests] = useState<NewTechnicalSpecificationRequest[]>([]);
  const [updatedTechSpecRequests, setUpdatedTechSpecRequests] = useState<TechnicalSpecificationUpdateRequest[]>([]);

  const {data: category} = useQuery(
    'editCategory',
    () => getCategory(categoryId),
    {
      retry: false,
      onSuccess: async (data) => {
        setUpdatedTechSpecRequests(data.technicalSpecifications.map(ts => {
          return {
            id: ts.id,
            name: ts.name,
            unitOfMeasure: ts.unitOfMeasure,
            categoryId: ts.categoryId,
            isNumber: ts.isNumber,
            isBoolean: ts.isBoolean,
            isString: ts.isString,
            isEnumList: ts.isEnumList,
            listOfEnumItems: ts.listOfEnumItems.map(v => {
              return {
                id: v.id,
                enumName: v.enumName,
                technicalSpecificationId: v.technicalSpecificationId
              } as TechnicalSpecEnumListItemRequest;
            })
          } as TechnicalSpecificationUpdateRequest;
        }))
      },
    });

  const validateRequest = (): boolean => {
    return newTechSpecRequests.find(ts => !ts.isEnumList && !ts.isBoolean && !ts.isNumber && !ts.isString) === undefined &&
      newTechSpecRequests.find(ts => ts.name.length === 0) === undefined &&
      newTechSpecRequests.find(ts => ts.isEnumList && ts.listOfEnumNames.length === 0) === undefined &&
      updatedTechSpecRequests.find(ts => !ts.isEnumList && !ts.isBoolean && !ts.isNumber && !ts.isString) === undefined &&
      updatedTechSpecRequests.find(ts => ts.name.length === 0) === undefined &&
      updatedTechSpecRequests.find(ts => ts.isEnumList && ts.listOfEnumItems.length === 0) === undefined
  }

  const onSave = () => {
    if (category === undefined)
      return;

    if (validateRequest()) {
      const newRequests = newTechSpecRequests.map(nr => {
        return {
          id: null,
          name: nr.name,
          unitOfMeasure: nr.unitOfMeasure,
          categoryId: category.id,
          isNumber: nr.isNumber,
          isBoolean: nr.isBoolean,
          isString: nr.isString,
          isEnumList: nr.isEnumList,
          listOfEnumItems: nr.listOfEnumNames.map(v => {
            return {
              id: null,
              enumName: v,
              technicalSpecificationId: null
            } as TechnicalSpecEnumListItemRequest;
          })
        } as TechnicalSpecificationUpdateRequest;
      })
      onSaveCallback([...newRequests, ...updatedTechSpecRequests]);
    }
  }

  const handleTechSpecCreatorCallback = (requests: NewTechnicalSpecificationRequest[]) => {
    setNewTechSpecRequests(requests);
  }

  const handleTechSpecEditorCallback = (requests: TechnicalSpecificationUpdateRequest[]) => {
    setUpdatedTechSpecRequests(requests);
  }

  const modalOpen = (): boolean => isOpen && !inTransaction;
  const showHideClassName = modalOpen() ? "modal display-block" : "modal display-none";

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
        isOpen={modalOpen()}
        onClose={onClose}
        size="l"
      >
        <div className={showHideClassName}>
          <div className={"modal-main"}>

            <ModalHeader>Kategória módosítása</ModalHeader>

            <ModalBody pb={6}>
              <Flex mt="5%">
                <TechnicalSpecificationEditor
                  technicalSpecifications={category.technicalSpecifications}
                  callback={handleTechSpecEditorCallback}
                  />
              </Flex>

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

export default EditCategoryModal;
