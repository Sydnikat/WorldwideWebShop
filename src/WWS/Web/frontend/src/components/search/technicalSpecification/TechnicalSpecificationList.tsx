import {Box, Divider} from "@chakra-ui/react";
import React, {Fragment, useEffect, useState} from "react";
import {TechnicalSpecificationResponse} from "../../../types/dto/Category";
import {ItemResponse, TechnicalSpecInfoQueryRequest} from "../../../types/dto/InventoryItem";
import EnumListTechnicalSpecificationSelect from "./EnumListTechnicalSpecificationSelect";
import BooleanTechnicalSpecificationSelect from "./BooleanTechnicalSpecificationSelect";
import NumberTechnicalSpecificationSelect from "./NumberTechnicalSpecificationSelect";

interface ITechnicalSpecificationListProps {
  items: ItemResponse[];
  categorySpecs: TechnicalSpecificationResponse[];
  techSpecChangedCallback: (requests: TechnicalSpecInfoQueryRequest[]) => void;
}

const TechnicalSpecificationList = (props: ITechnicalSpecificationListProps) => {
  const {categorySpecs, techSpecChangedCallback, items} = props;
  const [enumListSpecInfoRequests, setEnumListSpecInfoRequests] = useState<TechnicalSpecInfoQueryRequest[]>([]);

  const handleEnumTechSpecSelectChangeCallback = (specId: number) => (requests: TechnicalSpecInfoQueryRequest[]) => {
    const others = enumListSpecInfoRequests.filter(info => info.stId !== specId);
    setEnumListSpecInfoRequests([...others, ...requests]);

    techSpecChangedCallback([...others, ...requests])
  }

  return(
    <Box
      width="100%"
    >
      {categorySpecs.filter(s => s.isEnumList).map(s =>
        <Fragment key={`techSpec_${s.id}`}>
          <Box w="100%" px="5%" mt="3">
            <EnumListTechnicalSpecificationSelect
              techSpec={s}
              techSpecChangedCallback={handleEnumTechSpecSelectChangeCallback(s.id)}
              items={items.filter(i => i.listOfTechnicalSpecInfo.find(si => si.technicalSpecificationId === s.id) !== undefined)}
            />
          </Box>
        </Fragment>
      )}

      {categorySpecs.filter(s => s.isBoolean).map(s =>
        <Fragment key={`techSpec_${s.id}`}>
          <Box w="100%" px="5%" mt="3">
            <BooleanTechnicalSpecificationSelect
              items={items.filter(i => i.listOfTechnicalSpecInfo.find(si => si.technicalSpecificationId === s.id) !== undefined)}
              techSpec={s}
              techSpecChangedCallback={handleEnumTechSpecSelectChangeCallback(s.id)}
            />
          </Box>
        </Fragment>
      )}

      {categorySpecs.filter(s => s.isNumber).map(s =>
        <Fragment key={`techSpec_${s.id}`}>
          <Box w="100%" px="5%" mt="3">
            <NumberTechnicalSpecificationSelect
              techSpec={s}
              techSpecChangedCallback={handleEnumTechSpecSelectChangeCallback(s.id)}
              items={items.filter(i => i.listOfTechnicalSpecInfo.find(si => si.technicalSpecificationId === s.id) !== undefined)}
            />
          </Box>
        </Fragment>
      )}
    </Box>
  );
}

export default TechnicalSpecificationList;
