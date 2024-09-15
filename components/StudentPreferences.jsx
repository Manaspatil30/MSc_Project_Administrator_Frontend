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
  Link,
  Grid,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios"; // Assuming you're using Axios for API requests
import axiosInstance from "@utils/axios";

const StudentPreferences = () => {
  const [studentsWithPreferences, setStudentsWithPreferences] = useState([]); // Store student preferences
  const [studentsWithoutPreferences, setStudentsWithoutPreferences] = useState([]); // Store students without preference
  const [remainingCount, setRemainingCount] = useState(0); // Store remaining students count
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [remainingSearchQuery, setRemainingSearchQuery] = useState(''); // Search query

  // Fetch student preferences data
  useEffect(() => {
    const fetchStudentPreferences = async () => {
      try {
        const response = await axiosInstance.get("/api/student-choices/mod-owner/preferences-status");
        setStudentsWithPreferences(response.data.studentChoices);
        setStudentsWithoutPreferences(response.data.studentsWithoutPreferences);
        setRemainingCount(response.data.remainingCount);
      } catch (error) {
        console.error("Error fetching student preferences:", error);
      }
    };
    fetchStudentPreferences();
  }, []);

  const filteredStudents = studentsWithPreferences.filter((studentChoice) =>
    `${studentChoice.student.firstname} ${studentChoice.student.lastname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredRemainingStudents = studentsWithoutPreferences.filter((studentChoice) =>
    `${studentChoice && studentChoice.firstname} ${ studentChoice && studentChoice.lastname}`
      .toLowerCase()
      .includes(remainingSearchQuery.toLowerCase())
  );


  return (
    <Box sx={{ p: 3 }}>
      
      {/* Remaining Students Heading */}
      <Typography variant="h6">
        Remaining Students to Submit Preferences: {remainingCount}
      </Typography>

      <Grid item xs={6} mb={2}>
          <TextField
            label="Search Students"
            variant="outlined"
            fullWidth
            value={remainingSearchQuery}
            onChange={(e) => setRemainingSearchQuery(e.target.value)}
          />
      </Grid>

      {/* Accordion for remaining students (students who haven't submitted preferences) */}
      {filteredRemainingStudents.length > 0 ?
          filteredRemainingStudents.map((student) => (
            <Accordion key={student.userId}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-remaining-${student.userId}-content`}
                id={`panel-remaining-${student.userId}-header`}
              >
                <Typography>
                  {student.firstname} {student.lastname} ({student.email}) - Not Submitted
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  This student has not submitted their project preferences.
                </Typography>
                <Link href={`mailto:${student.email}`} underline="hover">
                  Click here to email {student.firstname}.
                </Link>
              </AccordionDetails>
            </Accordion>
          ))
          :
          studentsWithoutPreferences.map((student) => (
            <Accordion key={student.userId}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-remaining-${student.userId}-content`}
                id={`panel-remaining-${student.userId}-header`}
              >
                <Typography>
                  {student.firstname} {student.lastname} ({student.email}) - Not Submitted
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  This student has not submitted their project preferences.
                </Typography>
                <Link href={`mailto:${student.email}`} underline="hover">
                  Click here to email {student.firstname}.
                </Link>
              </AccordionDetails>
            </Accordion>
          ))
      }

      {/* Submitted Students Heading with Search Bar */}
      <Grid container alignItems="center" sx={{ mt: 3, mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="h6">Students Who Have Submitted Preferences</Typography>
        </Grid>
      </Grid>
      <Grid item xs={6} mb={2}>
          <TextField
            label="Search Students"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>

      {/* Accordion for students who submitted preferences */}
      {filteredStudents.length > 0 ? 
      filteredStudents.map((studentChoice) => (
        <Accordion key={studentChoice.student.userId}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-submitted-${studentChoice.student.userId}-content`}
            id={`panel-submitted-${studentChoice.student.userId}-header`}
          >
            <Typography>
              {studentChoice.student.firstname} {studentChoice.student.lastname} ({studentChoice.student.email}) - Submitted
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
      )) :
      studentsWithPreferences.map((studentChoice) => (
        <Accordion key={studentChoice.student.userId}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-submitted-${studentChoice.student.userId}-content`}
            id={`panel-submitted-${studentChoice.student.userId}-header`}
          >
            <Typography>
              {studentChoice.student.firstname} {studentChoice.student.lastname} ({studentChoice.student.email}) - Submitted
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
