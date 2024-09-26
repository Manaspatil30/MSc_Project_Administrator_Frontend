'use client';
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Link,
  Grid,
  Avatar,
  Chip,
} from "@mui/material";
import axiosInstance from "@utils/axios";
import Cookies from "js-cookie";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventNoteIcon from '@mui/icons-material/EventNote';

const SupervisorUpcomingSessionWidget = () => {
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const supervisorId = Cookies.get('userId');
        const response = await axiosInstance.get(`/api/taster-sessions/supervisor/${supervisorId}`);
        
        if (response.data.length > 0) {
          // Sort the sessions by start time to find the latest upcoming session
          // @ts-ignore
          const sortedSessions = response.data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          const latestSession = sortedSessions[0];
          setUpcomingSession(latestSession);
        } 
      } catch (error) {
        setError("Failed to fetch upcoming sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Upcoming Session
      </Typography>
      {upcomingSession ? (
        <Box>
          <Avatar sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}>
            {upcomingSession.studentName.charAt(0)}
          </Avatar>
          <Typography variant="h6">{upcomingSession.studentName}</Typography>
          <Typography variant="body2" color="textSecondary">{upcomingSession.description}</Typography>

          <Box sx={{ mt: 2 }}>
            <Chip
              icon={<CalendarTodayIcon />}
              label={`Date: ${new Date(upcomingSession.startTime).toLocaleDateString()}`}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              icon={<AccessTimeIcon />}
              label={`Time: ${new Date(upcomingSession.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`}
              sx={{ mb: 1 }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            href={upcomingSession.meetingLink}
            target="_blank"
            sx={{ mt: 2 }}
          >
            Join Meeting
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No upcoming sessions scheduled.
        </Typography>
      )}
    </Paper>
  );
};

export default SupervisorUpcomingSessionWidget;