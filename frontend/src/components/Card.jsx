import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, className = '', hover = true, ...props }) => {
    const classNames = [
        styles.card,
        hover && styles.hover,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} {...props}>
            {children}
        </div>
    );
};

export default Card;
