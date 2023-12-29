import {HStack, Link as ChakraLink, Text, useBreakpointValue} from "@chakra-ui/react";
import {Link as RouterLink} from 'react-router-dom';
import {mainOutlet} from "../../../constants/routes";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {APP_NAME} from "../../../config/app";

const PageNavigator = () => {
    const isLoggedIn = useSelector((state : RootState) => state.authenticated.isLoggedIn);
    const pages = Object.values(mainOutlet);
    const isMobile = useBreakpointValue({ base: true, md: false });
    return ( 
        <> 
            <HStack as="nav" spacing="5">
                {!isMobile&&isLoggedIn
                    ? pages.map((route) => {
                        if (!route.isProtected || isLoggedIn) {
                            return (
                                <ChakraLink
                                    as={RouterLink}
                                    to={route.path || '#'}
                                    key={route.name}
                                    px={3}
                                    py={2}
                                    rounded={'md'}
                                    _hover={{
                                    textDecoration: 'none',
                                    bg: 'whiteAlpha.200'
                                }}>
                                    {route.name}
                                </ChakraLink>
                            );
                        }
                        return null;
                    })
                    : <Text>{APP_NAME}</Text>}
            </HStack> 
        </>
    );
}

export default PageNavigator;