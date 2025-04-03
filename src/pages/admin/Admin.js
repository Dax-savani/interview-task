import React, {useEffect, useState} from 'react';
import axiosInstance from "../../axiosInstance/axiosInstance";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Typography,
    useTheme
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CommentIcon from '@mui/icons-material/Comment';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import toast from "react-hot-toast";

function Admin(props) {
    const theme = useTheme();
    const [ideas, setIdeas] = useState([]);

    const fetchIdeas = async () => {
        try {
            const res = await axiosInstance.get("/admin/ideas");
            setIdeas(res?.data?.ideas);
        } catch (e) {
            console.log(e);
        }
    };

    const handleUpdateStatus = async (ideaId, newStatus) => {
        try {
            const res = await axiosInstance.put(`/admin/ideas/${ideaId}`,{status:newStatus});
            if(res.status == 200){
                toast.success(`Status ${newStatus} successfully!`)
            }
            await fetchIdeas();
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchIdeas();
    }, []);

    return (
        <Container maxWidth="xl">
            <Box mt={4} mb={4}>
                <Typography variant="h4" gutterBottom sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 4
                }}>
                    Idea Management Dashboard
                </Typography>

                <Grid container spacing={3}>
                    {ideas.map((idea) => (
                        <Grid item xs={12} md={6} lg={4} width={{xs: "100%",md:"unset"}} key={idea._id}>
                            <Card sx={{
                                height: '100%',
                                width: {xs:"100%",md:"500px",lg:"450px"},
                                display: 'flex',
                                flexDirection: 'column',
                                borderLeft: `4px solid ${idea.status === 'approved'
                                    ? theme.palette.success.main
                                    : theme.palette.warning.main}`
                            }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Chip
                                            label={idea.status.toUpperCase()}
                                            color={
                                                idea.status === 'approved' ? 'success' :
                                                    idea.status === 'pending' ? 'warning' : 'error'
                                            }
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(idea.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>

                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        {idea.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {idea.description}
                                    </Typography>

                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <HowToVoteIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {idea.votes.length} votes
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CommentIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {idea.comments.length} comments
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
                                        {idea.status !== 'approved' && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleUpdateStatus(idea._id, 'approved')}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Approve
                                            </Button>
                                        )}
                                        {idea.status !== 'rejected' && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleUpdateStatus(idea._id, 'rejected')}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Reject
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}

export default Admin;