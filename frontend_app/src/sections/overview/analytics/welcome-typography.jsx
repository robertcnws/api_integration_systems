import { Typography } from '@mui/material';

export const WelcomeTypography = ({
    userLogged}) => (
    <Typography variant="h4" sx={{ mb: { xs: 1, md: 1 } }}>
        Hi {userLogged?.data.first_name || userLogged?.data.firstName} {userLogged?.data.last_name || userLogged?.data.lastName}, Welcome back 👋
    </Typography >
);