import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Divider, Button, TextField, IconButton } from '@mui/material';
import api from '../api/axios';
import { Delete as DeleteIcon, Edit } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

    // Add new state for comment deletion dialog
    const [deleteCommentDialog, setDeleteCommentDialog] = useState<{ open: boolean; commentId: string | null }>({
        open: false,
        commentId: null
    });
    
    // Update the delete comment handler
    const handleDeleteComment = async () => {
        try {
            if (deleteCommentDialog.commentId) {
                await api.delete(`/comments/${deleteCommentDialog.commentId}`);
                fetchComments();
                setDeleteCommentDialog({ open: false, commentId: null });
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to delete comment');
        }
    };

    const handleDeletePost = async () => {
        try {
            await api.delete(`/posts/${id}`);
            setDeleteDialogOpen(false);
            navigate('/');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to delete post');
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h4" gutterBottom>
                                {post.title}
                            </Typography>
                            {(userId === post.author._id) && (
                                <Box>
                                    <IconButton
                                        color="primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        < Edit />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        onClick={() => setDeleteDialogOpen(true)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>

                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ whiteSpace: 'pre-wrap' }}>
                            <Typography variant="body1">{post.content}</Typography>
                        </Box>
                    </>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Delete Post</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleDeletePost} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

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
                        <Paper key={comment._id} sx={{ p: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <Typography variant="body1">{comment.text}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        By {comment.author.username} • {new Date(comment.createdAt).toLocaleDateString()}
                                    </Typography>
                                </div>
                                {(userId === comment.author || userId === post.author._id) && (
                                    <IconButton
                                        size="small"
                                        onClick={() => setDeleteCommentDialog({ open: true, commentId: comment._id })}
                                        sx={{ ml: 1 }}
                                        color='error'
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                        </Paper>
                    ))}

                    {/* Add Comment Delete Confirmation Dialog */}
                    <Dialog
                        open={deleteCommentDialog.open}
                        onClose={() => setDeleteCommentDialog({ open: false, commentId: null })}
                    >
                        <DialogTitle>Delete Comment</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this comment? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteCommentDialog({ open: false, commentId: null })}>
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteComment} color="error" variant="contained">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Paper>
        </Container>
    );
};

export default PostDetail;