import {Image} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../constants/routes";

const Logo=()=>{
    const navigate = useNavigate();
    return(
        <Image src={'/logo192.png'} h="40px" onClick={()=>navigate(routes.MAIN.path)} cursor={'pointer'} />
    );
};

export default Logo;