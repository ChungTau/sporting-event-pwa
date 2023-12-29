import {motion} from "framer-motion";
import Center from "../../components/Center";
import {Button} from "@chakra-ui/react";
import {useDispatch} from "react-redux";
import {setLoggedIn} from "../../store/authSlice";
import {useNavigate} from "react-router-dom";
import {routes} from "../../constants/routes";
import {COLOR_SECONDARY, COLOR_SECONDARY_LIGHT} from "../../constants/palatte";
import {fadeVariants} from "../../constants/animateVariant";

function SignInPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignIn = () => {
        dispatch(setLoggedIn(true));
        const redirectPath = sessionStorage.getItem('redirectPath');
        if (redirectPath) {
            navigate(redirectPath);
            sessionStorage.removeItem('redirectPath');
        } else {
            navigate(routes.MAIN.path);
        }
    };

    return (
        <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
            duration: 0.5
        }}>
            <Center>
                <Button
                    color={'white'}
                    bgColor={COLOR_SECONDARY}
                    _hover={{
                    bgColor: COLOR_SECONDARY_LIGHT
                }}
                    onClick={handleSignIn}>{routes.SIGNIN.name}</Button>
            </Center>
        </motion.div>
    );
};

export default SignInPage;