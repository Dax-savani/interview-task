import React, {useEffect, useState} from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {
    Avatar, Box, Button, Card, CardContent, Container,
    Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, Slide, TextField, Typography, useTheme
} from "@mui/material";
import axiosInstance from "../../axiosInstance/axiosInstance";
import toast from "react-hot-toast";

function Home(props) {
    const theme = useTheme();
    const localStorData = JSON.parse(localStorage.getItem("user"));
    console.log(localStorData)
    const [ideas, setIdeas] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const fetchIdeas = async () => {
        try {
            const res = await axiosInstance.get("/ideas");
            setIdeas(res?.data?.ideas)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchIdeas()
    }, []);

    const handleVote = async (ideaId, voteType) => {
        try {
            const res = await axiosInstance.put(`/ideas/${ideaId}/vote`, { voteType });
            if(res.status == 200){
                fetchIdeas()
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleSubmitIdea = async () => {
        try {
            const res = await axiosInstance.post('/ideas', { title, description });

            if (res.status === 201) {
                toast.success('Idea added successfully!');
                fetchIdeas()
            }
            setOpenModal(false);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error submitting idea:', error);
            toast.error('Failed to add idea. Please try again.');
        }
    };


    return (
        <Container maxWidth="md">
            <Box mt={4} mb={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" component="h1" sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                    }}>
                        Community Ideas
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenModal(true)}
                    >
                        Add New Idea
                    </Button>
                </Box>

                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={Slide}
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: 4,
                            overflow: 'visible',
                            background: theme.palette.background.paper,
                        }
                    }}
                >


                    <DialogContent sx={{ pt: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Idea Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{
                                        sx: {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main }
                                        }
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontWeight: 500,
                                            color: theme.palette.text.secondary
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Describe Your Idea"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    InputProps={{
                                        sx: {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main }
                                        }
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontWeight: 500,
                                            color: theme.palette.text.secondary
                                        }
                                    }}
                                />
                    </DialogContent>

                    <DialogActions sx={{
                        px: 3,
                        pb: 3,
                        '& > :not(style)': {
                            m: 0.5,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            letterSpacing: 0.5
                        }
                    }}>
                        <Button
                            onClick={() => setOpenModal(false)}
                            variant="outlined"
                            sx={{
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    bgcolor: theme.palette.action.hover
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitIdea}
                            variant="contained"
                            sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-1px)',
                                    transition: 'all 0.2s ease'
                                }
                            }}
                        >
                            Ignite Idea
                        </Button>
                    </DialogActions>
                </Dialog>

                {ideas?.map((idea) => (
                    <Card key={idea?._id} sx={{
                        mb: 3,
                        borderRadius: 4,
                        boxShadow: 3,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 6
                        }
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{bgcolor: theme.palette.primary.main, mr: 2}}>
                                    {idea.author?.charAt(0) || 'U'}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="500">
                                        {idea.author || 'Anonymous'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(idea.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="h6" component="h2" gutterBottom sx={{fontWeight: 600}}>
                                {idea?.title}
                            </Typography>

                            <Typography variant="body1" color="text.secondary" paragraph>
                                {idea?.description}
                            </Typography>

                            <Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>

                                <IconButton
                                    onClick={() => handleVote(idea?._id, 'up')}
                                    sx={{color: idea?.votes?.some(vote => vote.user_id === localStorData?._id && vote.voteType === 'up') ? theme.palette.success.main : 'gray'}}
                                >
                                    <ThumbUpIcon />
                                </IconButton>
                                <Typography variant="body2" sx={{mx: 1}}>
                                    {idea.upvotes || 0}
                                </Typography>

                                <IconButton
                                    onClick={() => handleVote(idea?._id, 'down')}
                                    sx={{color: idea?.votes?.some(vote => vote.user_id === localStorData?._id && vote.voteType === 'down') ? theme.palette.error.main : 'gray', ml: 2}}
                                >
                                    <ThumbDownIcon />
                                </IconButton>
                                <Typography variant="body2" sx={{mx: 1}}>
                                    {idea.downvotes || 0}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}

export default Home;