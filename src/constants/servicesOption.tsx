import { OptionBase } from "chakra-react-select";
import { FaBowlFood, FaToiletPaper } from "react-icons/fa6";
import { MdLocalDrink } from "react-icons/md";
import { PiFirstAidKitFill } from "react-icons/pi";
import Row from "../components/Row";
import {Box, Text } from "@chakra-ui/react";
import { IconBase} from "react-icons/lib";

export interface ServiceOption extends OptionBase {
    label: React.ReactNode;
    value: string;
  }
  
  const serviceList: { value: string; icon: JSX.Element; label: React.ReactNode }[] = [
    { value: "food", icon: <FaBowlFood />, label: "Food" },
    { value: "drink", icon: <MdLocalDrink />, label: "Drink" },
    { value: "aid", icon: <PiFirstAidKitFill />, label: "Aid" },
    { value: "wc", icon: <FaToiletPaper />, label: "Toilet" },
  ];

  export const serviceOptions: ServiceOption[] = serviceList.map((service) => ({
    value: service.value,
    label: (
      <Row py={2} px={1} justifyContent={"center"} alignItems={"center"} gap={2}>
        <IconBase width={24} height={24}>{service.icon}</IconBase>
        <Text fontWeight={500}>{service.label}</Text>
      </Row>
    ),
  }));
  
  const iconMap: { [key: string]: JSX.Element } = serviceList.reduce(
    (acc, service) => ({
      ...acc,
      [service.value]: service.icon,
    }),
    {}
  );
  
  export const getServiceIcons = (services: string[]) => {
    return services.map((service, index) => (
      <Box key={index} display="inline-block" ml={2}>
        {iconMap[service]}
      </Box>
    ));
  };