import React, {useEffect, useState} from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import {
    Avatar, Box, Button, Card, CardContent, Container,
    Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, Slide, TextField, Typography, useTheme
} from "@mui/material";
import {UserContext} from "../../index";
import axiosInstance from "../../axiosInstance/axiosInstance";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

function Home(props) {
    const theme = useTheme();
    const localStorData = JSON.parse(localStorage.getItem("user"));
    const [ideas, setIdeas] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [title, setTitle] = useState('')
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState("popular");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false);

    const fetchIdeas = async () => {
        try {
            const res = await axiosInstance.get("/ideas", {
                params: {page, limit, sortBy, date}
            });
            setIdeas(res?.data?.ideas);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdeas()
    }, [page, sortBy, date]);

    const handleVote = async (ideaId, voteType) => {
        try {
            const res = await axiosInstance.put(`/ideas/${ideaId}/vote`, {voteType});
            if (res.status == 200) {
                fetchIdeas()
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleSubmitIdea = async () => {
        try {
            const res = await axiosInstance.post('/ideas', {title, description});

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
            <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                my={3}
                justifyContent="space-between"
                alignItems="center"
            >
                {/* Sort By Dropdown */}
                <Box>

                    <TextField
                        select
                        label="Sort By"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        SelectProps={{native: true}}
                        variant="outlined"
                        size="small"
                        sx={{minWidth: 180}}
                    >
                        <option value="popular">Most Popular</option>
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                    </TextField>

                    {/* Date Filter */}
                    <TextField
                        type="date"
                        label="Filter by Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{shrink: true}}
                        variant="outlined"
                        size="small"
                        sx={{minWidth: 180, ml: 4}}
                    />
                </Box>

                <Box>
                    {localStorData.role === 'ADMIN' &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/admin")}
                        >
                            Admin
                        </Button>}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                        sx={{ml: 4}}
                    >
                        Log Out
                    </Button>
                </Box>
            </Box>

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


                    <DialogContent sx={{pt: 4}}>
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
                                    '&:hover fieldset': {borderColor: theme.palette.primary.main}
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
                                    '&:hover fieldset': {borderColor: theme.palette.primary.main}
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
                            Submit Idea
                        </Button>
                    </DialogActions>
                </Dialog>

                {loading ? (
                    <Typography textAlign="center" my={4}>Loading...</Typography>
                ) : ideas.length === 0 ? (
                    <Typography textAlign="center" my={4}>No data found</Typography>
                ) : (
                    <>
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
                                            {idea.user_id.username?.charAt(0) || 'U'}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="500">
                                                {idea.user_id.username || 'Anonymous'}
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
                                            sx={{color: idea?.votes?.some(vote => vote.user_id === localStorData?._id && vote.voteType === 'up') ? 'green' : 'gray'}}
                                        >
                                            <ThumbUpIcon/>
                                        </IconButton>
                                        <Typography variant="body2" sx={{mx: 1}}>
                                            {idea.upvotes || 0}
                                        </Typography>

                                        <IconButton
                                            onClick={() => handleVote(idea?._id, 'down')}
                                            sx={{
                                                color: idea?.votes?.some(vote => vote.user_id === localStorData?._id && vote.voteType === 'down') ? 'red' : 'gray',
                                                ml: 2
                                            }}
                                        >
                                            <ThumbDownIcon/>
                                        </IconButton>
                                        <Typography variant="body2" sx={{mx: 1}}>
                                            {idea.downvotes || 0}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </>
                )}
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" mt={3} gap={2}>
                <Button
                    variant="outlined"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    sx={{
                        px: 3,
                        py: 1,
                        fontWeight: "bold",
                        borderRadius: 2,
                        "&:disabled": {
                            opacity: 0.5,
                        },
                    }}
                >
                    Previous
                </Button>

                <Typography variant="body1" fontWeight="bold">
                    Page {page}
                </Typography>

                <Button
                    variant="outlined"
                    onClick={() => setPage(page + 1)}
                    disabled={ideas.length < limit}
                    sx={{
                        px: 3,
                        py: 1,
                        fontWeight: "bold",
                        borderRadius: 2,
                        "&:disabled": {
                            opacity: 0.5,
                        },
                    }}
                >
                    Next
                </Button>
            </Box>

        </Container>
    );
}

export default Home;