import styled from "@emotion/styled";
import {motion} from "framer-motion";
import Column from "../../../../components/Column";
import Row from "../../../../components/Row";
import {Divider, Text} from "@chakra-ui/react";

const DetailsBoxStyled = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  padding: 8px 16px 8px 16px;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
`;

export interface PointDetails{
    lng: number;
    lat: number;
    address: string;
    name: string;
}

export const DetailsBox:React.FC <PointDetails> = ({lat, lng, address, name}) => (
    <DetailsBoxStyled
        initial={{
        x: '100%'
    }}
        animate={{
        x: 0
    }}
        exit={{
        x: '100%'
    }}
        transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20
    }}>

        <Column>
            <Row gap={5} justifyContent={'space-between'} alignItems={'baseline'}>
                <Text fontSize={'small'} fontWeight={600} color={'white'}>{name}</Text>
                <Text fontSize={'x-small'} textAlign={'right'} color={'white'}>{`${
                        lng
                        .toFixed(6)}, ${lat
                        .toFixed(6)}`}</Text>
            </Row>
            <Divider/>
            <Text fontSize={'x-small'} color={'white'}>{address}</Text>
        </Column>
    </DetailsBoxStyled>
);