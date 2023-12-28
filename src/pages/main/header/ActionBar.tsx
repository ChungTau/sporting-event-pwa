import {
    HStack,
    Button,
    Menu,
    IconButton,
    MenuButton,
    MenuItem,
    MenuList
} from "@chakra-ui/react";

import {IoMenu} from "react-icons/io5";
import {IoLogOut} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setLoggedIn} from "../../../store/authSlice";
import Row from "../../../components/Row";
import {routes, userOutlet} from "../../../constants/routes";
import {COLOR_PRIMARY_RGB, COLOR_SECONDARY, COLOR_SECONDARY_LIGHT} from "../../../constants/palatte";

const menuItemStyle = {
    bg: 'transparent',
    _hover: {
        bg: `rgba(${COLOR_PRIMARY_RGB}, 0.3)`,
        color: 'white'
    }
};

const ActionBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state : RootState) => state.authenticated.isLoggedIn);

    const handleNavigation = (path : string) => {
        navigate(path);
    };

    const handleLogout = () => {
        navigate('/');
        setTimeout(() => dispatch(setLoggedIn(false)), 800);
    };

    return (
        <HStack>
            {isLoggedIn
                ? (
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            color={'white'}
                            _active={{bgColor:'blackAlpha.500'}}
                            _hover={{bgColor:'blackAlpha.200'}}
                            aria-label='Options'
                            icon={< IoMenu/>}
                            variant='outline'/>
                        <MenuList
                            mt={2}
                            bg={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                            backdropFilter={'blur(4px)'}>
                            {Object
                                .entries(userOutlet)
                                .map(([key, route]) => (
                                    <MenuItem
                                        {...menuItemStyle}
                                        icon={route.icon
                                        ? <route.icon/>
                                        : undefined}
                                        onClick={() => handleNavigation(route.path || '#')}
                                        key={key}>
                                        {route.name}
                                    </MenuItem>
                                ))}
                            <MenuItem {...menuItemStyle} icon={< IoLogOut />} onClick={handleLogout}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )
                : (
                    <Row>
                        <Button onClick={() => handleNavigation(routes.SIGNUP.path)}>{routes.SIGNUP.name}</Button>
                        <Button
                            color={'white'}
                            bgColor={COLOR_SECONDARY}
                            _hover={{
                            bgColor: COLOR_SECONDARY_LIGHT
                        }}
                            onClick={() => handleNavigation(routes.SIGNIN.path)}>{routes.SIGNIN.name}</Button>
                    </Row>
                )}
        </HStack>
    );
}

export default ActionBar;