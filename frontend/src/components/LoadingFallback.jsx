import React from 'react';

const LoadingFallback = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'var(--color-background)',
            color: 'var(--color-text-primary)'
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid var(--glass-border)',
                borderTop: '4px solid var(--color-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{
                marginTop: '1rem',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem'
            }}>
                Carregando página...
            </p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingFallback;
