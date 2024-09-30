'use client';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Grid, Avatar, Button, Link } from '@mui/material';
import { useState, useEffect } from 'react';
import axiosInstance from '@utils/axios';
import Cookies from 'js-cookie';

const SupervisorStudentsWidget = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the students supervised by the supervisor
    axiosInstance.get(`/api/v1/users/${Cookies.get('userId')}/students`)
      .then(response => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch students data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Check if the students array is empty
  if (students.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Students under Supervision
        </Typography>
        <Typography variant="body1" color="textSecondary">
          There are currently no students assigned to you for supervision.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
      Students under Supervision
      </Typography>
      <List>
        {students.map((student, index) => (
          <Box key={student.userId}>
            <ListItem alignItems="flex-start">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Avatar>{student.firstname.charAt(0)}</Avatar>
                    <Box ml={2}>
                      <Typography variant="h6">{student.firstname} {student.lastname}</Typography>
                      <Typography variant="body2" color="textSecondary">{student.email}</Typography>
                      <Button variant="contained" color="primary" sx={{ mt: 1 }}>
                        <Link href={`mailto:${student.email}`} color="inherit" underline="none">
                          Contact Student
                        </Link>
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1"><strong>Assigned Project:</strong></Typography>
                  <Typography variant="body1">{student.assignedProject.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{student.assignedProject.description}</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}><strong>sup_project_id:</strong> {student.assignedProject.supProjectId}</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}><strong>Status:</strong> {student.assignedProject.status}</Typography>
                </Grid>
                {/* {student.assignedProject.programes.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}><strong>Programs:</strong></Typography>
                    <List dense>
                      {student.assignedProject.programes.map(program => (
                        <ListItem key={program.programId}>
                          <ListItemText primary={program.title} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )} */}
              </Grid>
            </ListItem>
            {index < students.length - 1 && <Divider variant="middle" />}
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default SupervisorStudentsWidget;
