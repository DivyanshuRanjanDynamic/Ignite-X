/**
 * Keywords List Component
 * Displays extracted keywords with relevance scores and descriptions
 */

import React from 'react';
import { Box, Chip, Grid, LinearProgress, Paper, Typography } from '@mui/material';

const KeywordsList = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No keywords found.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {keywords.map((item, index) => (
        <Grid item xs={12} key={`${item.skill}-${index}`}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              borderLeft: '4px solid',
              borderLeftColor: getRelevanceColor(item.relevance),
              '&:hover': { boxShadow: 1 }
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.skill}
                </Typography>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <Typography variant="body2" color="text.secondary" mr={1}>
                    Relevance:
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.relevance} 
                    sx={{ 
                      flexGrow: 1, 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getRelevanceColor(item.relevance)
                      }
                    }} 
                  />
                  <Typography variant="body2" ml={1} fontWeight="medium">
                    {item.relevance}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant="body2">
                  {item.description}
                </Typography>
                <Box mt={1}>
                  {getRelevanceChip(item.relevance)}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Get color based on relevance score
 * @param {number} relevance - Relevance score (0-100)
 * @returns {string} Color code
 */
const getRelevanceColor = (relevance) => {
  if (relevance >= 90) return '#4caf50'; // High relevance - green
  if (relevance >= 70) return '#2196f3'; // Medium-high relevance - blue
  if (relevance >= 50) return '#ff9800'; // Medium relevance - orange
  return '#f44336'; // Low relevance - red
};

/**
 * Get relevance chip based on score
 * @param {number} relevance - Relevance score (0-100)
 * @returns {JSX.Element} Chip component
 */
const getRelevanceChip = (relevance) => {
  if (relevance >= 90) {
    return (
      <Chip 
        label="Highly Relevant" 
        size="small" 
        color="success" 
        variant="outlined" 
      />
    );
  }
  if (relevance >= 70) {
    return (
      <Chip 
        label="Relevant" 
        size="small" 
        color="primary" 
        variant="outlined" 
      />
    );
  }
  if (relevance >= 50) {
    return (
      <Chip 
        label="Moderately Relevant" 
        size="small" 
        color="warning" 
        variant="outlined" 
      />
    );
  }
  return (
    <Chip 
      label="Less Relevant" 
      size="small" 
      color="error" 
      variant="outlined" 
    />
  );
};

export default KeywordsList;