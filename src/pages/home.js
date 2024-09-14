import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; 
const Home = () => {
  const [open, setOpen] = useState(false); // Control dialog visibility
  const [meetingName, setMeetingName] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const[loading,setLoading]=useState(false)
  const navigate = useNavigate();
  // Handle the dialog open and close
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 useEffect(()=>{
  if(localStorage.getItem("userId")==undefined)
  {
    navigate("/")
  }

 },[])
  const handleCreateMeeting = async(e) => {
    e.preventDefault();
    // const roomId = meetingName + "-" + Math.random().toString(36).substring(7);
    // console.log("Room ID:", roomId, "Date:", meetingDate, "Time:", meetingTime);
    
    // // API call can be made here to create a meeting

    // // Navigate to the Meeting page with the new meeting link
    // navigate(`/meeting/${roomId}`);

    // // Close the dialog
    setLoading(true)

    try{
      let response=await axios.post("https://streamlinkbackendcoding.onrender.com/meeting/createmeeting",{createdBy:localStorage.getItem("userId"),meetingTime,meetingDate,meetingName})
      if(response.status==201)
      {
        setLoading(false)
        toast.success("Meeting Has Been Created")
        handleClose();
      setTimeout(()=>{
        navigate("/meetings")

      },1000)
      }
      else{
        setLoading(false)
        toast.error("There Was An Error While Creating Meeting!")
        handleClose();
      }

    }
    catch(e)
    {
      setLoading(false)
      toast.error("There Was Error While Getting")
      handleClose();
    }
    
  };

  return (
    <Container component="main" maxWidth="md">
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
        <Button onClick={()=>{
          navigate("/meetings")
        }}>Go To Meetings</Button>
        <ToastContainer/>
        <Typography
          component="h1"
          variant="h3"
          align="center"
          style={{
            fontFamily: 'Velyra, sans-serif',
            marginBottom: '20px',
            color: '#3f51b5',
            textShadow: '0 2px 4px rgba(63, 81, 181, 0.4)',
          }}
        >
          Welcome to StreamLink
        </Typography>

        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              style={{
                padding: '20px',
                borderRadius: '15px',
                backgroundColor: '#f4f6f8',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography
                component="h2"
                variant="h5"
                align="center"
                style={{
                  fontFamily: 'Velyra, sans-serif',
                  marginBottom: '20px',
                  color: '#3f51b5',
                }}
              >
                Create a New Meeting
              </Typography>
              
              {/* Button to open the popup */}
              <Button
                fullWidth
                variant="contained"
                style={{
                  padding: '10px 0',
                  backgroundColor: '#3f51b5',
                  color: '#fff',
                  fontFamily: 'Velyra, sans-serif',
                  boxShadow: '0 4px 8px rgba(63, 81, 181, 0.3)',
                }}
                onClick={handleClickOpen}
              >
                Create Meeting
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Dialog for input */}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" style={{ fontFamily: 'Velyra, sans-serif', color: '#3f51b5' }}>
            Create a New Meeting
          </DialogTitle>
          <DialogContent style={{ fontFamily: 'Velyra, sans-serif' }}>
            <TextField
              autoFocus
              margin="dense"
              id="meetingName"
              label="Meeting Name"
              type="text"
              fullWidth
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              InputProps={{
                style: {
                  fontFamily: 'Velyra, sans-serif',
                },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: 'Velyra, sans-serif',
                },
              }}
            />
            <TextField
              margin="dense"
              id="meetingDate"
              label="Meeting Date"
              type="date"
              fullWidth
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              InputProps={{
                style: {
                  fontFamily: 'Velyra, sans-serif',
                },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: 'Velyra, sans-serif',
                },
                shrink:true
              }}
             
            />
            <TextField
              margin="dense"
              id="meetingTime"
              label="Meeting Time"
              type="time"
              fullWidth
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              InputProps={{
                style: {
                  fontFamily: 'Velyra, sans-serif',
                },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: 'Velyra, sans-serif',
                },
                shrink:true
              }}
             
            />
          </DialogContent>
          <DialogActions style={{ fontFamily: 'Velyra, sans-serif' }}>
            <Button onClick={handleClose} color="primary" style={{ fontFamily: 'Velyra, sans-serif' }}>
              Cancel
            </Button>
            {
              loading? <Button disabled color="primary" style={{ fontFamily: 'Velyra, sans-serif' }}>
              <CircularProgress style={{height:"20px",width:"20px",color:"white"}}/>
            </Button>: <Button onClick={handleCreateMeeting} color="primary" style={{ fontFamily: 'Velyra, sans-serif' }}>
              Create
            </Button>
            }
           
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Home;
