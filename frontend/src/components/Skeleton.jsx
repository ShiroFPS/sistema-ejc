import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius, className, style }) => {
    const customStyle = {
        width,
        height,
        borderRadius,
        ...style,
    };

    return (
        <div
            className={`${styles.skeleton} ${className || ''}`}
            style={customStyle}
        />
    );
};

export default Skeleton;
