import { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/posts', formData);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New Post
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            margin="normal"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Create Post
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;