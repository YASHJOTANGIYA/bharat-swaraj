import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
            navigate('/login?error=' + error);
            return;
        }

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));

                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Dispatch storage event to notify other components
                window.dispatchEvent(new Event('storage'));

                // Redirect to home
                navigate('/');
            } catch (err) {
                console.error('Error parsing user data:', err);
                navigate('/login?error=Authentication failed');
            }
        } else {
            navigate('/login?error=Authentication failed');
        }
    }, [navigate, searchParams]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontSize: '1.2rem',
            color: '#64748b'
        }}>
            Completing authentication...
        </div>
    );
};

export default GoogleCallback;
