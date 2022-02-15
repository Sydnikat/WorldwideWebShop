import React, {useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import AuthenticatedLayout from "../../layout/AuthenticatedLayout";
import {Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import InventoryMain from "../../components/inventory/InventoryMain";
import {InventoryContextProvider} from "../../providers/InventoryContext";
import DiscountMain from "../../components/discount/DiscountMain";

const AdminMainPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [reloadInventory, setReloadInventory] = useState<boolean>(false)
  const [reloadDiscounts, setReloadDiscounts] = useState<boolean>(false)

  const onTabChanged = (index: number) => {
    switch (index) {
      case 0: setReloadInventory(true); break;
      case 1: setReloadDiscounts(true); break;
      default: break;
    }
  }

  const resetReloadInventory = () => setReloadInventory(false);
  const resetReloadDiscounts = () => setReloadDiscounts(false);

  return(
    <AuthenticatedLayout>
      <Box mx="3%" mt="3%" w="94%" borderWidth="1px" borderRadius="lg" overflow="hidden" bg="#fafafa" boxShadow="sm" pb="4" mb="1">
        <Flex alignItems="center" justifyContent="start"  mx="auto" w="90%" mt="2%" grow={1}>

          <Flex w="100%" alignItems="center" borderWidth={1}>
            <Tabs w="100%" isFitted={true} variant='enclosed' defaultIndex={0} onChange={onTabChanged}>
              <TabList>
                <Tab>Raktár</Tab>
                <Tab>Akciók</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <InventoryMain reload={reloadInventory} dispatchReloaded={resetReloadInventory} />
                </TabPanel>
                <TabPanel>
                  <DiscountMain reload={reloadDiscounts} dispatchReloaded={resetReloadDiscounts} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>


        </Flex>
      </Box>
    </AuthenticatedLayout>
  );
}

export default AdminMainPage;
