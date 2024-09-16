import React, { useEffect, useState, useRef } from 'react';
import { Button, Grid, Typography, Paper, Box, IconButton, TextField } from '@mui/material';
import { CallEndOutlined, CopyAll as CopyAllIcon, Mic as MicIcon, MicOff as MicOffIcon, Videocam as VideocamIcon, VideocamOff as VideocamOffIcon } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router';
import Peer from 'peerjs';
import { io } from 'socket.io-client';

const Meeting = () => {
  const location = useLocation();
  const { roomId,hostId } = useParams();
  console.log("Room Id Is",roomId)
  console.log("Host Id",hostId)
  let navigate=useNavigate()
  const meetingLink = `http://localhost/meeting/${roomId}`;
  console.log("Pathname",location.pathname)

  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Jane Smith', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Alice Johnson', image: 'https://via.placeholder.com/100' },
  ]);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const videoRef = useRef(null);
  const remoteVideoRefs = useRef([]);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(meetingLink)
        .then(() => {
          console.log('Meeting link copied to clipboard!');
          alert('Meeting link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy meeting link.');
        });
    } else {
      console.error('Clipboard API not supported');
      alert('Clipboard API not supported.');
    }
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  useEffect(() => {
    if(localStorage.getItem("userId")==undefined)
    {
      localStorage.setItem("meetingLink",location.pathname)
      navigate("/")
    }
    const socket = io("https://streamlinkbackendcoding.onrender.com");
    const peer = new Peer({
      config: {
        'iceServers': [
          { url: 'stun:stun.l.google.com:19302' }, 
          {
            url: 'relay1.expressturn.com:3478', 
            username: 'efGGG00XKMIQTA3V5K',
            credential: '98OZorfHZgZnvgMG'
          }
        ]
      }
    });
  
    peer.on("open", (id) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          setLocalStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
  
          socket.emit("join-room", { roomId, id });
         
          socket.on("user-removed",(streamId)=>{

          console.log("User was removed from the meeting with stream Id",streamId)
         setRemoteStreams(remoteStreams.filter((stream)=>{
            return (stream.id!=streamId)
          })) 
          })
          socket.on("user-left-meeting",(streamId)=>{
            console.log("User Left  The Meeting With Stream Id",streamId)
            console.log("A User In The Meeting Has Left.Are you notified about that?")
           setRemoteStreams(remoteStreams.filter((stream)=>{
              return (stream.id!=streamId)
            })) 
            })
          socket.on("user-joined", (peerId) => {
            if (peerId !== id) {
              const call = peer.call(peerId, stream);
              call.on("stream", (remoteStream) => {
                console.log("RECEIVING Stream From Receiver", remoteStream);
                setRemoteStreams(prevStreams => {
                  // Add only if not already present
                  if (!prevStreams.some(existingStream => existingStream.id === remoteStream.id)) {
                    return [...prevStreams, remoteStream];
                  }
                  console.log(prevStreams)
                  return prevStreams;
                });
              });
            }
          });
  
          peer.on("call", (call) => {
            console.log("RECEIVING CALL");
            call.answer(stream);
            call.on("stream", (remoteStream) => {
              console.log("RECEIVED Stream From Sender");
              setRemoteStreams(prevStreams => {
                // Add only if not already present
                if (!prevStreams.some(existingStream => existingStream.id === remoteStream.id)) {
                  return [...prevStreams, remoteStream];
                }
                return prevStreams;
              });
            });
          });
        })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    });   ;
  
    return () => {
     
       socket.disconnect();
      if (localStream) {
        
        console.log("Your Local Stream Unmounted ",localStream)
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  },[roomId]);

  useEffect(() => {
    remoteStreams.forEach((remoteStream, index) => {
      if (remoteVideoRefs.current[index]) {
        remoteVideoRefs.current[index].srcObject = remoteStream;
      }
    });
  }, [remoteStreams]);
  let removeParticipant=(streamId)=>{
    console.log("Removing Participant With Stream Id",streamId)
    const socket = io("https://streamlinkbackendcoding.onrender.com");
  socket.emit("new-user")
    socket.emit("participant-removed",{roomId,streamId})
  }
  let leaveMeeting=()=>{
    console.log("Participant Leaving Meeting With Stream Id",localStream.id)
    const socket = io("https://streamlinkbackendcoding.onrender.com");
  socket.emit("new-user")
    socket.emit("meeting-left",{roomId,streamId:localStream.id})
    localStream.getTracks().forEach(track => track.stop());
    setTimeout(()=>{
      navigate(-1)
    
    },1000)
  }

  return (
    <Box>
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
          Meeting Room
        </Typography>

        {/* Meeting Link */}
        <Box display="flex" justifyContent="center" alignItems="center" marginBottom="20px">
          <TextField
            variant="outlined"
            fullWidth
            value={meetingLink}
            InputProps={{
              readOnly: true,
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
          />
          <IconButton
            onClick={handleCopyLink}
            style={{ marginLeft: '10px' }}
          >
            <CopyAllIcon />
          </IconButton>
        </Box>

        {/* Local Video */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: '100%',
              maxWidth: '600px',
              borderRadius: '10px',
              backgroundColor: '#000',
              marginBottom: '10px',
            }}
          />
          <Box display="flex" justifyContent="center" alignItems="center">
            <IconButton onClick={toggleAudio} style={{ margin: '0 10px' }}>
              {audioEnabled ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            <IconButton onClick={toggleVideo} style={{ margin: '0 10px' }}>
              {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton style={{backgroundColor:"red"}} onClick={()=>{
              leaveMeeting()
            }} ><CallEndOutlined style={{color:"white"}}/></IconButton>
          </Box>
        </Box>

        {/* Remote Streams */}
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
          Other Participants
        </Typography>
        <Grid container spacing={3}>
          {remoteStreams.map((remoteStream, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                elevation={3}
                style={{
                  padding: '20px',
                  borderRadius: '15px',
                  backgroundColor: '#f4f6f8',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <video
                  ref={el => remoteVideoRefs.current[index] = el}
                  autoPlay
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    backgroundColor: '#000',
                    marginBottom: '10px',
                  }}
                />
               {localStorage.getItem("userId")==hostId? <Button onClick={()=>{
                removeParticipant(remoteStream.id)
               }}>REMOVE</Button>:<></>}
              
                
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Meeting;
