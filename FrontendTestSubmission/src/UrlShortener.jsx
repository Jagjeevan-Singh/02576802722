import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import BarChartIcon from '@mui/icons-material/BarChart';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, Box, Typography, Grid, Paper, Snackbar, Alert } from '@mui/material';
import { Log } from '../../loginmiddleware/logger';

function generateShortcode(existingShortcodes) {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 8);
  } while (existingShortcodes.has(code));
  return code;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{3,12}$/.test(code);
}

const DEFAULT_VALIDITY = 30;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',         // blue-600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#16a34a',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#0ea5e9', 
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h4: { fontWeight: 800, color: '#0f172a' },
    h6: { fontWeight: 700, color: '#0f172a' },
  },
});


export default function UrlShortener({ onShortened }) {
  const [inputs, setInputs] = useState([
    { url: '', validity: '', shortcode: '' }
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shortLinks, setShortLinks] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
      Log('frontend', 'info', 'component', 'Added new URL input field');
    }
  };

  const handleRemoveInput = (idx) => {
    const newInputs = inputs.filter((_, i) => i !== idx);
    setInputs(newInputs);
    Log('frontend', 'info', 'component', `Removed URL input field at index ${idx}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    Log('frontend', 'info', 'component', 'Attempting to shorten URLs');

    // Collect all existing shortcodes for uniqueness
    const existingShortcodes = new Set(shortLinks.map(link => link.shortcode));
    const newResults = [];
    for (let i = 0; i < inputs.length; i++) {
      const { url, validity, shortcode } = inputs[i];
      if (!isValidUrl(url)) {
        setError(`Invalid URL at row ${i + 1}`);
        Log('frontend', 'error', 'component', `Invalid URL at row ${i + 1}: ${url}`);
        return;
      }
      let validPeriod = parseInt(validity);
      if (validity && (isNaN(validPeriod) || validPeriod <= 0)) {
        setError(`Invalid validity at row ${i + 1}`);
        Log('frontend', 'error', 'component', `Invalid validity at row ${i + 1}: ${validity}`);
        return;
      }
      let code = shortcode.trim();
      if (code) {
        if (!isValidShortcode(code)) {
          setError(`Invalid shortcode at row ${i + 1}`);
          Log('frontend', 'error', 'component', `Invalid shortcode at row ${i + 1}: ${code}`);
          return;
        }
        if (existingShortcodes.has(code)) {
          setError(`Shortcode already used at row ${i + 1}`);
          Log('frontend', 'error', 'component', `Shortcode collision at row ${i + 1}: ${code}`);
          return;
        }
      } else {
        code = generateShortcode(existingShortcodes);
      }
      existingShortcodes.add(code);
      const now = new Date();
      const expires = new Date(now.getTime() + 60000 * (validPeriod || DEFAULT_VALIDITY));
      newResults.push({
        url,
        shortcode: code,
        created: now,
        expires,
        clicks: [],
      });
      Log('frontend', 'info', 'component', `Shortened URL: ${url} as ${code} valid until ${expires}`);
    }
    setShortLinks([...shortLinks, ...newResults]);
    setResults(newResults);
    setSuccess('URLs shortened successfully!');
    if (onShortened) onShortened([...shortLinks, ...newResults]);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" color="primary" sx={{ zIndex: 2, boxShadow: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, textAlign: 'left' }}>
            UrlShortner
          </Typography>
          <Tooltip title="Shorten URL">
            <IconButton color="inherit" onClick={() => navigate('/') }>
              <InsertLinkIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Statistics">
            <IconButton color="inherit" onClick={() => navigate('/stats') }>
              <BarChartIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #111 0%, #222 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0,
        m: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        overflow: 'auto',
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: 700,
          background: '#fff',
          borderRadius: 4,
          boxShadow: 6,
          p: { xs: 2, sm: 4 },
          mt: { xs: 10, sm: 12 }, // add margin for navbar
          mb: { xs: 2, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
        }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#111', mb: 3, fontWeight: 800, letterSpacing: 1 }}>URL Shortener</Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              {inputs.map((input, idx) => (
                <Grid item xs={12} key={idx}>
                  <Paper sx={{ p: 2, mb: 1, borderRadius: 3, boxShadow: 2, background: '#f5f5f5' }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          label="Long URL"
                          value={input.url}
                          onChange={e => handleInputChange(idx, 'url', e.target.value)}
                          fullWidth
                          required
                          sx={{ background: '#fff', borderRadius: 2, color: '#111' }}
                          InputProps={{ style: { color: '#111' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Validity (min)"
                          value={input.validity}
                          onChange={e => handleInputChange(idx, 'validity', e.target.value)}
                          fullWidth
                          type="number"
                          inputProps={{ min: 1 }}
                          sx={{ background: '#fff', borderRadius: 2, color: '#111' }}
                          InputProps={{ style: { color: '#111' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Custom Shortcode"
                          value={input.shortcode}
                          onChange={e => handleInputChange(idx, 'shortcode', e.target.value)}
                          fullWidth
                          sx={{ background: '#fff', borderRadius: 2, color: '#111' }}
                          InputProps={{ style: { color: '#111' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                        {inputs.length > 1 && (
                          <Button color="error" onClick={() => handleRemoveInput(idx)} variant="outlined" sx={{ minWidth: 90 }}>
                            Remove
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleAddInput} disabled={inputs.length >= 5} sx={{ mr: 2, fontWeight: 600, color: '#111', borderColor: '#111' }}>
                Add URL
              </Button>
              <Button variant="contained" type="submit" sx={{ fontWeight: 600, background: '#111', color: '#fff', ':hover': { background: '#222' } }}>Shorten</Button>
            </Box>
          </form>
          {results.length > 0 && (
            <Box sx={{ mt: 3, width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#111', fontWeight: 700 }}>Shortened URLs</Typography>
              {results.map((res, idx) => (
                <Paper key={idx} sx={{ p: 2, mt: 1, borderRadius: 3, boxShadow: 2, background: '#fff' }}>
                  <Typography sx={{ color: '#111', fontWeight: 500 }}>Original: <span style={{ color: '#0ea5e9' }}>{res.url}</span></Typography>
                  <Typography sx={{ color: '#111', fontWeight: 500 }}>Short URL: <a href={`/${res.shortcode}`} style={{ color: '#111', textDecoration: 'underline' }}>{window.location.origin}/{res.shortcode}</a></Typography>
                  <Typography sx={{ color: '#111', fontWeight: 500 }}>Expires: <span style={{ color: '#f59e42' }}>{res.expires.toLocaleString()}</span></Typography>
                </Paper>
              ))}
            </Box>
          )}
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
          </Snackbar>
          <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
            <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
          </Snackbar>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
