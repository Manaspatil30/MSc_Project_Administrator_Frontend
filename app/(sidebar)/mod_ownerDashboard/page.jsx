"use client"
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axiosInstance from '@utils/axios';
import { Autocomplete, Button, Checkbox, Grid, List, ListItem, ListItemText, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import StudentPreferences from '@components/StudentPreferences';
import axios from 'axios';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const page = () => {
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]); // Store projects data
  const [selectedProject, setSelectedProject] = useState(null); // Store selected project
  const [supervisors, setSupervisors] = useState([]); // Store supervisor list
  const [selectedSupervisor, setSelectedSupervisor] = useState(); // Store selected supervisor
  const [projectsWithAssessors, setProjectsWithAssessors] = useState([]);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  // Fetch projects (mocked API request, replace with actual API)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const responseWithoutAssessor = await axiosInstance.get("/api/v1/modowner/assignedProjects");
        const responseWithAssessor = await axiosInstance.get("/api/v1/modowner/projectsWithAssessors")
        setProjects(responseWithoutAssessor.data);
        setProjectsWithAssessors(responseWithAssessor.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch supervisors for the selected project
  const fetchSupervisors = async (projectId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/modowner/supervisors?projectId=${projectId}`); // Mock API
      setSupervisors(response.data);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  // Handle project selection
  const handleProjectSelect = (project) => {
    if (selectedProject?.projectId === project.projectId) {
      // Deselect the project if it's already selected
      setSelectedProject(null);
      setSupervisors([]); // Clear supervisors list
      // @ts-ignore
      setSelectedSupervisor(); // Clear selected supervisor
    } else {
      // Select the project
      setSelectedProject(project);
      fetchSupervisors(project.projectId); // Fetch supervisors when project is selected
    }
  };

  // Handle supervisor selection
  const handleSupervisorSelect = (event, newValue) => {
    setSelectedSupervisor(newValue);
  };

  // Assign project to supervisor
  const assignProject = async () => {
    try {
      await axiosInstance.post("/api/v1/project-assessment/assignProjectForAssessment", {
        projectId: selectedProject.projectId,
        // @ts-ignore
        supervisorId: selectedSupervisor.userId,
      });
      alert("Project successfully assigned to the supervisor");
      window.location.reload();
    } catch (error) {
      console.error("Error assigning project:", error);
    }
  };
  
    return (
      <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Second Assessor Allocation" />
          <Tab label="Another Tab" />
        </Tabs>
      </Box>
      
      {/* Projects Tab */}
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Project Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Supervisor</TableCell>
                  <TableCell>Assign Second Assessor</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.projectId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProject?.projectId === project.projectId}
                        disabled={selectedProject && selectedProject.projectId !== project.projectId}
                        onChange={() => handleProjectSelect(project)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {project.title}
                    </TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>
                      {project.students.map(student => (
                        <div key={student.userId}>
                          {student.firstname} {student.lastname}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{project.supervisor ? `${project.supervisor.firstname} ${project.supervisor.lastname}` : "N/A"}</TableCell>
                    <TableCell>
                      <Autocomplete
                        options={supervisors}
                        getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
                        value={selectedSupervisor}
                        onChange={(event, newValue) => handleSupervisorSelect(project.projectId, newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Assessor" />}
                        isOptionEqualToValue={(option, value) => option.userId === value.userId}
                        disabled={selectedProject && selectedProject.projectId !== project.projectId}// Disable if already assigned
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => assignProject()}
                        disabled={selectedProject && selectedProject.projectId !== project.projectId}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Projects with Assessors Table */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Projects With Assessors</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="projects with assessors">
              <TableHead>
                <TableRow>
                  <TableCell>Project Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Students</TableCell>
                  {/* <TableCell>Supervisor</TableCell> */}
                  <TableCell>Assessor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectsWithAssessors.map((project) => (
                  <TableRow key={project.projectId}>
                    <TableCell component="th" scope="row">
                      {project.title}
                    </TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>
                      {project.students ? (
                        project.students.map(student => (
                          <div key={student.userId}>
                            {student.firstname} {student.lastname}
                          </div>
                        ))
                      ) : 'No Students Assigned'}
                    </TableCell>
                    {/* <TableCell>{project.supervisor ? `${project.supervisor.firstname} ${project.supervisor.lastname}` : "N/A"}</TableCell> */}
                    <TableCell>
                      {project.assessor ? `${project.assessor.firstname} ${project.assessor.lastname}` : "No Assessor Assigned"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CustomTabPanel>
      
      {/* Placeholder for another tab */}
      <CustomTabPanel value={value} index={1}>
        <StudentPreferences/>
      </CustomTabPanel>
    </Box>
    );
}

export default page