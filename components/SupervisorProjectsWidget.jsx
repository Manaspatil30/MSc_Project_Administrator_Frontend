'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Grid, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '@utils/axios';
import Cookies from 'js-cookie';

const SupervisorProjectsWidget = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the projects supervised by the supervisor
    axiosInstance.get(`/api/v1/projects/supervisor/${Cookies.get('userId')}/projects`)
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch projects data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Check if the projects array is empty
  if (projects.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Your Projects
        </Typography>
        <Typography variant="body1" color="textSecondary">
          You currently have no projects assigned.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Projects
      </Typography>
      <List>
        {projects.map((project, index) => (
          <Box key={project.projectId}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-project-${project.projectId}-content`}
                id={`panel-project-${project.projectId}-header`}
              >
                <Typography variant="h6">{project.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1"><strong>Project ID:</strong> {project.supProjectId}</Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}><strong>Status:</strong> {project.status}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Description:</strong> {project.description}</Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}><strong>Quota:</strong> {project.quota}</Typography>
                  </Grid>
                  
                  {/* Display questions if available */}
                  {project.questions.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}><strong>Questions:</strong></Typography>
                      <List dense>
                        {project.questions.map(question => (
                          <ListItem key={question.questionId}>
                            <ListItemText primary={`Q${question.questionId}: ${question.questionText}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
            {index < projects.length - 1 && <Divider variant="middle" />}
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default SupervisorProjectsWidget;