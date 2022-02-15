import React from "react";
import {RouteComponentProps, useHistory, withRouter} from "react-router-dom";
import {Box, Button, Flex, Popover, PopoverContent, PopoverTrigger, Tooltip} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt, faUserAlt} from "@fortawesome/free-solid-svg-icons";
import {cleanUser} from "../../services/helperFunctions";
import {loginRoute} from "../../constants/routeConstants";
import ModifyProfile from "../../components/user/ModifyProfile";

const AdminNavbar: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const history = useHistory();

  const logout = () => {
    cleanUser();
    history.push(loginRoute);
  };

  return(
    <Box  bg="blue.300">
      <Flex alignItems="center" justifyContent="flex-end" w="90%" mx="auto" >

        <Flex h="100px" w="10%" alignItems="center" ml="3%" >
          <Popover
            isLazy
            trigger="click"
          >
            <PopoverTrigger>

              <Button w="100%" h="100%" colorScheme="blue.300" _hover={{ bg: "blue.500" }} variant="solid">
                <FontAwesomeIcon
                  icon={faUserAlt}
                  size={"4x"}
                  color="white"
                />
              </Button>

            </PopoverTrigger>
            <PopoverContent minWidth="500px">
              <ModifyProfile />
            </PopoverContent>
          </Popover>
        </Flex>

        <Flex h="100px" w="10%" alignItems="center" >
          <Tooltip label="Kijelentkezés" fontSize="md" placement="left" >
            <Button w="100%" h="100%" onClick={logout} colorScheme="blue.300" _hover={{ bg: "blue.500" }} variant="solid">
              <FontAwesomeIcon
                icon={faSignOutAlt}
                size={"4x"}
                color="white"
              />
            </Button>
          </Tooltip>
        </Flex>

      </Flex>
    </Box>
  );
}

export default withRouter(AdminNavbar);
