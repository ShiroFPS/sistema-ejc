import React from 'react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    type = 'button',
    onClick,
    as: Component = 'button',
    ...props
}) => {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
    ].filter(Boolean).join(' ');

    return (
        <Component
            type={Component === 'button' ? type : undefined}
            className={classNames}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Button;
