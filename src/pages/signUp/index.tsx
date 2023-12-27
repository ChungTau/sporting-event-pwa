import {motion} from "framer-motion";
import Center from "../../components/Center";
import {fadeVariants} from "../../constants/animateVariant";

function SignUpPage() {

    return (
        <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
            duration: 0.5
        }}>
            <Center>Sign Up Page</Center>
        </motion.div>
    );
};

export default SignUpPage;