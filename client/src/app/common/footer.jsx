import React from 'react';

const Footer = () => {
    return (
        <footer className="grey lighten-4 black-text"
            style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                borderTop: '0.1px solid #999',
                maxHeight: '20px'
            }}>
            <span style={{ fontSize: '0.8rem' }}>
                © 2019. Desenvolvido por Agência de Desenvolvimento da RMBH.
            </span>
        </footer>
    )
}

export default Footer;