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
import { useRouter } from "next/navigation";
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
  const [isClient, setIsClient] = useState(false); // New state for client-side rendering

  const router = useRouter();

  if(!Cookies.get('token')){
    router.push('/login')
  }

  useEffect(() => {
    setIsClient(true); // Set to true once on the client
    if (Cookies.get('user_role') === 'ACADEMIC') {
      setIsSupervisor(true);
    }
  }, []);

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

  console.log(inputList);
  console.log("User Role", Cookies.get('user_role'))

  return (
    <Container>
      <Box>
        {isClient && isSupervisor && 
        <Button variant="contained" href="/addproject">Add Project</Button>
        }
      </Box>
      <ProjectTable />
    </Container>
  );
};

export default page;
