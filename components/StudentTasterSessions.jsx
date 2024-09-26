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

const StudentTasterSessions = () => {
  const [requests, setRequests] = useState([]);
  const [studentDetails, setStudentDetails] = useState({});
  const [sessions, setSessions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');

  const studentId = Cookies.get('userId'); // Assuming supervisorId is stored in cookies

  useEffect(() => {
    // Fetch taster session requests for the supervisor
    axiosInstance.get(`/api/taster-sessions/requests/${studentId}`)
      .then(response => {
        setRequests(response.data);
      })
      .catch(err => console.error("Failed to fetch taster session requests", err));

    // Fetch existing sessions created by the supervisor
    axiosInstance.get(`/api/taster-sessions/student/${studentId}`)
      .then(response => {
        setSessions(response.data);
      })
      .catch(err => console.error("Failed to fetch existing sessions", err));
  }, []);

  return (
    <Box sx={{ p: 3, mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Your Sessions
      </Typography>

      {/* Display Created Sessions */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Sessions</Typography>
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
    </Box>
  );
};

export default StudentTasterSessions;