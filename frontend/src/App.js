import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";

function App() {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [resultBackend1, setResultBackend1] = useState(null);
  const [resultBackend2, setResultBackend2] = useState(null);
  const [errorBackend1, setErrorBackend1] = useState(null);
  const [errorBackend2, setErrorBackend2] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBackend1(null);
    setErrorBackend2(null);
    setLoading(true);

    try {
      // Call Backend 1 (Port 8000)
      const response1 = axios.post("http://127.0.0.1:8000/assign_codes", {
        patient_name: patientName,
        age: parseInt(age),
        notes: notes,
      });

      // Call Backend 2 (Port 8001)
      const response2 = axios.post("http://127.0.0.1:8000/assign_codes_gpt", {
        patient_name: patientName,
        age: parseInt(age),
        notes: notes,
      });

      // Wait for both requests to complete
      const [backend1Data, backend2Data] = await Promise.all([
        response1,
        response2,
      ]);

      setResultBackend1(backend1Data.data);
      setResultBackend2(backend2Data.data);
    } catch (error) {
      if (error.config.url.includes("8000")) {
        setErrorBackend1("Failed to connect to Backend 1 (Port 8000)");
      } else if (error.config.url.includes("8001")) {
        setErrorBackend2("Failed to connect to Backend 2 (Port 8001)");
      }
      console.error("Error fetching codes", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Diagnosis to Code Demo
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Patient Name"
              variant="outlined"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Age"
              type="number"
              variant="outlined"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Enter Medical Notes"
              variant="outlined"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              multiline
              rows={4}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Assign Codes
            </Button>
          </Box>
        </form>

        {loading && (
          <Box mt={2} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}

        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {/* Backend 1 Results */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
              <Typography variant="h6" color="primary">
                Zero Shot classification
              </Typography>
              {errorBackend1 ? (
                <Alert severity="error">{errorBackend1}</Alert>
              ) : resultBackend1 ? (
                <>
                  <Typography>
                    <b>Diagnosis:</b> {resultBackend1.diagnosis}
                  </Typography>
                  <Typography>
                    <b>ICD-10 Code:</b> {resultBackend1.icd_10_code}
                  </Typography>
                  <Typography>
                    <b>HCC Code:</b> {resultBackend1.hcc_code}
                  </Typography>
                </>
              ) : null}
            </Paper>
          </Grid>

          {/* Backend 2 Results */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
              <Typography variant="h6" color="secondary">
                GPT 4
              </Typography>
              {errorBackend2 ? (
                <Alert severity="error">{errorBackend2}</Alert>
              ) : resultBackend2 ? (
                <>
                  <Typography>
                    <b>Diagnosis:</b> {resultBackend2.diagnosis}
                  </Typography>
                  <Typography>
                    <b>ICD-10 Code:</b> {resultBackend2.icd_10_code}
                  </Typography>
                  <Typography>
                    <b>HCC Code:</b> {resultBackend2.hcc_code}
                  </Typography>
                </>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
