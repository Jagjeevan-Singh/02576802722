import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import UrlShortener from './UrlShortener';
import UrlStats from './UrlStats';
import { Log } from '../../loginmiddleware/logger';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

function Redirector({ shortLinks, onClick }) {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    // Defensive: reload from localStorage if shortLinks is empty
    let links = shortLinks;
    if (!links || links.length === 0) {
      const stored = localStorage.getItem('shortLinks');
      if (stored) {
        try {
          links = JSON.parse(stored);
        } catch {}
      }
    }
    const link = links.find(l => l.shortcode === shortcode);
    if (link) {
      // Log click event
      const click = {
        timestamp: new Date(),
        source: document.referrer || 'direct',
        location: 'unknown' // You can use a geo API if desired
      };
      link.clicks.push(click);
      Log('frontend', 'info', 'component', `Redirected for shortcode ${shortcode}, click at ${click.timestamp}`);
      if (onClick) onClick(links);
      window.location.href = link.url;
    } else {
      Log('frontend', 'error', 'component', `Shortcode not found: ${shortcode}`);
      navigate('/');
    }
  }, [shortcode, shortLinks, navigate, onClick]);
  return null;
}

export default function AppRouter() {
  const [shortLinks, setShortLinks] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('shortLinks');
    if (stored) {
      try {
        setShortLinks(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save to localStorage whenever shortLinks changes
  useEffect(() => {
    localStorage.setItem('shortLinks', JSON.stringify(shortLinks));
  }, [shortLinks]);

  return (
    <Router>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            URL Shortener
          </Typography>
          <Link href="/" color="inherit" underline="none" sx={{ mx: 2, fontWeight: 500 }}>
            Home
          </Link>
          <Link href="/stats" color="inherit" underline="none" sx={{ mx: 2, fontWeight: 500 }}>
            Stats
          </Link>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: '90vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)', p: 0, m: 0 }}>
        <Routes>
          <Route path="/" element={<UrlShortener onShortened={setShortLinks} />} />
          <Route path="/stats" element={<UrlStats shortLinks={shortLinks} />} />
          <Route path="/:shortcode" element={<Redirector shortLinks={shortLinks} onClick={setShortLinks} />} />
        </Routes>
      </Box>
    </Router>
  );
}
