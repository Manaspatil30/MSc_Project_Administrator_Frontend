'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, Grid, TextField, Modal, Link, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '@utils/axios';
import Cookies from 'js-cookie';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };

const SupervisorTasterSessions = () => {
  const [requests, setRequests] = useState([]);
  const [studentDetails, setStudentDetails] = useState({});
  const [sessions, setSessions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');

  const supervisorId = Cookies.get('userId'); // Assuming supervisorId is stored in cookies

  useEffect(() => {
    // Fetch taster session requests for the supervisor
    axiosInstance.get(`/api/taster-sessions/requests/${supervisorId}`)
      .then(response => {
        setRequests(response.data);
      })
      .catch(err => console.error("Failed to fetch taster session requests", err));

    // Fetch existing sessions created by the supervisor
    axiosInstance.get(`/api/taster-sessions/supervisor/${supervisorId}`)
      .then(response => {
        setSessions(response.data);
      })
      .catch(err => console.error("Failed to fetch existing sessions", err));
  }, []);

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/users/by-id?id=${studentId}`);
      setStudentDetails(prevState => ({ ...prevState, [studentId]: response.data[0] }));
    } catch (err) {
      console.error("Failed to fetch student details", err);
    }
  };

  const handleCreateSession = async () => {
    try {
      await axiosInstance.post(`/api/taster-sessions/supervisor/${supervisorId}/create`, null, {
        params: {
          studentId: selectedStudent,
          meetingLink,
          description,
          startTime,
        },
      });
      alert("Session created successfully!");
      setModalOpen(false);

      // Refresh the sessions list
      axiosInstance.get(`/api/taster-sessions/supervisor/${supervisorId}`)
        .then(response => setSessions(response.data));
    } catch (err) {
      console.error("Error creating session", err);
    }
  };

  const handleOpenModal = (studentId) => {
    setSelectedStudent(studentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setMeetingLink('');
    setDescription('');
    setStartTime('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Taster Sessions Management
      </Typography>

      {/* Display Student Requests */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Student Requests</Typography>
        <List>
          {requests.map(request => {
            const student = studentDetails[request.studentId];

            if (!student) {
              fetchStudentDetails(request.studentId);
              return <ListItem key={request.studentId}><ListItemText primary="Loading student details..." /></ListItem>;
            }

            return (
              <ListItem key={student.userId}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <ListItemText
                      primary={`${student.firstname} ${student.lastname}`}
                      secondary={student.email}
                    />
                  </Grid>
                  <Grid item xs={6}>
                  {request.status === "PENDING" ? (
                        <Button variant="contained" color="primary" onClick={() => handleOpenModal(student.userId)}>
                        Create Session
                      </Button>
                      ) : (
                        <Chip
                          label="Approved"
                          color="success"
                          style={{ backgroundColor: "#4caf50", color: "#fff" }}
                        />
                      )}
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Display Created Sessions */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Created Sessions</Typography>
        <List>
          {sessions.map(session => (
            <ListItem key={session.sessionId}>
              <ListItemText
                primary={`${session.studentName} - ${session.description}`}
                secondary={`Scheduled at: ${new Date(session.startTime).toLocaleString()} - Link: `}
              />
              <Link href={session.meetingLink} target="_blank" rel="noopener">
                Join Meeting
              </Link>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Modal to create session */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" component="h2">
            Create Taster Session
          </Typography>
          <TextField
            label="Meeting Link"
            fullWidth
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleCreateSession} sx={{ mt: 3 }}>
            Create Session
          </Button>
          <Button variant="outlined" onClick={handleCloseModal} sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default SupervisorTasterSessions;