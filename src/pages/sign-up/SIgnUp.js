import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid, IconButton, InputAdornment,
    Link,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "axios";
import {useNavigate} from "react-router-dom";


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
});

function SignUp(props) {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);

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
                console.log(process.env.VITE_BASE_URL,"fffffffffff")
                const res = await axios.post(`https://interview-task-be-u1e1.onrender.com/v1/auth/register`,values)
                if(res.status === 201){
                    toast.success('Register successfully!');
                    navigate('/sign-in')
                }
                resetForm();
            } catch (error) {
                toast.error(error?.response?.data?.error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Container component="main" maxWidth="xs">
            <Toaster position="top-center" reverseOrder={false} />
          <Box sx={{display:'flex',justifyContent:"center",alignItems:'center',height:"100vh"}}>
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
                          <Grid item xs={12} width={"100%"} >
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

                          <Grid item xs={12} width={"100%"}>
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

                          <Grid item xs={12} width={"100%"}>
                              <TextField
                                  fullWidth
                                  label="Password"
                                  type={showPassword ? 'text' : 'password'}
                                  {...formik.getFieldProps('password')}
                                  error={formik.touched.password && Boolean(formik.errors.password)}
                                  helperText={formik.touched.password && formik.errors.password}
                                  InputProps={{
                                      endAdornment: (
                                          <InputAdornment position="end">
                                              <IconButton
                                                  onClick={() => setShowPassword(!showPassword)}
                                                  edge="end"
                                              >
                                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                              </IconButton>
                                          </InputAdornment>
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

                      <Typography variant="body2" sx={{ textAlign:'center'}}>
                          Already have an account? <Link href="/sign-in" sx={{ textDecoration: 'none' }}>Sign in</Link>
                      </Typography>
                  </Box>
              </Paper>
          </Box>
        </Container>
    );
}

export default SignUp;