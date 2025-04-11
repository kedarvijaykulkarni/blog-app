import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Divider, Button, TextField, IconButton } from '@mui/material';
import api from '../api/axios';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        username: string;
        _id: string;
    };
    createdAt: string;
}

interface Comment {
    _id: string;
    text: string;
    author: {
        username: string;
    };
    createdAt: string;
}

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({ title: '', content: '' });

    const token = localStorage.getItem('token');
    const userId = token ? JSON.parse(atob(token.split('.')[1]))._id : null;

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            setPost(response.data);
            setEditedPost({
                title: response.data.title,
                content: response.data.content
            });
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to load post');
        }
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(`/comments/${id}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/comments', {
                postId: id,
                text: newComment
            });
            setNewComment('');
            fetchComments();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to post comment');
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/posts/${id}`, editedPost);
            setIsEditing(false);
            fetchPost();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update post');
        }
    };

    // Add deleteComment function inside PostDetail component
    const handleDeleteComment = async (commentId: string) => {
        try {
            await api.delete(`/comments/${commentId}`);
            fetchComments();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to delete comment');
        }
    };

    if (error) {
        return (
            <Container>
                <Typography color="error" align="center">{error}</Typography>
            </Container>
        );
    }

    if (!post) {
        return (
            <Container>
                <Typography align="center">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                {isEditing ? (
                    <Box component="form" onSubmit={handleEditSubmit}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={editedPost.title}
                            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Content"
                            multiline
                            rows={6}
                            value={editedPost.content}
                            onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                            margin="normal"
                        />
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button variant="contained" type="submit">Save</Button>
                            <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                        {(userId === post.author._id) && (
                            <Button
                                variant="outlined"
                                onClick={() => setIsEditing(true)}
                                sx={{ mb: 2 }}
                            >
                                Edit Post
                            </Button>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ whiteSpace: 'pre-wrap' }}>
                            <Typography variant="body1">{post.content}</Typography>
                        </Box>
                    </>
                )}

                {/* Comments Section */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>Comments</Typography>
                    {token ? (
                        <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Add a comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                margin="normal"
                            />
                            <Button variant="contained" type="submit" sx={{ mt: 1 }}>
                                Post Comment
                            </Button>
                        </Box>
                    ) : (
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Please login to comment
                        </Typography>
                    )}

                    {comments.map((comment) => (


                        // Update the comment rendering section
                        <Paper key={comment._id} sx={{ p: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <Typography variant="body1">{comment.text}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        By {comment.author.username} • {new Date(comment.createdAt).toLocaleDateString()}
                                    </Typography>
                                </div>
                                {(userId === comment.author || userId === post.author) && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteComment(comment._id)}
                                        sx={{ ml: 1 }}
                                        color='error'
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default PostDetail;