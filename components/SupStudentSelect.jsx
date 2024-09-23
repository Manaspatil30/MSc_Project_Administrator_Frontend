"use client"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, IconButton, Modal, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useEffect, useState } from 'react';
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

const SupStudentSelect = () => {
    const [projects, setProjects] = useState([]);
    const [submittedProjects, setSubmittedProjects] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // State for selected student for the modal
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // Tab state

  useEffect(() => {
    // Fetch projects with students data
    axiosInstance.get(`/api/v1/users/${Cookies.get('userId')}/students-grouped-by-project`).then((res) => {
        // Initialize preferences for projects with unranked students
        const initializedProjects = res.data.map((project) => ({
          ...project,
          students: project.students.map((student, index) => ({
            ...student,
            preference: student.preference || index + 1, // Set preference based on index + 1 if not already set
          })),
        }));
        setProjects(initializedProjects);
      });
    axiosInstance.get(`/api/v1/users/projects-with-ranked-students`).then((res) => {
      setSubmittedProjects(res.data);
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const moveStudentUp = (projectIndex, studentIndex) => {
    const updatedProjects = [...projects];
    const project = updatedProjects[projectIndex];
    const students = [...project.students];
    if (studentIndex > 0) {
      // Swap positions
      const temp = students[studentIndex - 1];
      students[studentIndex - 1] = students[studentIndex];
      students[studentIndex] = temp;
      // Update preferences based on position
      project.students = students.map((student, index) => ({
        ...student,
        preference: index + 1,
      }));
      updatedProjects[projectIndex] = project;
      setProjects(updatedProjects);
    }
  };

  const moveStudentDown = (projectIndex, studentIndex) => {
    const updatedProjects = [...projects];
    const project = updatedProjects[projectIndex];
    const students = [...project.students];
    if (studentIndex < students.length - 1) {
      // Swap positions
      const temp = students[studentIndex + 1];
      students[studentIndex + 1] = students[studentIndex];
      students[studentIndex] = temp;
      // Update preferences based on position
      project.students = students.map((student, index) => ({
        ...student,
        preference: index + 1,
      }));
      updatedProjects[projectIndex] = project;
      setProjects(updatedProjects);
    }
  };

  const handleSubmitPreferences = (projectId) => {
    const project = projects.find((proj) => proj.projectId === projectId);
    const preferences = project.students.map((student) => ({
      studentId: student.userId,
      preference: student.preference,
    }));

    axiosInstance.post(`/api/v1/users/supervisor/${Cookies.get('userId')}/rank-students?projectId=${projectId}`, preferences)
      .then(() => {
        alert(`Preferences submitted successfully for project ID ${projectId}!`);
      })
      .catch(() => {
        alert(`Error submitting preferences for project ID ${projectId}.`);
      });
  };

    // Function to handle opening the modal with selected student details
    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
      };
    
      // Function to handle closing the modal
      const handleCloseModal = () => {
        setSelectedStudent(null);
        setModalOpen(false);
      };

  return (
    <Box>
      {/* Tab Section */}
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="supervisor tabs">
        <Tab label="Pending Preferences" />
        <Tab label="Submitted Preferences" />
      </Tabs>

      {/* Pending Preferences Section */}
      {tabValue === 0 && (
        <Box>
          {projects.map((project, projectIndex) => (
            <Accordion key={project.projectId}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{project.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {project.students.map((student, studentIndex) => (
                        <TableRow key={student.userId}>
                          <TableCell>{student.preference || 'N/A'}</TableCell>
                          <TableCell>{student.firstname} {student.lastname}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <Button variant="outlined" onClick={() => handleOpenModal(student)}>
                              View Answers
                            </Button>
                            <IconButton onClick={() => moveStudentUp(projectIndex, studentIndex)} disabled={studentIndex === 0}>
                              <ArrowUpwardIcon />
                            </IconButton>
                            <IconButton onClick={() => moveStudentDown(projectIndex, studentIndex)} disabled={studentIndex === project.students.length - 1}>
                              <ArrowDownwardIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button variant="contained" color="primary" onClick={() => handleSubmitPreferences(project.projectId)}>
                    Submit Preferences for {project.title}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Submitted Preferences Section */}
      {tabValue === 1 && (
        <Box>
          {submittedProjects.map((project) => (
            <Accordion key={project.projectId}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{project.projectTitle}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Answers</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {project.rankedStudents.map((student) => (
                        <TableRow key={student.userId}>
                          <TableCell>{student.preference}</TableCell>
                          <TableCell>{student.firstname} {student.lastname}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <Button variant="outlined" onClick={() => handleOpenModal(student)}>
                              View Answers
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Modal for showing student answers */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="student-answers-modal"
        aria-describedby="student-answers-description"
      >
        <Box sx={style}>
          <Typography id="student-answers-modal" variant="h6" component="h2">
            Answers for {selectedStudent?.firstname} {selectedStudent?.lastname}
          </Typography>
          {selectedStudent?.answers && selectedStudent.answers.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {selectedStudent.answers.map((answer) => (
                <Box key={answer.questionId} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1"><strong>{answer.questionText}</strong></Typography>
                  <Typography variant="body1">{answer.answer}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>No answers provided for this student.</Typography>
          )}
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default SupStudentSelect