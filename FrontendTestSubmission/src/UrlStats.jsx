import React, { useState, useEffect } from 'react';
import { Log } from '../../loginmiddleware/logger';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
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
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h4: { fontWeight: 800, color: '#0f172a' },
    h6: { fontWeight: 700, color: '#0f172a' },
  },
});

export default function UrlStats({ shortLinks }) {
  const [links, setLinks] = useState([]);
  const [openRows, setOpenRows] = useState({});

  useEffect(() => {
    setLinks(shortLinks || []);
    Log('frontend', 'info', 'component', 'Statistics page loaded');
  }, [shortLinks]);

  const handleRowClick = (idx) => {
    setOpenRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
          maxWidth: 1200,
          background: '#fff',
          borderRadius: 4,
          boxShadow: 6,
          p: { xs: 2, sm: 4 },
          mt: { xs: 10, sm: 12 },
          mb: { xs: 2, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: '#0f172a', mb: 3 }}>Shortened URL Statistics</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
            <Table>
              <TableHead sx={{ background: '#f1f5f9' }}>
                <TableRow>
                  <TableCell />
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Clicks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {links.map((link, idx) => (
                  <React.Fragment key={idx}>
                    <TableRow hover>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleRowClick(idx)}>
                          {openRows[idx] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <a href={`/${link.shortcode}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>{window.location.origin}/{link.shortcode}</a>
                      </TableCell>
                      <TableCell>{link.url}</TableCell>
                      <TableCell>{new Date(link.created).toLocaleString()}</TableCell>
                      <TableCell>{new Date(link.expires).toLocaleString()}</TableCell>
                      <TableCell>{link.clicks.length}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={openRows[idx]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                              Click Details
                            </Typography>
                            {link.clicks.length === 0 ? (
                              <Typography variant="body2" color="text.secondary">No clicks yet.</Typography>
                            ) : (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Source</TableCell>
                                    <TableCell>Location</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {link.clicks.map((click, cidx) => (
                                    <TableRow key={cidx}>
                                      <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                      <TableCell>{click.source}</TableCell>
                                      <TableCell>{click.location || 'Unknown'}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
