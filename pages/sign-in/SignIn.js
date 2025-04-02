import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,
    Typography
} from '@mui/material';

// Validation Schema
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
    showPassword: Yup.boolean()
});

function SignIn(props) {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            showPassword: false,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                toast.success('Logged in successfully!');
                resetForm();
            } catch (error) {
                toast.error('Invalid email or password');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Container component="main" maxWidth="xs">
            <Toaster position="top-center" reverseOrder={false} />
            <Paper elevation={3} sx={{
                mt: 8,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '16px'
            }}>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Sign In
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email Address"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                autoFocus
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={formik.values.showPassword ? 'text' : 'password'}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="showPassword"
                                                    checked={formik.values.showPassword}
                                                    onChange={() =>
                                                        formik.setFieldValue('showPassword', !formik.values.showPassword)
                                                    }
                                                />
                                            }
                                            label="Show"
                                            sx={{ mr: 0 }}
                                        />
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            bgcolor: 'primary.main',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2" sx={{ textDecoration: 'none' }}>
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default SignIn;