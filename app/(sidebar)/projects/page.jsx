"use client";
import ProjectStepper from "@components/ProjectStepper";
import ProjectTable from "@components/ProjectTable";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axiosInstance from "@utils/axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "65%",
  height: "auto",
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

const btnStyle = {
  padding: "0.6rem",
  cursor: "pointer",
  marginTop: "1rem",
};

const inputStyles = {
  marginTop: "1rem",
};

const page = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputList, setInputList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);

  useEffect(() => {
    if (Cookies.get('user_role') === 'ACADEMIC') {
      setIsSupervisor(true);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axiosInstance.post("api/v1/projects/create", {
        title : data.get('title'),
        description : data.get('description'),
        course : data.get('course'),
        status:"Available",
        supervisor : Cookies.get('userId'),
        questions : inputList
    }).then(() => {alert('Project Added Successfully')})
    .then(()=>{handleClose;})
    console.log({
        title : data.get('title'),
        description : data.get('description'),
        course : data.get('course'),
        status:"Available",
        supervisor : Cookies.get('userId'),
        questions : inputList
    })
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

  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        questionText: "",
      },
    ]);
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

  console.log(inputList);
  console.log("User Role", Cookies.get('user_role'))

  return (
    <Container>
      <Box>
        {isSupervisor && 
        <Button variant="contained" href="/addproject">Add Project</Button>
        }
      </Box>
      <ProjectTable />
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component={"form"} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            maxRows={2}
            id="outlined-basic"
            label="Project Title"
            name="title"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            maxRows={6}
            id="outlined-basic"
            label="Description"
            name="description"
            variant="outlined"
            margin="normal"
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Course</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="course"
              label="Course"
            >
              <MenuItem value={'MSc Computer Science'}>MSc Computer Science</MenuItem>
              <MenuItem value={'MSc Artificial Inteligence'}>MSc Artificial Inteligence</MenuItem>
              <MenuItem value={'MSc AI with Business'}>MSc AI with Business</MenuItem>
            </Select>
          </FormControl>

          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
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
                      onChange={(event) => handleInputChange(event, index)}
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

          <Button type="submit" variant="contained">
            Add Project
          </Button>
        </Box>
      </Modal> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
          <Box sx={style}>
            <ProjectStepper/>
          </Box>
      </Modal>
    </Container>
  );
};

export default page;
