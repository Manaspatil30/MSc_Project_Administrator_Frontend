"use client"
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axiosInstance from '@utils/axios';
import { Autocomplete, Button, Checkbox, Grid, List, ListItem, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import StudentPreferences from '@components/StudentPreferences';

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
  const [selectedSupervisor, setSelectedSupervisor] = useState(null); // Store selected supervisor
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  // Fetch projects (mocked API request, replace with actual API)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/modowner/assignedProjects"); // Mock API for projects
        setProjects(response.data);
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
      setSelectedSupervisor(null); // Clear selected supervisor
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
          <Tab label="Projects" />
          <Tab label="Another Tab" />
        </Tabs>
      </Box>
      
      {/* Projects Tab */}
      <CustomTabPanel value={value} index={0}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={6}>
        {/* Projects List (Left side) */}
        <Grid item xs={4}>
          <Typography variant="h6">Available Projects</Typography>
          <List>
            {projects.map((project) => (
              <ListItem key={project.projectId} disablePadding>
                <Checkbox
                  edge="start"
                  checked={selectedProject?.projectId === project.projectId}
                  disabled={selectedProject && selectedProject.projectId !== project.projectId}
                  onChange={() => handleProjectSelect(project)}
                />
                <ListItemText
                  primary={project.title}
                  secondary={`Description: ${project.description}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Supervisor Selection (Right side) */}
        <Grid item xs={6}>
          {selectedProject && (
            <Box>
              <Typography variant="h6">Assign Supervisor for {selectedProject.title}</Typography>
              
              <Autocomplete
                options={supervisors}
                getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
                value={selectedSupervisor}
                onChange={handleSupervisorSelect}
                renderInput={(params) => <TextField {...params} label="Select Supervisor" />}
                isOptionEqualToValue={(option, value) => option.userId === value.userId}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={assignProject}
                disabled={!selectedSupervisor}
                sx={{ mt: 2 }}
              >
                Assign Supervisor
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
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