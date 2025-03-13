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

  const BACKEND_URL = "https://chartahealthdemo-production.up.railway.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBackend1(null);
    setErrorBackend2(null);
    setLoading(true);

    try {
      // ✅ First API call (Zero-Shot Classification)
      const response1 = await axios.post(`${BACKEND_URL}/assign_codes`, {
        patient_name: patientName,
        age: parseInt(age),
        notes: notes,
      });

      setResultBackend1(response1.data); // 🔥 Display result immediately!

      // ✅ Second API call (GPT-4, runs AFTER first call finishes)
      const response2 = await axios.post(`${BACKEND_URL}/assign_codes_gpt`, {
        patient_name: patientName,
        age: parseInt(age),
        notes: notes,
      });

      setResultBackend2(response2.data);
    } catch (error) {
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
