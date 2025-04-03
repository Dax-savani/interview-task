import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import {
    Box,
    Button,
    Container,
    Grid, IconButton, InputAdornment,
    Link,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

function SignIn(props) {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            showPassword: false,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const res = await axios.post(`https://interview-task-be-u1e1.onrender.com/v1/auth/login`,values)
                if(res.status === 200){
                toast.success('Logged in successfully!');
                const user ={...res?.data?.user,token:res?.data?.tokens}
                localStorage.setItem("user",JSON.stringify(user))
                    navigate('/')
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
                      Sign In
                  </Typography>

                  <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
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
                                  autoFocus
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

                      <Typography variant="body2" sx={{ textAlign:'center'}}>
                          Don't have an account? <Link href="/sign-up" sx={{ textDecoration: 'none' }}>Sign Up</Link>
                      </Typography>
                  </Box>
              </Paper>
          </Box>
        </Container>
    );
}

export default SignIn;