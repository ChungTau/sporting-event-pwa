import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrapper } from "../../components/Wrapper";
import Header from "./header";
import MapProvider from "../../providers/MapProvider";

function MainPage(){

    const pageVariants = {
        initial: { opacity: 0, x: -100 },
        enter: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 },
      };
    
      return (
        <div>
         <Header/>
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ type: 'linear', delay: 0.3, duration: 0.4 }}
          >
           <MapProvider>
           <Wrapper>
           <Outlet />
           </Wrapper>
           </MapProvider>
          </motion.div>
        </div>
      );
};

export default MainPage;