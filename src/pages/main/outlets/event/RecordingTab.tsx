import {motion} from "framer-motion";
import {tabVariants} from "../../../../constants/animateVariant";
import Column from "../../../../components/Column";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import {Text} from "@chakra-ui/react";
import { TabProps } from ".";

const RecordingTab = ({event}:TabProps) => {
    return (
        <motion.div
            key="parti"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={tabVariants}
            transition={{ duration: 0.5 }}>
            <Column gap={4}>
                <Column
                    p={4}
                    gap={4}
                    bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                    borderRadius="12px"
                    color={'white'}
                    position="relative">
                    <Text fontSize={'larger'} fontWeight={600}>Recording</Text>
                </Column>
            </Column>
        </motion.div>
    );
};

export default RecordingTab;