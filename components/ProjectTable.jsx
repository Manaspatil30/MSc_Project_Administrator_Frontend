'use client'
import { Box, Button, Checkbox, Chip, Drawer, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
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

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      width: 250,
    },
  },
};

const columns = [
  { id: 'name', label: 'Title', minWidth: 170 },
  { id: 'code', label: 'Project Id', minWidth: 100 },
  {
    id: 'population',
    label: 'Status',
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Supervisor',
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString('en-US'),
  },
  { id: 'actions', label: '', minWidth: 100, align: "right" },
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

  useEffect(()=>{
    // @ts-ignore
    setUserRole(Cookies.get('user_role'))
  },[])
  

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
      setSelectedProjects([...selectedProjects, { ...project, preference: selectedProjects.length + 1 }]);
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

  const handleSubmitPreferences = () => {
    const payload = {
      projectPreferences: selectedProjects.map(proj => ({
        projectId: proj.projectId,
        preference: proj.preference,
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
                      {row.title}
                    </TableCell>
                    <TableCell>
                      {row.supProjectId}
                    </TableCell>
                    <TableCell align='right'>
                      {row.status}
                    </TableCell>
                    <TableCell align='right'>
                      {row.supervisor.firstname}
                    </TableCell>
                    {
                      Cookies.get('user_role') == 'STUDENT' ? 
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

    {
      userRole == 'STUDENT' &&
      <>
      <Button
        variant="contained"
        onClick={toggleDrawer(!drawerOpen)}
        sx={{ 
          position: 'fixed', 
          right: drawerOpen ? 350 : 60,
          transition: 'right 0.3s', 
          top: '20%', 
          zIndex: 1200 }} // Fixed position for the toggle button
      >
        {drawerOpen ? 'Close Preferences' : 'Open Preferences'}
      </Button>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        variant="persistent" // Make it persistent to create an accordion-like effect
        sx={{
          width: drawerOpen ? 350 : 60, // Control width based on state (like an accordion)
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? 350 : 60,
            transition: 'width 0.3s', // Smooth transition for the sliding effect
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            zIndex: 1100,
          },
        }}
      >
    <Box sx={{ width: '100%', p: 2 }}>
        <Typography variant="h6">Selected Projects</Typography>
        {selectedProjects.map((project, index) => (
          <Paper key={project.supProjectId} sx={{ p: 2, mb: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body1">{project.title}</Typography>
                <Chip label={`Preference: ${project.preference}`} />
              </Box>
              <Box>
                <IconButton onClick={() => moveProjectUp(index)} disabled={index === 0}>
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton onClick={() => moveProjectDown(index)} disabled={index === selectedProjects.length - 1}>
                  <ArrowDownwardIcon />
                </IconButton>
                <IconButton onClick={() => handleRemoveProject(project.supProjectId)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
        <Button variant="contained" color="primary" onClick={handleSubmitPreferences} disabled={selectedProjects.length !== 5}>
          Submit Preferences
        </Button>
      </Box>
      </Drawer>
      </>
  }
    </Box>
  )
}

export default ProjectTable