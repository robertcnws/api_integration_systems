
import { Button, Backdrop, Typography, CircularProgress } from '@mui/material';

export default function BackdropBackground({ loading, error, setError, component }) {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.modal + 1,
                flexDirection: 'column',
            }}
            open={loading || error !== null}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '32px',
                    borderRadius: '8px',
                    textAlign: 'center',
                }}
            >
                {loading ? (
                    <>
                        <CircularProgress color="inherit" />
                        <Typography variant="h6" style={{ marginTop: '16px' }}>
                            {component.includes('Loading') ? component : `Fetching ${component} updates...`}
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" style={{ marginBottom: '16px' }}>
                            {error}
                        </Typography>
                        <Button variant="contained" onClick={() => setError(null)}>
                            Close
                        </Button>
                    </>
                )}
            </div>
        </Backdrop>
    );
}