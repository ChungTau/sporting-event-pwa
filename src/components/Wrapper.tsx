import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";


export const Wrapper = styled(Box)({
    position: 'relative',
    maxWidth: '1300px',
    margin: 'auto',
    padding: '1.6rem 2.4rem 1.6rem 2.4rem',
    '@media (max-width:960px)':{
        padding: '1.2rem 2.0rem 1.2rem 2.0rem',
    },
    '@media (max-width:600px)':{
        padding: '1.2rem 0.8rem 1.2rem 0.8rem',
    }
});