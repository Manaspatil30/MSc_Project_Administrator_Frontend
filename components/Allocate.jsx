"use client";
import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, Paper, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Backdrop, AccordionSummary, Accordion } from '@mui/material';
import axiosInstance from '@utils/axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

const Allocate = () => {
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rankedProjects, setRankedProjects] = useState([]);
  const [studentPreferences, setStudentPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch all students and projects for selection
    const fetchData = async () => {
      const studentResponse = await axiosInstance.get('api/v1/users/supervisor?role=STUDENT');
      const projectResponse = await axiosInstance.get('/api/v1/projects');
      const rankedResponse = await axiosInstance.get('/api/v1/users/projects-with-ranked-students');
      const preferencesResponse = await axiosInstance.get('/api/student-choices/mod-owner/preferences-status');
      
      setStudents(studentResponse.data);
      setProjects(projectResponse.data);
      setRankedProjects(rankedResponse.data);
      setStudentPreferences(preferencesResponse.data.studentChoices);
    };
    fetchData();
  }, []);

  const handleAllocate = async () => {
    if (selectedStudent && selectedProject) {
      try {
        await axiosInstance.post('/api/v1/modowner/allocate-project', {
          studentId: selectedStudent.userId,
          projectId: selectedProject.projectId
        });
        toast.success("Project allocated successfully")
        alert('Project allocated successfully');
        setSelectedStudent(null);
        setSelectedProject(null);
      } catch (error) {
        console.error('Error allocating project:', error);
        toast.warn("Students remaining to allocate! Please Try Again.")
      }
    }
  };

  const handleAllocateAlgorithm = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/api/v1/modowner/allocate-projects');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error with allocation algorithm:', error);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Allocate Projects Manually</Typography>

      {/* Student and Project Selection */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Autocomplete
          options={students}
          getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
          onChange={(event, newValue) => setSelectedStudent(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Student" />}
          value={selectedStudent}
          sx={{ width: 300 }}
        />

        <Autocomplete
          options={projects}
          getOptionLabel={(option) => option.title}
          onChange={(event, newValue) => setSelectedProject(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Project" />}
          value={selectedProject}
          sx={{ width: 300 }}
        />

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAllocate}
          disabled={!selectedStudent || !selectedProject}
        >
          Allocate
        </Button>
      </Box>

      {/* Display ranked projects */}
      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Student Preferences and Supervisor Rankings</Typography>
        </AccordionSummary>
      {rankedProjects.map((project) => (
        <Box key={project.projectId} sx={{ mb: 4 }}>
          <Typography variant="subtitle1"><strong>{project.projectTitle}</strong></Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Preference</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {project.rankedStudents.map((student) => (
                  <TableRow key={student.userId}>
                    <TableCell>{student.preference}</TableCell>
                    <TableCell>{student.firstname} {student.lastname}</TableCell>
                    <TableCell>{student.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
      </Accordion>

      {/* Display student submitted preferences */}
      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6" gutterBottom>Students' Submitted Preferences</Typography>
      </AccordionSummary>
      {studentPreferences.map((studentPref) => (
        <Box key={studentPref.userId} sx={{ mb: 4 }}>
          <Typography variant="subtitle1"><strong>{studentPref.student.firstname} {studentPref.student.lastname}</strong></Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Preference</TableCell>
                  <TableCell>Project Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentPref.projectPreferences.map((preference, index) => (
                  <TableRow key={index}>
                    <TableCell>{preference.preference}</TableCell>
                    <TableCell>{preference.projectTitle}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
      </Accordion>

      {/* Allocate Projects Button */}
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleAllocateAlgorithm}
        sx={{ mt: 3 }}
      >
        Allocate Projects Using Algorithm
      </Button>

      {/* Loading animation */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Success animation */}
      {success && (
        <Typography 
          variant="h6" 
          sx={{ mt: 3, textAlign: 'center', color: 'green', animation: 'fade-in 2s' }}
        >
          Projects have been successfully allocated!
        </Typography>
      )}
    </Box>
  );
};

export default Allocate;