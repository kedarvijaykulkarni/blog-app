import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import api from '../api/axios';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog = ({ open, onClose }: ChangePasswordDialogProps) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await api.put('/users/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Password</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            margin="normal"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            margin="normal"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Change Password</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordDialog;