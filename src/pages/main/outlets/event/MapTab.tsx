import {motion} from "framer-motion";
import {tabVariants} from "../../../../constants/animateVariant";
import Column from "../../../../components/Column";

import AnimationProvider from "../../../../providers/AnimationProvider";
import { useMap } from "../../../../contexts/MapContext";
import { hongKongCoordinates } from "../../../../constants/map";
import React from "react";
const BaseMap = React.lazy(() => import ('../../../../components/BaseMap'));
const MapTab = () => {
    const map = useMap();
    return (
        <motion.div
            key="map"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={tabVariants}
            transition={{
            duration: 0.5
        }}>
            <Column>
            <AnimationProvider>
            
                        <BaseMap
                            ref={map.mapRef}
                            center={hongKongCoordinates}
                            zoom={17}
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '500px',
                                borderRadius: '12px'
                            }}
                        />

                    </AnimationProvider>
            </Column>
        </motion.div>
    );
};

export default MapTab;