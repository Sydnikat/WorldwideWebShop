import {Box, Checkbox, Flex, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import {CategoryResponse} from "../../types/dto/Category";

interface ICategorySelectionProps {
  categories: CategoryResponse[];
  categorySelectedCallback: (category: CategoryResponse | undefined) => void;
}

const CategorySelection = ({categories, categorySelectedCallback}: ICategorySelectionProps) => {
  const [selected, setSelected] = useState<CategoryResponse | undefined>(undefined);

  const isChecked = (id: number): boolean => {
    return selected?.id == id ?? false;
  }

  const handleSelect = (id: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (selected !== undefined) {
        if (selected.id !== id) {
          const found = categories.find(c => c.id === id)
          setSelected(found);
          categorySelectedCallback(found);
        }
      } else {
        const found = categories.find(c => c.id === id)
        setSelected(found);
        categorySelectedCallback(found);
      }
    } else {
      if (selected !== undefined && selected.id === id) {
        setSelected(undefined);
        categorySelectedCallback(undefined);
      }
    }
  }

  return(
    <Box w="100%" px="5%" mt="3">
      <Box my="5" borderColor="grey.800" borderTopWidth="3px" h="0%" />
      <Box w="100%" ml="2%">
        <Flex w="100%" direction="column">
          <Flex mb="3%" w="100%" alignItems="center">
            <Text color="gray" fontSize="30px">
              Kategóriák
            </Text>
          </Flex>
          <Flex w="100%" direction="column">
            {categories.map(c =>
              <Flex width="100%" key={`search_cat_${c.id}`}>
                <Checkbox
                  isChecked={isChecked(c.id)}
                  onChange={handleSelect(c.id)}
                  colorScheme="gray"
                >
                  <Text fontSize="20px">
                    {c.name}
                  </Text>
                </Checkbox>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

export default CategorySelection;
