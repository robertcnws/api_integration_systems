// src/auth/hooks/useResendTimer.ts
import { useState, useEffect, useCallback } from 'react';

import {
    RESEND_COOLDOWN_SECONDS,
    STORAGE_KEY_RESEND_COOLDOWN,
} from 'src/auth/context/jwt';

export function useResendTimer() {
    const [remaining, setRemaining] = useState(0);
    
    useEffect(() => {
        const stored = sessionStorage.getItem(STORAGE_KEY_RESEND_COOLDOWN);
        if (!stored) return;
        const expiresAt = new Date(stored).getTime();
        const delta = expiresAt - Date.now();
        if (delta > 0) {
            setRemaining(Math.ceil(delta / 1000));
        } else {
            sessionStorage.removeItem(STORAGE_KEY_RESEND_COOLDOWN);
        }
    }, []);
    
    useEffect(() => {
        let intervalId = null;

        if (remaining > 0) {
            intervalId = setInterval(() => {
                setRemaining((prev) => {
                    if (prev <= 1) {
                        sessionStorage.removeItem(STORAGE_KEY_RESEND_COOLDOWN);
                        clearInterval(intervalId);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [remaining]);
    
    const start = useCallback(() => {
        const expiresAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
        sessionStorage.setItem(
            STORAGE_KEY_RESEND_COOLDOWN,
            new Date(expiresAt).toISOString()
        );
        setRemaining(RESEND_COOLDOWN_SECONDS);
    }, []);

    return {
        remaining,                
        canResend: remaining === 0,
        start,                    
    };
}
