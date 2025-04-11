import { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Divider } from '@mui/material';
import api from '../api/axios';
import { Button } from '@mui/material';
import ChangePasswordDialog from '../components/ChangePasswordDialog';

interface User {
    username: string;
    email: string;
    createdAt: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState('');
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to load profile');
            }
        };
        fetchUserProfile();
    }, []);

    if (error) {
        return (
            <Container>
                <Typography color="error" align="center">{error}</Typography>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container>
                <Typography align="center">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Profile</Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                        <Typography variant="body1">{user.username}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{user.email}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
                        <Typography variant="body1">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => setIsChangePasswordOpen(true)}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>
                {isChangePasswordOpen && <ChangePasswordDialog
                    open={isChangePasswordOpen}
                    onClose={() => setIsChangePasswordOpen(false)}
                />
                }
            </Paper>
        </Container>
    );
};

export default Profile;