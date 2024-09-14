import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let navigate = useNavigate(); // Initialize useNavigate
  const handleJoin = (meeting) => {
    // Logic to join the meeting, e.g., redirect to meeting URL or open a modal
    navigate(`/meeting/${meeting.title+meeting.id}/${localStorage.getItem("userId")}`)
  };

  useEffect(() => {
    if(localStorage.getItem("userId")==undefined)
    {
      navigate("/")
    }
    const fetchMeetings = async () => {
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(`https://streamlinkbackendcoding.onrender.com/meeting/getmymeetings/${userId}`);
        setMeetings(response.data.meetings);
        setLoading(false);
      } catch (err) {
        setError('Error fetching meetings.');
        setLoading(false);
        toast.error('Error fetching meetings.');
      }
    };

    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error" style={{ fontFamily: 'Velyra, sans-serif' }}>{error}</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Velyra, sans-serif' }}>
      <ToastContainer />
      <Button
        onClick={() => navigate(-1)} // Navigate to the previous route
        variant="outlined"
        style={{ marginBottom: '20px', fontFamily: 'Velyra, sans-serif' }}
      >
        Back
      </Button>
      <Typography variant="h4" gutterBottom style={{ fontFamily: 'Velyra, sans-serif' }}>My Meetings</Typography>
      <TableContainer component={Paper} style={{ fontFamily: 'Velyra, sans-serif' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontFamily: 'Velyra, sans-serif' }}>
                <Typography variant="h6" style={{ fontFamily: 'Velyra, sans-serif' }}>Title</Typography>
              </TableCell>
              <TableCell style={{ fontFamily: 'Velyra, sans-serif' }}>
                <Typography variant="h6" style={{ fontFamily: 'Velyra, sans-serif' }}>Date</Typography>
              </TableCell>
              <TableCell style={{ fontFamily: 'Velyra, sans-serif' }}>
                <Typography variant="h6" style={{ fontFamily: 'Velyra, sans-serif' }}>Time</Typography>
              </TableCell>
              <TableCell style={{ fontFamily: 'Velyra, sans-serif' }}>
                <Typography variant="h6" style={{ fontFamily: 'Velyra, sans-serif' }}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meetings.map((meeting, index) => (
              <TableRow key={index}>
                <TableCell style={{ fontFamily: 'Velyra, sans-serif' }}>{meeting.title}</TableCell>
                <TableCell style={{ fontFamily: 'Velyra, sans-serif' }}>{meeting.date}</TableCell>
                <TableCell style={{ fontFamily: 'Velyra, sans-serif' }}>{meeting.time}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleJoin(meeting)}
                    style={{ fontFamily: 'Velyra, sans-serif' }}
                  >
                    Join
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

// Example join function, modify as needed


export default Meetings;
