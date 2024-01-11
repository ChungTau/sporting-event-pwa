import {motion} from "framer-motion";
import {FaUser} from "react-icons/fa";
import {FaEarthAmericas} from "react-icons/fa6";
import { IoMdPin } from "react-icons/io";
import Column from "../../../../components/Column";
import Row from "../../../../components/Row";
import {COLOR_PRIMARY_RGB} from "../../../../constants/palatte";
import {tabVariants} from "../../../../constants/animateVariant";
import {Text} from "@chakra-ui/react";
import {useState} from "react";

const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem" +
        " Ipsum has been the industry's standard dummy text ever since the 1500s, when an" +
        " unknown printer took a galley of type and scrambled it to make a type specimen " +
        "book. It has survived not only five centuries, but also the leap into electronic" +
        " typesetting, remaining essentially unchanged. It was popularised in the 1960s w" +
        "ith the release of Letraset sheets containing Lorem Ipsum passages, and more rec" +
        "ently with desktop publishing software like Aldus PageMaker including versions o" +
        "f Lorem Ipsum."; // Your full description text

const AboutTab = () => {
    const [showFullText,
        setShowFullText] = useState(false);
    const displayText = showFullText
        ? description
        : `${description.substring(0, 280)}... `;
    return (
        <motion.div
            key="about"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={tabVariants}
            transition={{
            duration: 0.5
        }}>
            <Column gap={4}>
                <Column
                    p={4}
                    gap={4}
                    bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                    borderRadius="12px"
                    color={'white'}
                    position="relative">
                    <Text fontSize={'larger'} fontWeight={600}>Details</Text>
                    <Column>
                        <Row alignItems={'center'}>
                            <FaUser color="#bcbcbc"/>
                            <Text>
                                Hosted by HKUST
                            </Text>
                        </Row>
                        <Row alignItems={'center'}>
                            <IoMdPin color="#bcbcbc"/>
                            <Text>
                                Fok Ying Tung Sports Center
                            </Text>
                        </Row>
                        <Row alignItems={'center'}>
                            <FaEarthAmericas color="#bcbcbc"/>
                            <Text>
                                Public · Anyone on or off Sport Event PWA
                            </Text>
                        </Row>
                        
                        <Text>
                            {displayText}
                            {!showFullText && (
                                <Text
                                    as="span"
                                    color={'blackAlpha.600'}
                                    fontWeight={500}
                                    cursor="pointer"
                                    onClick={() => setShowFullText(true)}>
                                    {"  See more"}
                                </Text>
                            )}
                            {showFullText && (
                                <Text
                                    as="span"
                                    color={'blackAlpha.600'}
                                    fontWeight={500}
                                    cursor="pointer"
                                    onClick={() => setShowFullText(false)}>
                                    {"  See less"}
                                </Text>
                            )}
                        </Text>
                    </Column>
                </Column>
                <Column
                    p={4}
                    gap={4}
                    bgColor={`rgba(${COLOR_PRIMARY_RGB}, 0.7)`}
                    borderRadius="12px"
                    color={'white'}
                    position="relative">
                    <Text fontSize={'larger'} fontWeight={600}>Guest</Text>

                </Column>
            </Column>
        </motion.div>
    );
};

export default AboutTab;