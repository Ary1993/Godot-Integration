import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const AlertComponent = ({ show, message, variant = 'success', onClose }) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        setVisible(show);
    }, [show]);

    if (!visible) return null;

    return (
        <Alert variant={variant} onClose={() => {
            setVisible(false);
            if (onClose) onClose();
        }} dismissible>
            {message}
        </Alert>
    );
}

export default AlertComponent;