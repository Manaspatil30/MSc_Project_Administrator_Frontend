import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axiosInstance from "@utils/axios";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

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
};

const inputStyles = {
  marginTop: "1rem",
};

const ProjectStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [inputList, setInputList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const theme = useTheme();
  const [tagName, setTagName] = useState([]);
  const [supervisors, setSupervisors] = useState();
  const [asoSupName, setAsoSupName] = useState([]);

  //formDataStates
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [program, setprogram] = useState("");
  const [prerequisite, setPrerequisite] = useState("");
  const [quota, setQuota] = useState();
  const [reference, setReference] = useState("");

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

  const handleAsoSupervisorChange = (event) => {
    const {
      target: { value },
    } = event;
    setAsoSupName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  console.log("asoSupName", asoSupName);

  console.log("Tags",tagName);

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
  },[])
  
  console.log(supervisors)

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const formData = {
      title: title,
      description:description,
      supervisor: Cookies.get('userId'),
      associateSupervisor: asoSupName,
      program: program,
      status: "Available",
      questions: inputList,
      prerequisite: prerequisite,
      suitableFor: program,
      quota: quota,
      reference: reference,
      tags: tagName,
    };

    axiosInstance.post('api/v1/projects/create', formData)
    .then(()=>{toast.success("project added successfully")})
    .then(()=>{handleNext})
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Project Added Successfully
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Add Project again</Button>
          </Box>
        </React.Fragment>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Steps */}
          <Grid
            container
            direction={{ xs: "column", md: "row" }}
            columnSpacing={5}
            rowSpacing={3}
          >
            {/* Step 1 */}
            {activeStep == 0 && (
              <>
                <Grid item xs={12}>
                  <label style={{ fontWeight: "bold" }}>Title</label>
                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    name="title"
                    onChange={(event) => {setTitle(event.target.value)}}
                  />
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <label style={{ fontWeight: "bold" }}>Program</label>
                  <FormControl fullWidth margin="dense">
                    <Select
                      name="program"
                      margin="dense"
                      onChange={(event) => {setprogram(event.target.value)}}
                    >
                      <MenuItem value={"MSc Computer Science"}>
                        MSc Computer Science
                      </MenuItem>
                      <MenuItem value={"MSc Artificial Inteligence"}>
                        MSc Artificial Inteligence
                      </MenuItem>
                      <MenuItem value={"MSc AI with Business"}>
                        MSc AI with Business
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
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
              </>
            )}

            {/* Step 2 */}
            {activeStep == 1 && (
              <>
                <Grid item xs={12}>
                <label style={{ fontWeight: "bold" }}>
                    Associate Supervisor
                  </label>
                  <FormControl fullWidth>
                    <Select
                      multiple
                      value={asoSupName}
                      onChange={handleAsoSupervisorChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
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
                      {supervisors&&supervisors
// @ts-ignore
                      .map((sup) => (
                        <MenuItem
                          value={sup.userId}
                          style={getStyles(sup.firstname, tagName, theme)}
                        >
                          {sup.firstname + " " + sup.lastname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <label style={{ fontWeight: "bold" }}>Quota</label>
                  <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    type="number"
                    name="quota"
                    onChange={(event) => {setQuota(event.target.value)}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label style={{ fontWeight: "bold" }}>
                    Tags
                  </label>
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-chip-label"> Select Tags</InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={tagName}
                      onChange={handleTagChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
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
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, tagName, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
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
              </>
            )}

            {/* Step 3 */}
            {activeStep == 2 && (
              <Grid item xs={12}>
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
                    variant="contained"
                    style={btnStyle}
                    onClick={handleListAdd}
                    disabled={isDisabled}
                  >
                    Add Question
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Buttons */}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}

              {activeStep === steps.length - 1 ? 
              <Button type="submit">
                Finish
              </Button>
              :
              <Button onClick={handleNext}>
                Next
              </Button>
              }

          </Box>
        </form>
      )}
    </Box>
  );
};

export default ProjectStepper;
