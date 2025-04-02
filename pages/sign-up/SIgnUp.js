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
    username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    agreeTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
        .required('You must accept the terms and conditions'),
    showPassword: Yup.boolean()
});

function SignUp(props) {
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            showPassword: false,
            agreeTerms: false
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                toast.success('Account created successfully!');
                resetForm();
            } catch (error) {
                toast.error('Error creating account. Please try again.');
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
                    Create Account
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="username"
                                name="username"
                                label="Username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                                autoFocus
                            />
                        </Grid>

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

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="agreeTerms"
                                        checked={formik.values.agreeTerms}
                                        onChange={() =>
                                            formik.setFieldValue('agreeTerms', !formik.values.agreeTerms)
                                        }
                                        color="primary"
                                    />
                                }
                                label="I agree to the terms and conditions"
                            />
                            {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                    {formik.errors.agreeTerms}
                                </Typography>
                            )}
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
                        {formik.isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default SignUp;