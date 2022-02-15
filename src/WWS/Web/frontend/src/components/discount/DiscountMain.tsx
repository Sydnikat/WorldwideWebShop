import React, {Fragment, useEffect, useState} from "react";
import {Box, Divider, Flex, Select, Spinner, Text} from "@chakra-ui/react";
import {useQuery} from "react-query";
import {WWSError} from "../../types/dto/Error";
import {getDiscounts} from "../../services/queries";
import {DiscountResponse} from "../../types/dto/Discount";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import {AddIcon, ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import DiscountRow from "./DiscountRow";
import CreateDiscountButton from "./CreateDiscountButton";

interface IDiscountMainProps {
  reload: boolean;
  dispatchReloaded: () => void;
}

const DiscountMain = ({reload, dispatchReloaded}: IDiscountMainProps) => {
  const [page, setPage] = useState<number>(0);
  const items_per_page = 5;

  const { data: discounts, refetch } = useQuery<DiscountResponse[], WWSError>(
    'discounts',
    () => getDiscounts({page: page, number_per_page: items_per_page}),
  );

  useEffect(() => {
    if (reload) {
      refetch();
      dispatchReloaded();
    }
  }, [reload]);

  useEffect(() => {
    refetch();
  }, [page]);

  const increasePageNumber = () => {
    if (discounts?.length === items_per_page) {
      setPage(page + 1);
    }
  }

  const decreasePageNumber = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  }

  if (discounts === undefined || reload) {
    return(
      <AuthenticatedLayout>
        <Flex alignItems="center" justifyContent="center" mx="auto">
          <Spinner size="xl" />
        </Flex>
      </AuthenticatedLayout>
    )
  }

  return(
    <Flex w="100%" alignItems="center">
      <Flex grow={1} direction="column" borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" boxShadow="sm">

        <Flex w="auto" h="50px" alignItems="center" overflow="hidden">
          <Flex width="85%" h="100%" alignItems="center" mr="2%">
            <Flex width="25%" h="100%" alignItems="center" ml="2%">
              <Text>
                <b>Akciók</b>
              </Text>
            </Flex>
            <Flex alignItems="center" w="25%" flexDirection="row-reverse">
              <Text>
                <b>Akció kezdete</b>
              </Text>
            </Flex>
            <Flex alignItems="center" w="25%" flexDirection="row-reverse">
              <Text>
                <b>Akció vége</b>
              </Text>
            </Flex>
            <Flex alignItems="center" w="25%" flexDirection="row-reverse">
              <Text>
                <b>Leárazás</b>
              </Text>
            </Flex>
          </Flex>
          <Flex width="15%" h="100%" alignItems="center">
            <Flex py="1" w="35%" mr="2" ml="auto">
              <CreateDiscountButton />
            </Flex>
          </Flex>
        </Flex>

        <Divider />

        <Flex grow={1} direction="column">
          {discounts.map(d =>
            <Fragment key={`discount_row${d.id}`}>
              <DiscountRow discount={d} />
            </Fragment>
          )}
          {discounts.length === 0 ?
            <Flex alignItems="center" justifyContent="center" mx="auto" mt="4">
              <Text size="lg" color="grey">
                Jelenleg nincsenek akciók...
              </Text>
            </Flex>
            : null}
        </Flex>

        <Flex alignItems="center" justifyContent="center" grow={1} mx="auto" w="70%" h="15%">

          <Box as="button" py="1%" w="10%" mr="2" borderRadius="full" _hover={{backgroundColor: "#e9e9e9"}} bg="#fafafa">
            <div onClick={decreasePageNumber}>
              <ArrowLeftIcon />
            </div>
          </Box>
          <Flex>
            {page + 1}
          </Flex>
          <Box as="button" py="1%" w="10%" ml="2" borderRadius="full" _hover={{backgroundColor: "#e9e9e9"}} bg="#fafafa">
            <div onClick={increasePageNumber}>
              <ArrowRightIcon />
            </div>
          </Box>

        </Flex>
      </Flex>
    </Flex>
  )
}

export default DiscountMain;
