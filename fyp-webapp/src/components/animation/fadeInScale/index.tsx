import {motion} from 'framer-motion';
import React from 'react';

export const FadeInScale : React.FC < FadeInScaleProps > = ({
    children,
    duration = 0.5,
    initialScale = 0.95
}) => {
    const variants = {
        hidden: {
            opacity: 0,
            scale: initialScale
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: duration
            }
        }
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={variants}>
            {children}
        </motion.div>
    );
};
