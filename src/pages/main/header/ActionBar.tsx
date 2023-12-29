import {
    HStack,
    Button,
    Menu,
    IconButton,
    MenuButton,
    MenuItem,
    MenuList,
    useBreakpointValue,
    MenuGroup,
    MenuDivider
} from "@chakra-ui/react";

import {IoMenu} from "react-icons/io5";
import {IoLogOut} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {setLoggedIn} from "../../../store/authSlice";
import Row from "../../../components/Row";
import {RouteConfig, mainOutlet, routes, userOutlet} from "../../../constants/routes";
import {COLOR_PRIMARY_RGB, COLOR_SECONDARY, COLOR_SECONDARY_LIGHT} from "../../../constants/palatte";

type HandleNavigationFunction = (path: string) => void;

interface MenuProps {
    handleNavigation: HandleNavigationFunction;
}

const menuItemStyle = {
    bg: 'transparent',
    _hover: {
        bg: `rgba(${COLOR_PRIMARY_RGB}, 0.3)`,
        color: 'white'
    },
    color: 'white',
    fontSize: '14px'
};

const menuGroupStyle = {
    marginX: '0.8rem',
    fontWeight: 600,
    color: 'gray.100',
};

const createMenuItem = (route:RouteConfig, handleNavigation:HandleNavigationFunction) => (
    <MenuItem
        {...menuItemStyle}
        icon={route.icon ? <route.icon /> : undefined}
        onClick={() => handleNavigation(route.path || '#')}
        key={route.name}>
        {route.name}
    </MenuItem>
);

const MobileMenu: React.FC<MenuProps> = ({ handleNavigation }) => (
    <>
        <MenuGroup {...menuGroupStyle} title="Pages">
            {Object.entries(mainOutlet).map(([key, route]) => createMenuItem(route, handleNavigation))}
        </MenuGroup>
        <MenuDivider my={4} />
        <MenuGroup {...menuGroupStyle} title="User">
            {Object.entries(userOutlet).map(([key, route]) => createMenuItem(route, handleNavigation))}
        </MenuGroup>
    </>
);

const DesktopMenu: React.FC<MenuProps> = ({ handleNavigation }) => {
    return(<>{Object.entries(userOutlet).map(([key, route]) => createMenuItem(route, handleNavigation))}</>);
};


const ActionBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useBreakpointValue({base: true, md: false});
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
                            _active={{
                            bgColor: 'blackAlpha.400'
                        }}
                            _hover={{
                            bgColor: 'blackAlpha.200'
                        }}
                            aria-label='Options'
                            icon={< IoMenu />}
                            variant='outline'/>
                        <MenuList
                            mt={2}
                            px={4}
                            bg={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                            backdropFilter={'blur(4px)'}>
                            {isMobile ? (
                            <MobileMenu handleNavigation={handleNavigation} />
                        ) : (
                            <DesktopMenu handleNavigation={handleNavigation} />
                        )}
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