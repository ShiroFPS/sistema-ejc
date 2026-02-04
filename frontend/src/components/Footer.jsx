import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p className={styles.text}>
                Created by{' '}
                <a
                    href="https://astrumtech.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Astrum Tech
                </a>
            </p>
        </footer>
    );
};

export default Footer;
