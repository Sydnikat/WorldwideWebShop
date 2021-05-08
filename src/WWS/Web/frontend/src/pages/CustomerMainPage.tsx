import React  from "react";
import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import {Box, Grid, GridItem} from "@chakra-ui/react";
import ItemCard from "../components/ItemCard";

const CustomerMainPage = () => {
  return(
    <Box>
      <AuthenticatedLayout>
        <Grid
          mx="auto"
          border="1px" borderColor="red"
          templateColumns="repeat(5, 1fr)"
          gap="1em"
        >
          {Array(12)
            .fill("")
            .map((_, i) => (
              <GridItem key={i}>
                <ItemCard />
              </GridItem>
            ))}
        </Grid>
      </AuthenticatedLayout>
    </Box>
  );
}

export default CustomerMainPage;
