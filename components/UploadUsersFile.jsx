'use client';
import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axiosInstance from '@utils/axios';

const UploadUsersFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a CSV file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axiosInstance.post('/api/v1/auth/register/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <Container>
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          CSV User Upload
        </Typography>

        <input
          accept=".csv"
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
            Upload CSV
          </Button>
        </label>

        <Button
          variant="contained"
          color="success"
          onClick={handleUpload}
          sx={{ marginLeft: 2 }}
          disabled={!selectedFile}
        >
          Submit
        </Button>

        {selectedFile && (
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Selected file: {selectedFile.name}
          </Typography>
        )}
        
        <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
          <Typography variant="h6">Steps to Create a CSV File</Typography>
          <ol>
            <li>Open your preferred spreadsheet software (e.g., Microsoft Excel or Google Sheets).</li>
            <li>Enter the data for each user in rows, with columns for "First Name," "Last Name," "Email," etc.</li>
            <li>Save the file in CSV format (e.g., <strong>users.csv</strong>).</li>
            <li>Make sure to include headers in the first row of the CSV.</li>
          </ol>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Note: Make sure your CSV file matches the required format. You can refer to the example below.
          </Typography>

          <Table sx={{ marginTop: 2 }} aria-label="csv example">
            <TableHead>
              <TableRow>
                <TableCell><strong>firstname</strong></TableCell>
                <TableCell><strong>lastname</strong></TableCell>
                <TableCell><strong>email</strong></TableCell>
                <TableCell><strong>password</strong></TableCell>
                <TableCell><strong>role</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>John</TableCell>
                <TableCell>Doe</TableCell>
                <TableCell>john.doe@example.com</TableCell>
                <TableCell>password123</TableCell>
                <TableCell>STUDENT</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane</TableCell>
                <TableCell>Smith</TableCell>
                <TableCell>jane.smith@example.com</TableCell>
                <TableCell>password456</TableCell>
                <TableCell>ACADEMIC</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        
        {/* <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Example CSV Format:</Typography>
          <img src={csvExample} alt="CSV Example Format" style={{ width: '100%', maxWidth: 600, marginTop: 16 }} />
        </Box> */}
      </Box>
    </Container>
  );
};

export default UploadUsersFile;