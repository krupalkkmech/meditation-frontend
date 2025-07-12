import React from 'react';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const EventCard = ({ event, onClick, slotColor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'meeting':
        return '👥';
      case 'presentation':
        return '📊';
      case 'break':
        return '☕';
      case 'work':
        return '💻';
      case 'planning':
        return '📋';
      default:
        return '📅';
    }
  };

  const getTimeDisplay = () => {
    return `${event.startTime} - ${event.endTime}`;
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        height: '100%',
        borderLeft: `4px solid ${getPriorityColor(event.priority)}`,
        backgroundColor: slotColor || 'rgba(255, 255, 255, 0.95)',
        borderRadius: 2,
        p: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        '&:hover': {
          backgroundColor: slotColor || 'rgba(255, 255, 255, 0.98)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          transform: 'translateY(-2px)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Time Display */}
      <Box sx={{ mb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.primary',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={getTimeDisplay()}
        >
          {getTimeDisplay()}
        </Typography>
      </Box>

      {/* Event Content */}
      <Box
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}
      >
        {/* Header with icon and title */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.9rem',
              flexShrink: 0,
              mt: 0.1,
            }}
          >
            {getTypeIcon(event.type)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              flexGrow: 1,
              color: 'text.primary',
            }}
            title={event.title}
          >
            {event.title}
          </Typography>
        </Box>

        {/* Location */}
        {event.location && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.7rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              fontWeight: 500,
            }}
            title={event.location}
          >
            📍 {event.location}
          </Typography>
        )}

        {/* Priority indicator for timeline view */}
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: getPriorityColor(event.priority),
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EventCard;
