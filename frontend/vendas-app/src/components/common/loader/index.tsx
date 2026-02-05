import React from "react";

interface LoaderProps {
    show: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ show }) => {
    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(4px)' // Efeito de vidro moderno
        }}>
            <div className="flex flex-col items-center">
                <div className="lds-spinner">
                    {[...Array(12)].map((_, i) => <div key={i}></div>)}
                </div>
                <p className="mt-4 text-blue-600 font-semibold animate-pulse">
                    Carregando...
                </p>
            </div>
        </div>
    );
};