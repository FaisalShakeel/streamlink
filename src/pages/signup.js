import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router';

const SignUp = () => {
  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const[loading,setLoading]=useState(false)
let navigate=useNavigate()
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!emailAddress || !/\S+@\S+\.\S+/.test(emailAddress)) newErrors.emailAddress = 'Valid email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    
    // Handle form submission logic here
    console.log('Name:', name);
    console.log('Email:', emailAddress);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    setLoading(true)
    try {
     let response=await axios.post("https://streamlinkbackendcoding.onrender.com/user/createaccount",{name,emailAddress,password,confirmPassword})
     if(response.status==201)
     {
      setLoading(false)
      toast.success(`${response.data.message}`)
      localStorage.setItem("userId",response.data.userId)
      setTimeout(()=>{
        if(localStorage.getItem("meetingLink")!=undefined)
          {
            let meetingLink=localStorage.getItem("meetingLink")
            localStorage.removeItem("meetingLink")
            navigate(meetingLink)
          }
          else{
          navigate("/home")
          }
      },2000)

     }
     else{
      setLoading(false)
      toast.error(`${response.data.message}`)

     }
    } catch (error) {
     setLoading(false) 

      toast.error("Error While Creating Account!")
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer/>
      <Paper
        elevation={5}
        style={{
          padding: '40px',
          marginTop: '50px',
          borderRadius: '15px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          style={{
            fontFamily: 'Velyra, sans-serif',
            marginBottom: '20px',
            color: '#3f51b5',
            textShadow: '0 2px 4px rgba(63, 81, 181, 0.4)',
          }}
        >
          Sign Up to StreamLink
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                InputProps={{
                  style: {
                    fontFamily: 'Velyra, sans-serif',
                    borderRadius: '50px',
                    padding: '10px',
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontFamily: 'Velyra, sans-serif',
                  },
                }}
                style={{
                  marginBottom: '20px',
                  backgroundColor: '#f4f6f8',
                  borderRadius: '50px',
                }}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                autoComplete="email"
                InputProps={{
                  style: {
                    fontFamily: 'Velyra, sans-serif',
                    borderRadius: '50px',
                    padding: '10px',
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontFamily: 'Velyra, sans-serif',
                  },
                }}
                style={{
                  marginBottom: '20px',
                  backgroundColor: '#f4f6f8',
                  borderRadius: '50px',
                }}
                error={!!errors.emailAddress}
                helperText={errors.emailAddress}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                InputProps={{
                  style: {
                    fontFamily: 'Velyra, sans-serif',
                    borderRadius: '50px',
                    padding: '10px',
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontFamily: 'Velyra, sans-serif',
                  },
                }}
                style={{
                  marginBottom: '20px',
                  backgroundColor: '#f4f6f8',
                  borderRadius: '50px',
                }}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                InputProps={{
                  style: {
                    fontFamily: 'Velyra, sans-serif',
                    borderRadius: '50px',
                    padding: '10px',
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontFamily: 'Velyra, sans-serif',
                  },
                }}
                style={{
                  marginBottom: '20px',
                  backgroundColor: '#f4f6f8',
                  borderRadius: '50px',
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
          </Grid>
          {loading? <Button
            disabled
            fullWidth
            variant="contained"
            style={{
              marginTop: '30px',
              padding: '10px 0',
              backgroundColor: '#3f51b5',
              color: '#fff',
              fontFamily: 'Velyra, sans-serif',
              boxShadow: '0 4px 8px rgba(63, 81, 181, 0.3)',
            }}
          >
            <CircularProgress style={{height:"20px",width:"20px",color:"white"}}/>
          </Button>: <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{
              marginTop: '30px',
              padding: '10px 0',
              backgroundColor: '#3f51b5',
              color: '#fff',
              fontFamily: 'Velyra, sans-serif',
              boxShadow: '0 4px 8px rgba(63, 81, 181, 0.3)',
            }}
          >
            Sign Up
          </Button>}
         
          <Grid container justifyContent="flex-end" style={{ marginTop: '30px' }}>
            <Grid item>
              <Typography variant="body2" style={{ fontFamily: 'Velyra, sans-serif' }}>
                Already have an account? <a href="/signin" style={{ color: '#3f51b5' }}>Sign in</a>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
/*
<Col>
<Text>Welcome To Stream</Text>
<TextField label="EMail"></TextField>
<TextField label="Password"></TextField>
<Button>Sign Up</Button>
Email:ans34@gamil.com
password:3454

Backend.


Users {EMail:ansd,password:3454}


let password="anas123"
let rollNo=5
if(password.length<8)
{
}
if(rollNo>5)
{
}

let confirmPassword="anas3454"
if(password==confirmPassword)
{
console.log("Passwo!")
}
{
}

let firstName="Anas"


</Col>
*/
