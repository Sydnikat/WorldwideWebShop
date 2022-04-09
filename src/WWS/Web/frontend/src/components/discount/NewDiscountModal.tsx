import {
  Button, Checkbox, Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Spinner, Text
} from "@chakra-ui/react";
import React, {Fragment, useState} from "react";
import {NewDiscountRequest} from "../../types/dto/Discount";
import TextInput from "../input/TextInput";
import FloatNumberInput from "../input/FloatNumberInput";
import {useQuery} from "react-query";
import {CategoryResponse} from "../../types/dto/Category";
import {WWSError} from "../../types/dto/Error";
import {getCategories} from "../../services/queries";
import NumberInputSlider from "../input/NumberInputSlider";
import DatePickerInput from "../input/DatePickerInput";

interface INewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCallback: (value: NewDiscountRequest) => void;
  inTransaction: boolean;
}

const NewItemModal = ({isOpen, onClose, onSaveCallback, inTransaction}: INewItemModalProps) => {
  const [sendPromotion, setSendPromotion] = useState<boolean>(true);
  const [endDate, setEndDate] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse>({id: -1, name: "", technicalSpecifications: []});

  const { data: categories, } = useQuery<CategoryResponse[], WWSError>(
    'categories',
    getCategories,
  );

  const onSave = () => {
    if (value >= 0 && endDate !== "") {
      const request: NewDiscountRequest = {
        value: value,
        endDate: endDate,
        categoryId: selectedCategory.id,
        itemIds: null,
        sendPromotion: sendPromotion
      };
      onSaveCallback(request);
    }
  }

  const onCategorySelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    if (categories !== undefined) {
      const selected = categories.find(c => c.id === parseInt(idStr, 10));
      if (selected !== undefined) {
        setSelectedCategory(selected);
      }
    }
  }

  const onPromotionCheckBoxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendPromotion(event.target.checked);
  };

  const showHideClassName = (isOpen && !inTransaction) ? "modal display-block" : "modal display-none";

  if (categories === undefined) {
    return (
      <Fragment>
        <Modal
          isOpen={isOpen && !inTransaction}
          onClose={onClose}
          size="l"
        >
          <div className={showHideClassName}>
            <div className={"modal-main"}>
              <ModalHeader>Új Akció létrehozása</ModalHeader>
              <ModalBody pb={6}>
                <Flex alignItems="center" justifyContent="center" mx="auto">
                  <Spinner size="xl" />
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose} disabled={inTransaction}>Vissza</Button>
              </ModalFooter>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
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

            <ModalHeader>Új leárazás létrehozása</ModalHeader>

            <ModalBody pb={6}>
              <FormControl mb="4">
                <FormLabel>Kategória kiválasztása:</FormLabel>
                <Select
                  value={selectedCategory.id}
                  onChange={onCategorySelectChange}
                  bg="white"
                >
                  <option key={`cat_null`} value={-1} disabled hidden>Válasszon kategóriát...</option>
                  {categories.map((c: CategoryResponse, i: number) => (
                    <option key={`cat_${i}`} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </FormControl>

              <DatePickerInput value={endDate} setValue={setEndDate} />

              <FormControl mb="4">
                <FormLabel>Leárazás mértéke:</FormLabel>
                <NumberInputSlider value={value} setValue={setValue} />
              </FormControl>


              <Checkbox isChecked={sendPromotion} onChange={onPromotionCheckBoxChange}>
                Promóciós email küldése a felhasználóknak
              </Checkbox>
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
