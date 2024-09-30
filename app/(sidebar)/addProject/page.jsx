"use client"
import { Box, Button, Checkbox, Chip, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography, useTheme } from '@mui/material'
import axiosInstance from '@utils/axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];

const btnStyle = {
  padding: "0.6rem",
  cursor: "pointer",
  marginTop: "1rem",
  width:"10%"
};

const inputStyles = {
  marginTop: "1rem",
};

const page = () => {

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [inputList, setInputList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const theme = useTheme();
  const [tags, setTags] = useState();
  const [tagName, setTagName] = useState([]);
  const [supervisors, setSupervisors] = useState();
  const [asoSupName, setAsoSupName] = useState([]);
  const [programes, setProgrames] = useState();
  const [programeName, setProgrameName] = useState([]);

  //formDataStates
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [program, setprogram] = useState("");
  const [prerequisite, setPrerequisite] = useState("");
  const [quota, setQuota] = useState();
  const [reference, setReference] = useState("");

  const router = useRouter();

  if(!Cookies.get('token')){
    router.push('/login')
  }

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = (event) => {
    event.preventDefault();
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        questionText: "",
      },
    ]);
  };

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setTagName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleProgrameChange = (event) => {
    const {
      target: { value },
    } = event;
    setProgrameName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleAsoSupervisorChange = (event) => {
    const {
      target: { value },
    } = event;
    setAsoSupName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const newInputList = [...inputList];
    newInputList[index].questionText = value;
    newInputList[index].input_rank = index + 1;
    setInputList(newInputList);
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
  };

  useEffect(() => {
    if(inputList.length == 0){
        setIsDisabled(false);
    }
    if (inputList.length > 0) {
      inputList[inputList.length - 1].questionText === ""
        ? setIsDisabled(true)
        : setIsDisabled(false);
    }
  });

  useEffect(()=>{
    axiosInstance.get("/api/v1/users/supervisor?role=ACADEMIC").then((data)=>{setSupervisors(data.data);})
    axiosInstance.get("api/v1/programs").then((data)=>{setProgrames(data.data)})
    axiosInstance.get("/api/v1/projects/tags").then((data) => {setTags(data.data)})
  },[])

  console.log("programeName", programeName);
  console.log("asoSupName", asoSupName);
  console.log("Tags",tagName);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const programIds = programeName.map(program => program.programId)
    const associateSupervisorIds = asoSupName.map(sup => sup.userId)

    const formData = {
      title: title,
      description:description,
      supervisor: Cookies.get('userId'),
      associateSupervisorIds: associateSupervisorIds,
      programeIds: programIds,
      status: "Available",
      questions: inputList,
      prerequisite: prerequisite,
      suitableFor: program,
      quota: quota,
      reference: reference,
      tags: tagName,
    };

    axiosInstance.post('api/v1/projects/create', formData).then(() => {
      toast.success("Project added successfully");
    })
    .catch((error) => {
      toast.error("Error")
    });
  };

  return (
    <Box>
      <Typography variant='h4' fontWeight={700} mb={2}>Add Project</Typography>
    <form onSubmit={handleSubmit}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          {/* Steps */}
          <Grid
            container
            direction={{ xs: "column", md: "row" }}
            columnSpacing={5}
            rowSpacing={3}
          >
            {/* Title */}
                <Grid item xs={5}>
                  <label style={{ fontWeight: "bold" }}>Title</label>
                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    name="title"
                    onChange={(event) => {setTitle(event.target.value)}}
                  />
                </Grid>
                {/* Discription */}
                <Grid item xs={7}>
                  <label style={{ fontWeight: "bold" }}>Description</label>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={6}
                    margin="dense"
                    size="small"
                    name="description"
                    onChange={(event) => {setDescription(event.target.value)}}
                  />
                </Grid>
                {/* Programe  */}
                <Grid item xs={5}>
                <label style={{ fontWeight: "bold" }}>
                    Programes (Suitable For)
                  </label>
                  <FormControl size='small' fullWidth margin='dense'>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={programeName}
                      onChange={handleProgrameChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value.title} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      { programes &&
                      // @ts-ignore
                      programes.map((name) => (
                        <MenuItem
                          key={name.programId}
                          value={name}
                          style={getStyles(name, programeName, theme)}
                        >
                          <Checkbox checked={programeName.indexOf(name) > -1}/>
                            <ListItemText primary={name.title}/>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid> 
                {/* Quota */}
                <Grid item xs={3}>
                  <label style={{ fontWeight: "bold" }}>Quota</label>
                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    type="number"
                    name="quota"
                    // @ts-ignore
                    onChange={(event) => {setQuota(event.target.value)}}
                  />
                </Grid>
                {/* Associate Sup */}
                <Grid item xs={4}>
                <label style={{ fontWeight: "bold" }}>
                    Associate Supervisor
                  </label>
                  <FormControl size='small' fullWidth margin='dense'>
                    <Select
                      multiple
                      value={asoSupName}
                      onChange={handleAsoSupervisorChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value.firstname + " " + value.lastname} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {supervisors&&supervisors
                      // @ts-ignore
                      .map((sup) => (
                        <MenuItem
                          value={sup}
                          style={getStyles(sup, tagName, theme)}
                        >
                          <Checkbox checked={asoSupName.indexOf(sup) > -1}/>
                          <ListItemText primary={sup.firstname + " " + sup.lastname}/>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Prerequisite */}
                <Grid item xs={6}>
                  <label style={{ fontWeight: "bold" }}>Prerequisite</label>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={6}
                    margin="dense"
                    size="small"
                    name="prerequisite"
                    onChange={(event) => {setPrerequisite(event.target.value)}}
                  />
                </Grid>     
                {/* References */}
                <Grid item xs={6}>
                  <label style={{ fontWeight: "bold" }}>References</label>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={6}
                    margin="dense"
                    size="small"
                    name="reference"
                    onChange={(event) => {setReference(event.target.value)}}
                  />
                </Grid>     
                {/* Tags */}
                <Grid item xs={6}>
                <label style={{ fontWeight: "bold" }}>
                    Tags
                  </label>
                  <FormControl size='small' fullWidth margin='dense'>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={tagName}
                      onChange={handleTagChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {tags && tags.
// @ts-ignore
                      map((name) => (
                        <MenuItem
                          key={name.id}
                          value={name.name}
                          style={getStyles(name, tagName, theme)}
                        >
                          <Checkbox checked={tagName.indexOf(name.name) > -1}/>
                          <ListItemText primary={name.name}/>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>   
                {/* Questions */}
              <Grid item xs={12}>
              <label style={{ fontWeight: "bold" }}>Questions</label>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  // justifyContent={"center"}
                  // alignItems={"center"}
                >
                  {inputList.length > 0
                    ? inputList.map((input, index) => (
                        <div key={index} style={inputStyles}>
                          <TextField
                            id="outlined-basic"
                            label={`Question ${index + 1}`}
                            variant="outlined"
                            fullWidth
                            multiline
                            onChange={(event) =>
                              handleInputChange(event, index)
                            }
                          />
                          <button
                            style={btnStyle}
                            onClick={() => handleRemoveItem(index)}
                          >
                            <span role="img" aria-label="x emoji">
                              ❌
                            </span>
                          </button>
                        </div>
                      ))
                    : "No Question Added"}
                  <Button
                    variant="outlined"
                    style={btnStyle}
                    onClick={handleListAdd}
                    disabled={isDisabled}
                  >
                    Add Question
                  </Button>
                </Box>
              </Grid>
          </Grid>


              <Button variant='contained' type="submit" sx={{marginTop:'5%'}}>
                Submit
              </Button>
              
    </form>
    </Box>
  )
}

export default page