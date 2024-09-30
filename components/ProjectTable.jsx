'use client'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Checkbox, Chip, Drawer, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, Modal, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axiosInstance from '@utils/axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      width: 250,
    },
  },
};

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

const columns = [
  { id: 'propjectId', label: 'Project Id', minWidth: 100 },
  { id: 'title', label: 'Title', minWidth: 170 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'supervisor',
    label: 'Supervisor',
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions', label: 'Action', minWidth: 100, align: "right"
  },
  { id: 'add', label: '', minWidth: 100, align: "right" },
];


const ProjectTable = () => {
  const [rows, setRows] = useState([]);
  const [programs, setPrograms] = useState([]); // To store available programs
  const [tags, setTags] = useState([]); // To store available tags
  const [title, setTitle] = useState('');
  const [programeName, setProgrameName] = useState([]); // For selected programs
  const [tagName, setTagName] = useState([]);
  const [supervisorName, setSupervisorName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState();
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // State to hold the selected project
  const [modalOpen, setModalOpen] = useState(false);
  const [projectAsssigned, setProjectAssigned] = useState(false);
  const [user, setUser] = useState();

  useEffect(()=>{
    axiosInstance.get("/api/v1/users/profile")
    .then((res) => {
      if(res.data.assignedProject == null){
        setProjectAssigned(false);
      }else{
        setProjectAssigned(true);
      }
    })
  },[])

  useEffect(()=>{
    // @ts-ignore
    setUserRole(Cookies.get('user_role'))
  },[])

  // Handle opening the modal
  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedProject(null);
    setModalOpen(false);
  };
  

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  useEffect(() => {
    // Fetch all programs and tags for dropdowns
    axiosInstance.get('api/v1/programs').then(res => setPrograms(res.data));
    axiosInstance.get('/api/v1/projects/tags').then(res => setTags(res.data));

    // Initial fetch of all projects
    fetchProjects();
  }, []);

  const fetchProjects = (filters = {}) => {
    let filterQuery = Object.entries(filters)
      .filter(([_, value]) => value) // Remove any filters that are empty
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = filterQuery ? `api/v1/projects/filter?${filterQuery}` : 'api/v1/projects';

    axiosInstance.get(url).then((res) => {
      setRows(res.data);
    });
  };

  const handleSearch = () => {
    const filters = {
      title,
      programId : programeName.map((program) => program.programId),
      tagName : tagName.join(','),
      supervisorName,
    };

    fetchProjects(filters);
  };

  const handleClear = () => {
    setTitle(''); // Clear search input
    setProgrameName([]); // Clear selected programs
    setTagName([]); // Clear selected tags
    setSupervisorName(''); // Clear supervisor name

    // Fetch all projects again
    fetchProjects();
  };

  const handleProgrameChange = (event) => {
    const {
      target: { value },
    } = event;
    setProgrameName(
      // On autofill we get a stringified value
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setTagName(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleAddProject = (project) => {
    if (selectedProjects.length < 5) {
      setSelectedProjects([...selectedProjects, { ...project, preference: selectedProjects.length + 1, answers: [] }]);
    } else {
      alert("You can only select up to 5 projects.");
    }
  };

  const handleRemoveProject = (projectId) => {
    const updatedProjects = selectedProjects.filter(proj => proj.supProjectId !== projectId);
    setSelectedProjects(updatedProjects.map((proj, index) => ({ ...proj, preference: index + 1 })));
  };

  const moveProjectUp = (index) => {
    if (index > 0) {
      const updatedProjects = [...selectedProjects];
      const temp = updatedProjects[index - 1];
      updatedProjects[index - 1] = updatedProjects[index];
      updatedProjects[index] = temp;

      setSelectedProjects(updatedProjects.map((proj, idx) => ({ ...proj, preference: idx + 1 })));
    }
  };

  const moveProjectDown = (index) => {
    if (index < selectedProjects.length - 1) {
      const updatedProjects = [...selectedProjects];
      const temp = updatedProjects[index + 1];
      updatedProjects[index + 1] = updatedProjects[index];
      updatedProjects[index] = temp;

      setSelectedProjects(updatedProjects.map((proj, idx) => ({ ...proj, preference: idx + 1 })));
    }
  };

  const handleAnswerChange = (projectId, questionId, answer) => {
    setSelectedProjects(prevProjects => prevProjects.map(proj => {
      if (proj.supProjectId === projectId) {
        const updatedAnswers = proj.answers.map(ans =>
          ans.questionId === questionId ? { ...ans, answer } : ans
        );
        return { ...proj, answers: updatedAnswers };
      }
      return proj;
    }));
  };

  const validateAnswers = () => {
    // Ensure all questions are answered for projects with questions
    for (let proj of selectedProjects) {
      if (proj.questions && proj.questions.length > 0) {
        for (let question of proj.questions) {
          const answer = proj.answers.find(ans => ans.questionId === question.questionId);
          if (!answer || !answer.answer) {
            return false; // Missing answer
          }
        }
      }
    }
    return true; // All questions answered
  };


  const handleSubmitPreferences = () => {

    // if (!validateAnswers()) {
    //   setAlertVisible(true); // Show alert if answers are missing
    //   return;
    // }

    const payload = {
      projectPreferences: selectedProjects.map(proj => ({
        projectId: proj.projectId,
        preference: proj.preference,
        answers: proj.answers.length > 0 ? proj.answers : undefined
      })),
    };

    axiosInstance.post('api/student-choices', payload)
      .then(() => {
        alert("Preferences submitted successfully!")
        // Clear the selected projects after successful submission
        setSelectedProjects([]);
      })
      .catch(err => alert("Error submitting preferences."));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestTasterSession = async () => {
    try {
      const payload = {
        studentId: Cookies.get('userId'), // Assuming the student's ID is stored in cookies
        supervisorId: selectedProject.supervisor.userId
      };

      await axiosInstance.post('/api/taster-sessions/request', payload);
      toast.success("Taster Session Requested!")
      handleCloseModal(); // Close modal after successful request
    } catch (error) {
      console.error("Error requesting taster session:", error);
      alert("Failed to request taster session.");
    }
  };
  
  return (
    <Box>
      {/* Filter */}
      {/* Filter Section */}
      <Grid container gap={2} mb={2}>
        {/* Search Bar */}
        <Grid item xs={4}>
        <TextField
          label="Search by Title"
          variant="outlined"
          fullWidth
          margin='dense'
          size='small'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        </Grid>

        {/* Program Dropdown with Multiple Selection */}
        <Grid item xs={4}>
        <FormControl size="small" fullWidth margin="dense">
          <InputLabel>Programs</InputLabel>
          <Select
            labelId="program-select-label"
            id="program-select"
            multiple
            value={programeName}
            onChange={handleProgrameChange}
            input={<OutlinedInput id="select-multiple-chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value.programId} label={value.title} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {programs.map((program) => (
              <MenuItem key={program.programId} value={program}>
                <Checkbox checked={programeName.indexOf(program) > -1} />
                <ListItemText primary={program.title} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid>

        {/* Tags Dropdown with Multiple Selection */}
        <Grid item xs={3}>
        <FormControl size="small" fullWidth margin="dense">
          <InputLabel>Tags</InputLabel>
          <Select
            labelId="tags-select-label"
            id="tags-select"
            multiple
            value={tagName}
            onChange={handleTagChange}
            input={<OutlinedInput id="select-multiple-chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.name}>
                <Checkbox checked={tagName.indexOf(tag.name) > -1} />
                <ListItemText primary={tag.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid>

        {/* Search Button */}
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear All
        </Button>
      </Grid>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  // @ts-ignore
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.supProjectId}>
                    <TableCell>
                      {row.supProjectId}
                    </TableCell>
                    <TableCell>
                      {row.title}
                    </TableCell>
                    <TableCell align='right'>
                      {row.status}
                    </TableCell>
                    <TableCell align='right'>
                      {row.supervisor.firstname + " " + row.supervisor.lastname}
                    </TableCell>
                    <TableCell align='right'>
                      <Button variant="outlined" onClick={() => handleOpenModal(row)}>
                        View Details
                      </Button>
                    </TableCell>
                    {
                      Cookies.get('user_role') == 'STUDENT' && projectAsssigned == false ? 
                    <TableCell align='right'>
                      <Button variant="contained" onClick={() => handleAddProject(row)} disabled={selectedProjects.some(proj => proj.supProjectId === row.supProjectId)}>
                        Add
                      </Button>
                    </TableCell>
                    :
                    <TableCell align='right'>
                    </TableCell>
                    }
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    {/* Modal for showing project details */}
    <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="project-details-modal"
        aria-describedby="project-details-description"
      >
        <Box sx={style}>
          <Typography id="project-details-modal" variant="h6" component="h2">
            {selectedProject?.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Project ID: {selectedProject?.supProjectId}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Description:</strong> {selectedProject?.description}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Status:</strong> {selectedProject?.status}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Supervisor:</strong> {selectedProject?.supervisor.firstname} {selectedProject?.supervisor.lastname} ({selectedProject?.supervisor.email})
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Quota:</strong> {selectedProject?.quota}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Programs:</strong> 
            <ul>
              {selectedProject?.programes.map(program => (
                <li key={program.programId}>{program.title}</li>
              ))}
            </ul>
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Questions:</strong>
            {selectedProject?.questions && selectedProject?.questions.length > 0 ? (
              <ul>
                {selectedProject.questions.map(question => (
                  <li key={question.questionId}>{question.questionText}</li>
                ))}
              </ul>
            ) : (
              <Typography>No questions available for this project.</Typography>
            )}
          </Typography>
          {userRole === 'STUDENT' && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
              onClick={handleRequestTasterSession}
            >
              Request Taster Session
            </Button>
          )}
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

    {
      userRole == 'STUDENT' &&
      <>
      <Button
        variant="contained"
        onClick={toggleDrawer(!drawerOpen)}
        sx={{ 
          position: 'fixed', 
          right: drawerOpen ? 450 : 60,
          transition: 'right 0.3s', 
          top: '25%', 
          zIndex: 1200 }} // Fixed position for the toggle button
      >
        {drawerOpen ? 'Close Preferences' : 'Open Preferences'}
      </Button>
      <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            variant="persistent"
            sx={{
              width: drawerOpen ? 450 : 60,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerOpen ? 450 : 60,
                transition: 'width 0.3s',
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100%',
                zIndex: 1100,
              },
            }}
          >
            <Box sx={{ width: '100%', p: 2, marginTop:'20%' }}>
              <Typography variant="h6">Selected Projects</Typography>
              {selectedProjects.map((project, index) => (
                <Accordion key={project.supProjectId}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Box>
                        <Typography variant="body1">{project.title}</Typography>
                        <Chip label={`Preference: ${project.preference}`} />
                      </Box>
                      <Box>
                        <IconButton onClick={(event) => {
                          event.stopPropagation();
                          moveProjectUp(index);
                          }} disabled={index === 0}>
                          <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton onClick={(event) => {
                          event.stopPropagation();
                          moveProjectDown(index);
                          }} disabled={index === selectedProjects.length - 1}>
                          <ArrowDownwardIcon />
                        </IconButton>
                        <IconButton onClick={(event) => {
                          event.stopPropagation();
                          handleRemoveProject(project.supProjectId)
                          }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {project.questions && project.questions.length > 0 ? (
                      project.questions.map(question => (
                        <Box key={question.questionId} mb={2}>
                          <Typography>{question.questionText}</Typography>
                          <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="Your answer"
                            onChange={e => handleAnswerChange(project.supProjectId, question.questionId, e.target.value)}
                          />
                        </Box>
                      ))
                    ) : (
                      <Typography>No questions for this project.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
              <Button variant="contained" color="primary" onClick={handleSubmitPreferences} disabled={selectedProjects.length !== 5}>
                Submit Preferences
              </Button>

              {alertVisible && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setAlertVisible(false)}>
                  Please answer all the questions before submitting your preferences.
                </Alert>
              )}
              
            </Box>
          </Drawer>
      </>
  }
    </Box>
  )
}

export default ProjectTable