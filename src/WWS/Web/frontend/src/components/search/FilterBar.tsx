import {Box, Checkbox, Divider, Flex, Select} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {Sorting} from "../../types/enum/SortingDirection";
import {CategoryResponse} from "../../types/dto/Category";
import {homeRoute} from "../../constants/routeConstants";
import NumberInputRange from "../input/NumberInputRange";

enum ListingFilter {
  STOCK,
  ALL
}

interface FilterBarProps {
  minPrice: number;
  maxPrice: number;
  setCurrentPriceRange: (v: number[] | undefined) => void;
  setSorting: (v: Sorting) => void;
  setShowOnlyStock: (v: boolean) => void;
}

const FilterBar = (props: FilterBarProps) => {
  const {
    setShowOnlyStock,
    minPrice,
    maxPrice,
    setCurrentPriceRange,
    setSorting,
  } = props;

  const [showAllItems, setShowAllItems] = useState<boolean>(true);
  const [showHasStock, setShowHasStock] = useState<boolean>(false);
  const [currentRange, setCurrentRange] = useState<number[]>([minPrice, maxPrice]);

  useEffect(() => {
    setCurrentRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);


  const handleInputRangeChange = (
    setter: (v: number[] | undefined) => void,
    callback: (v: number[]) => void
  ) => (v: number[]) => {
    (v[0] === minPrice && v[1] === maxPrice) ? setter(undefined) : setter(v);
    callback(v);
  }

  const onSearchOrderingSelectChange = async (e:  React.ChangeEvent<HTMLSelectElement>) => {
    const idStr = e.currentTarget.value;
    const sorting = parseInt(idStr, 10) as Sorting;
    setSorting(sorting);
  }

  const onCheckBoxChange = (l: ListingFilter) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (l) {
      case ListingFilter.ALL: {
        if (event.target.checked) {
          setShowAllItems(true);
          setShowOnlyStock(false);
          setShowHasStock(false);
        } else {
          setShowAllItems(false);
          setShowOnlyStock(true);
          setShowHasStock(true);
        }
      } break;
      case ListingFilter.STOCK: {
        if (event.target.checked) {
          setShowAllItems(false);
          setShowOnlyStock(true);
          setShowHasStock(true);
        } else {
          setShowAllItems(true);
          setShowOnlyStock(false);
          setShowHasStock(false);
        }
      } break;
    }
  };

  return(
    <Box
      width="100%"
    >
      <Flex width="100%" alignItems="center" justifyContent="start" >
        <Flex width="25%" ml="2%">
          <Flex width="50%">
            <Checkbox isChecked={showHasStock} onChange={onCheckBoxChange(ListingFilter.STOCK)}>
              Készleten
            </Checkbox>
          </Flex>
          <Flex width="50%">
            <Checkbox isChecked={showAllItems} onChange={onCheckBoxChange(ListingFilter.ALL)}>
              Összes termék
            </Checkbox>
          </Flex>
        </Flex>

        <Flex width="1%" height="50px" my="2">
          <Divider orientation="vertical"/>
        </Flex>

        <Flex width="48%" px="2%">
          <NumberInputRange
            min={minPrice}
            max={maxPrice}
            currentRange={currentRange}
            setCurrentRange={handleInputRangeChange(setCurrentPriceRange, setCurrentRange)}
            unitOfMeasure={"Ft"}
          />
        </Flex>

        <Flex width="1%" height="50px" my="2">
          <Divider orientation="vertical"/>
        </Flex>

        <Flex width="25%" mr="2%">
          <Select
            my="2"
            size="lg"
            defaultValue={Sorting.UNSORTED}
            borderRadius="full"
            borderWidth="1"
            onChange={onSearchOrderingSelectChange}
            bg="#fafafa"
          >
            <option key={`ordering_s_u`} value={Sorting.UNSORTED}>Nincs rendezés</option>
            <option key={`ordering_s_d`} value={Sorting.SCORE_DESC}>Népszerű Termék elöl</option>
            <option key={`ordering_p_d`} value={Sorting.PRICE_DESC}>Ár szerint csökkenő</option>
            <option key={`ordering_p_a`} value={Sorting.PRICE_ASC}>Ár szerint növekvő</option>
          </Select>
        </Flex>
      </Flex>
    </Box>
  )
}

export default FilterBar;
