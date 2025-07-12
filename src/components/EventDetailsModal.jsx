import React from 'react';

import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';

const EventDetailsModal = ({ event, onClose, onEdit, onDelete }) => {
  if (!event) return null;

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
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

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" component="span" sx={{ fontSize: '1.5rem' }}>
            {getTypeIcon(event.type)}
          </Typography>
          <Typography
            variant="h5"
            component="span"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
            }}
          >
            {event.title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#6b7280',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Priority Chip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={
                event.priority.charAt(0).toUpperCase() + event.priority.slice(1)
              }
              size="small"
              sx={{
                backgroundColor: getPriorityColor(event.priority),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Box>

          {/* Time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScheduleIcon sx={{ color: '#6b7280', fontSize: 20 }} />
            <Typography variant="body1" sx={{ color: '#374151' }}>
              <strong>Time:</strong> {event.startTime} - {event.endTime}
            </Typography>
          </Box>

          {/* Location */}
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationIcon sx={{ color: '#6b7280', fontSize: 20 }} />
              <Typography variant="body1" sx={{ color: '#374151' }}>
                <strong>Location:</strong> {event.location}
              </Typography>
            </Box>
          )}

          {/* Description */}
          {event.description && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <DescriptionIcon
                sx={{ color: '#6b7280', fontSize: 20, mt: 0.5 }}
              />
              <Box>
                <Typography variant="body1" sx={{ color: '#374151', mb: 1 }}>
                  <strong>Description:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6b7280',
                    lineHeight: 1.6,
                    backgroundColor: '#f9fafb',
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  {event.description}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider sx={{ mx: 3 }} />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit(event.id)}
          sx={{
            borderColor: '#3b82f6',
            color: '#3b82f6',
            '&:hover': {
              borderColor: '#2563eb',
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
            },
          }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(event.id)}
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': {
              borderColor: '#dc2626',
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;
