import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button } from "@mui/material";

import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        username: string;
    };
    createdAt: string;
}

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <Container sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {posts.map((post) => (
                    <Grid
                        key={post._id}
                    >
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {post.content.substring(0, 100)}...
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    By {post.author.username}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={Link} to={`/post/${post._id}`}>
                                    Read More
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>

    );
};

export default Home;