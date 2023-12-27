import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";


export const Wrapper = styled(Box)({
    position: 'relative',
    maxWidth: '1450px',
    margin: 'auto',
    padding: '4.6rem',
    overflow: 'hidden',
    '@media (max-width:960px)':{
        padding: '3.6rem'
    },
    '@media (max-width:600px)':{
        padding: '0.6rem'
    }
});