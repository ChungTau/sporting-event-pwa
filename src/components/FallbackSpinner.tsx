// FallbackSpinner.js
import { Center, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const FallbackSpinner = () => {
    const fadeInOutAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        
    };

    return (
        <motion.div
            variants={fadeInOutAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            transition= {{ duration: 1} }
        >
            <Center h="100vh">
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                />
            </Center>
        </motion.div>
    );
};

export default FallbackSpinner;
