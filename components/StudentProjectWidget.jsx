'use client';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Grid, Avatar, Button, Link } from '@mui/material';
import { useState, useEffect } from 'react';
import axiosInstance from '@utils/axios';
import Cookies from 'js-cookie';

const StudentProjectWidget = () => {
  const [projectData, setProjectData] = useState(null);
  const [supervisorData, setSupervisorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the data from the API
    axiosInstance.get(`/api/student-choices/project-or-choices/${Cookies.get('userId')}`)
      .then(response => {
        setProjectData(response.data);
        setSupervisorData(response.data.supervisor)
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!supervisorData) {
    return <Typography>No supervisor assigned.</Typography>;
  }

  const mailToLink = `mailto:${supervisorData.email}`;

  const renderContent = () => {
    if (typeof projectData === 'string') {
      // Case where no projects or choices are found
      return (
        <Typography variant="body1" color="textSecondary">
          {projectData}
        </Typography>
      );
    }

    if (Array.isArray(projectData)) {
      // Case where student has submitted choices with preferences
      return (
        <Box>
          <Typography variant="h6" gutterBottom>Project Preferences:</Typography>
          <List>
            {projectData.map((choice, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Preference ${choice.preference}: ${choice.projectTitle}`}
                  secondary={`Project ID: ${choice.projectId}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      );
    }

    if (projectData && projectData.projectId) {
      // Case where a project is allocated to the student
      return (
        <Box>
          <Typography variant="h6" gutterBottom>Allocated Project</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Title:</strong> {projectData.title}</Typography>
              <Typography variant="body2" color="textSecondary">{projectData.description}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}><strong>Project id:</strong> {projectData.supProjectId}</Typography>
            </Grid>
          </Grid>
          {/* <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1"><strong>Status:</strong> {projectData.status}</Typography> */}
        </Box>
      );
    }

    return <Typography>No project assigned or choices selected.</Typography>;
  };

  return (
    <>
    <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Project Status
      </Typography>
      {renderContent()}
    </Paper>
    <Paper elevation={3} sx={{ p: 3, width: '100%', marginTop:'1rem' }}>
      <Typography variant="h5" gutterBottom>
        Supervisor Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center">
            <Avatar>{supervisorData.firstname.charAt(0)}</Avatar>
            <Box ml={2}>
              <Typography variant="h6">{supervisorData.firstname} {supervisorData.lastname}</Typography>
              <Typography variant="body2" color="textSecondary">{supervisorData.email}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="center">
          <Button variant="contained" color="primary">
            <Link href={mailToLink} color="inherit" underline="none">
              Email Supervisor
            </Link>
          </Button>
        </Grid>
      </Grid>
    </Paper>
    <Paper elevation={3} sx={{ p: 3, width: '100%', marginTop:'1rem' }}>
      <Typography variant="h5" gutterBottom>
      Submission Deadlines
      </Typography>
    </Paper>
    <Paper elevation={3} sx={{ p: 3, width: '100%', marginTop:'1rem' }}>
      <Typography variant="h5" gutterBottom>
      Feedback and Grades
      </Typography>
    </Paper>
    <Paper elevation={3} sx={{ p: 3, width: '100%', marginTop:'1rem' }}>
      <Typography variant="h5" gutterBottom>
      Announcements
      </Typography>
    </Paper>
    <Paper elevation={3} sx={{ p: 3, width: '100%', marginTop:'1rem' }}>
      <Typography variant="h5" gutterBottom>
      Resources
      </Typography>
    </Paper>
    </>
  );
};

export default StudentProjectWidget;
