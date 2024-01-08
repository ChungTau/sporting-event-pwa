// FlexItem.tsx
import React from "react";
import { Flex, Divider, Text } from "@chakra-ui/react";

interface InfoItemProps {
  label: string;
  value: string;
  isMobile?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, isMobile }) => (
  <Flex
    py={1}
    px={isMobile ? 2 : 4}
    borderRadius={4}
    overflowX={"hidden"}
    minW={"102px"}
    bgColor={"whiteAlpha.300"}
    flexDirection={"column"}
    flex={1}
  >
    <Text fontWeight={500} fontSize={"medium"}>
      {value}
    </Text>
    <Divider />
    <Text fontSize={"small"}>{label}</Text>
  </Flex>
);

export default InfoItem;
