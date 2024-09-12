"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios"; // Assuming you're using Axios for API requests
import axiosInstance from "@utils/axios";

const StudentPreferences = () => {
  const [studentsWithPreferences, setStudentsWithPreferences] = useState([]); // Store student preferences
  const [remainingCount, setRemainingCount] = useState(0); // Store remaining students count

  // Fetch student preferences data
  useEffect(() => {
    const fetchStudentPreferences = async () => {
      try {
        const response = await axiosInstance.get("/api/student-choices/mod-owner/preferences-status");
        setStudentsWithPreferences(response.data.studentChoices);
        setRemainingCount(response.data.remainingCount);
      } catch (error) {
        console.error("Error fetching student preferences:", error);
      }
    };
    fetchStudentPreferences();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Display remaining students count */}
      <Typography variant="h6">
        Remaining Students to Submit Preferences: {remainingCount}
      </Typography>

      {/* Accordion for each student */}
      {studentsWithPreferences.map((studentChoice) => (
        <Accordion key={studentChoice.student.userId}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${studentChoice.student.userId}-content`}
            id={`panel${studentChoice.student.userId}-header`}
          >
            <Typography>
              {studentChoice.student.firstname} {studentChoice.student.lastname} ({studentChoice.student.email})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1">Project Preferences:</Typography>
            <List>
              {studentChoice.projectPreferences.map((preference) => (
                <ListItem key={preference.projectId}>
                  <ListItemText
                    primary={`Preference ${preference.preference}: ${preference.projectTitle}`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default StudentPreferences;
