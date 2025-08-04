// src/components/code-input.jsx
import { useRef } from 'react';

import { Box, TextField } from '@mui/material';

export function VerificationCodeInput({ value, onChange, name = 'verificationCode', length = 6 }) {
    const inputsRef = useRef([]);

    const handleChange = (index, e) => {
        const raw = e.target.value.replace(/\D/, '');
        const newValue = value.split('');

        if (!raw) {
            newValue[index] = '';
            onChange(newValue.join(''));
            return;
        }

        newValue[index] = raw;
        onChange(newValue.join(''));

        if (index < length - 1) {
            inputsRef.current[index + 1].focus();
            inputsRef.current[index + 1].select();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();  
            const newValue = value.split('');

            if (value[index]) {
                newValue[index] = '';
                onChange(newValue.join(''));
                inputsRef.current[index].focus();
                inputsRef.current[index].select();
            } else if (index > 0) {
                newValue[index - 1] = '';
                onChange(newValue.join(''));
                inputsRef.current[index - 1].focus();
                inputsRef.current[index - 1].select();
            }
        }
    };

    return (
        <Box display="flex" gap={2} justifyContent="center">
            {Array.from({ length }).map((_, i) => (
                <TextField
                    key={i}
                    inputRef={(el) => {
                        inputsRef.current[i] = el;
                    }}
                    value={value[i] || ''}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onClick={(e) => {
                        e.target.select();
                    }}
                    inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 24 } }}
                    sx={{ width: 48 }}
                />
            ))}
        </Box>
    );
}
