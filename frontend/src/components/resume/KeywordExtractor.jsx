/**
 * Keyword Extractor Component
 * Allows users to extract keywords from resume text or uploaded resume
 */

import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Divider, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';
import { extractKeywords } from '../../api/resumes';
import KeywordsList from './KeywordsList';

const KeywordExtractor = ({ resumeId, resumeFilename }) => {
  const [loading, setLoading] = useState(false);
  const [extractionMethod, setExtractionMethod] = useState(resumeId ? 'resume' : 'text');
  const [resumeText, setResumeText] = useState('');
  const [keywords, setKeywords] = useState([]);
  
  const handleExtract = async () => {
    try {
      setLoading(true);
      
      // Show loading toast
      const loadingToastId = toast.loading('Extracting keywords...');
      
      // Prepare parameters based on extraction method
      const params = {};
      if (extractionMethod === 'resume' && resumeId) {
        params.resumeId = resumeId;
      } else if (extractionMethod === 'text' && resumeText.trim()) {
        params.text = resumeText;
      } else {
        toast.error('Please provide resume text or select a resume');
        toast.dismiss(loadingToastId);
        setLoading(false);
        return;
      }
      
      // Call API to extract keywords
      const response = await extractKeywords(params);
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      if (response.success) {
        setKeywords(response.data.skills);
        toast.success(`Extracted ${response.data.count} keywords`, {
          id: 'extract-success',
          duration: 3000,
          icon: '🔍'
        });
      } else {
        toast.error(response.error?.message || 'Failed to extract keywords');
      }
    } catch (error) {
      console.error('Error extracting keywords:', error);
      toast.error('Failed to extract keywords: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Keyword Extraction
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Extract keywords and skills from your resume to understand what employers are looking for.
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Typography variant="subtitle2" gutterBottom>
                Extraction Method
              </Typography>
              <Select
                value={extractionMethod}
                onChange={(e) => setExtractionMethod(e.target.value)}
                disabled={loading}
              >
                {resumeId && (
                  <MenuItem value="resume">
                    Use Current Resume {resumeFilename ? `(${resumeFilename})` : ''}
                  </MenuItem>
                )}
                <MenuItem value="text">Paste Resume Text</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            {extractionMethod === 'text' && (
              <TextField
                label="Paste resume text here"
                multiline
                rows={6}
                fullWidth
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={loading}
                placeholder="Copy and paste your resume text here for keyword extraction..."
              />
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExtract}
              disabled={loading || (extractionMethod === 'text' && !resumeText.trim())}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Extracting...' : 'Extract Keywords'}
            </Button>
          </Grid>
        </Grid>
        
        {keywords.length > 0 && (
          <Box mt={3}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Extracted Keywords
            </Typography>
            <KeywordsList keywords={keywords} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordExtractor;