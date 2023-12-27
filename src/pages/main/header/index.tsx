import { Flex, chakra } from "@chakra-ui/react";
import { motion } from 'framer-motion';
import Logo from "./Logo";
import PageNavigator from "./PageNavigator";
import ActionBar from "./ActionBar";

const MotionHeader = motion(chakra.header);

const Header = () => {

    const animationVariants = {
        hidden: { y:  -100, opacity: 0 },
        visible: {y: 0, opacity: 1 },
        exit: { y:  -100, opacity: 0}
    };

    return (
        <MotionHeader
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'linear', duration: 0.6 }}
            bg={'rgba(94, 78, 61,0.8)'}
            px={6}
            m={2}
            borderRadius={16}
        >
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Logo />
            <PageNavigator />
            <ActionBar />
          </Flex>
        </MotionHeader>
    );
};

export default Header;
