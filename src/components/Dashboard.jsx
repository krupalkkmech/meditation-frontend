import React, { useEffect, useState } from 'react';

import {
  Add as AddIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useAppSelector } from '../hooks/redux';
import EventCard from './EventCard';
import EventDetailsModal from './EventDetailsModal';

const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

function formatHourAMPM(hour) {
  const ampm = hour < 12 ? 'AM' : 'PM';
  let display = hour % 12;
  if (display === 0) display = 12;
  return `${display} ${ampm}`;
}

// Helper: convert "HH:MM" to minutes since midnight
function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Remove getHourSlotColor and per-hour slot coloring

// Get dynamic background based on time of day
const getTimeBasedBackground = () => {
  // Sun-cycle vertical gradient: darkest at midnight (top/bottom), brightest at noon (center)
  return {
    background:
      'linear-gradient(180deg, #232946 0%, #ffeaa7 40%, #fffbe6 50%, #ffeaa7 60%, #232946 100%)',
    color: '#232946',
    labelBg: 'rgba(255, 255, 255, 0.95)',
    labelColor: '#232946',
    lineColor: 'rgba(35, 41, 70, 0.15)',
  };
};

const DEFAULT_EVENT = {
  title: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  type: 'meeting',
  priority: 'medium',
  kind: 'event', // 'event' or 'reminder'
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useAppSelector(state => state.auth);
  const [todayEvents, setTodayEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(!isMobile); // Default closed on mobile
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState(DEFAULT_EVENT);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Sample prompt and AI suggestion
  const samplePrompt = `My working hours are 9am–5pm. I want a morning break at 11am, lunch at 12:30pm, and an afternoon break at 3:30pm. Please help me schedule my day around these, with time for deep work and meetings. Here are my events: ${todayEvents.map(e => `\n- ${e.startTime}–${e.endTime} ${e.title}`).join('')}`;
  const sampleSuggestion = `9:00–9:30  Team Standup\n9:30–11:00  Deep Work: Project X\n11:00–11:15  Morning Break\n11:15–12:00  Emails & Admin\n12:00–1:00  Lunch Break\n1:00–2:30  Client Presentation Prep\n2:30–2:45  Afternoon Break\n2:45–4:00  Code Review\n4:00–4:30  Meetings/Calls\n4:30–5:00  End-of-Day Review & Planning`;

  // Add event handler
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return;
    setTodayEvents(prev => [
      ...prev,
      {
        ...newEvent,
        id: Date.now().toString(),
      },
    ]);
    setAddModalOpen(false);
    setNewEvent(DEFAULT_EVENT);
  };

  // Remove event handler (with confirmation)
  const handleRemoveEvent = id => {
    setEventToDelete(id);
    setDeleteConfirmOpen(true);
  };
  const handleConfirmDelete = () => {
    setTodayEvents(prev => prev.filter(e => e.id !== eventToDelete));
    setSelectedEvent(null);
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
  };
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
  };

  // Edit event handler
  const handleEditEvent = id => {
    const event = todayEvents.find(e => e.id === id);
    if (event) {
      setEditEvent(event);
      setEditModalOpen(true);
    }
  };

  // Save edited event
  const handleSaveEditEvent = () => {
    setTodayEvents(prev =>
      prev.map(e => (e.id === editEvent.id ? editEvent : e))
    );
    setEditModalOpen(false);
    setEditEvent(null);
    setSelectedEvent(null);
  };

  // Get current hour for background
  const timeBackground = getTimeBasedBackground();

  // Responsive timeline height (dynamic based on last event)
  const HOUR_HEIGHT = isMobile ? 48 : 64;
  const TIMELINE_HEIGHT = 24 * HOUR_HEIGHT;
  const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;

  // Always show all 24 hours
  const HOURS_TO_SHOW = Array.from({ length: 24 }, (_, i) => i);

  // Ref for timeline container to auto-scroll
  const timelineRef = React.useRef(null);

  // Scroll to current time on open
  useEffect(() => {
    if (timelineRef.current) {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const scrollTo = minutes * PIXELS_PER_MINUTE - 100; // Offset for header
      timelineRef.current.scrollTop = Math.max(scrollTo, 0);
    }
  }, [timelineOpen, isMobile, PIXELS_PER_MINUTE]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mock data for now - will be replaced with Google Calendar API
  useEffect(() => {
    setTimeout(() => {
      const mockEvents = [
        {
          id: '1',
          title: 'Team Standup Meeting',
          startTime: '09:00',
          endTime: '09:30',
          description: 'Daily team sync to discuss progress and blockers',
          location: 'Conference Room A',
          type: 'meeting',
          priority: 'high',
          kind: 'event',
        },
        {
          id: '2',
          title: 'Client Presentation',
          startTime: '11:00',
          endTime: '12:00',
          description: 'Present quarterly results to key client',
          location: 'Zoom Meeting',
          type: 'presentation',
          priority: 'high',
          kind: 'event',
        },
        {
          id: '3',
          title: 'Lunch Break',
          startTime: '12:30',
          endTime: '13:30',
          description: 'Lunch with team members',
          location: 'Office Cafeteria',
          type: 'break',
          priority: 'low',
          kind: 'event',
        },
        {
          id: '4',
          title: 'Code Review',
          startTime: '14:00',
          endTime: '15:00',
          description: 'Review pull requests for the new feature',
          location: 'Slack',
          type: 'work',
          priority: 'medium',
          kind: 'event',
        },
        {
          id: '5',
          title: 'Project Planning',
          startTime: '16:00',
          endTime: '17:00',
          description: 'Plan next sprint and assign tasks',
          location: 'Jira',
          type: 'planning',
          priority: 'medium',
          kind: 'event',
        },
        {
          id: '6',
          title: 'Daily Standup Reminder',
          startTime: '09:00',
          endTime: '09:05',
          description: 'Daily team sync to discuss progress and blockers',
          location: 'Slack',
          type: 'reminder',
          priority: 'high',
          kind: 'reminder',
        },
        {
          id: '7',
          title: 'Client Presentation Reminder',
          startTime: '10:50',
          endTime: '10:55',
          description: 'Present quarterly results to key client',
          location: 'Zoom Meeting',
          type: 'reminder',
          priority: 'high',
          kind: 'reminder',
        },
        {
          id: '8',
          title: 'Lunch Break Reminder',
          startTime: '12:25',
          endTime: '12:30',
          description: 'Lunch with team members',
          location: 'Office Cafeteria',
          type: 'reminder',
          priority: 'low',
          kind: 'reminder',
        },
        {
          id: '9',
          title: 'Code Review Reminder',
          startTime: '13:55',
          endTime: '14:00',
          description: 'Review pull requests for the new feature',
          location: 'Slack',
          type: 'reminder',
          priority: 'medium',
          kind: 'reminder',
        },
        {
          id: '10',
          title: 'Project Planning Reminder',
          startTime: '15:55',
          endTime: '16:00',
          description: 'Plan next sprint and assign tasks',
          location: 'Jira',
          type: 'reminder',
          priority: 'medium',
          kind: 'reminder',
        },
      ];
      setTodayEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleTimelineToggle = () => {
    setTimelineOpen(!timelineOpen);
  };

  // Add to Calendar from AI suggestion
  const handleAddAiSchedule = () => {
    // Parse the sampleSuggestion string into events
    const lines = sampleSuggestion.split('\n');
    const newEvents = lines
      .map((line, idx) => {
        // Example line: 9:00–9:30  Team Standup
        const match = line.match(/(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})\s+(.+)/);
        if (!match) return null;
        const [, startTime, endTime, title] = match;
        return {
          id: 'ai-' + Date.now() + '-' + idx,
          title: title.trim(),
          startTime,
          endTime,
          description: 'Added by AI suggestion',
          location: '',
          type: 'work',
          priority: 'medium',
          kind: 'event',
        };
      })
      .filter(Boolean);
    setTodayEvents(prev => [...prev, ...newEvents]);
    setAiModalOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading your schedule...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom>
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {getTodayDate()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <Card sx={{ textAlign: 'center' }}>
                    <CardContent sx={{ py: 2, px: 1 }}>
                      <Typography
                        variant="h4"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        {todayEvents.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Today's Events
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Card sx={{ textAlign: 'center' }}>
                    <CardContent sx={{ py: 2, px: 1 }}>
                      <Typography
                        variant="h4"
                        color="error.main"
                        fontWeight="bold"
                      >
                        {
                          todayEvents.filter(event => event.priority === 'high')
                            .length
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        High Priority
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
          <Typography variant="h5" gutterBottom>
            Today's Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your events and tasks for today
          </Typography>

          {/* Mobile: Show events as cards */}
          {isMobile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {todayEvents.map(event => (
                <Card
                  key={event.id}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" component="span">
                        {event.type === 'meeting'
                          ? '👥'
                          : event.type === 'presentation'
                            ? '📊'
                            : event.type === 'break'
                              ? '☕'
                              : event.type === 'work'
                                ? '💻'
                                : event.type === 'planning'
                                  ? '📋'
                                  : '📅'}
                      </Typography>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {event.title}
                      </Typography>
                      <Chip
                        label={event.priority}
                        size="small"
                        color={
                          event.priority === 'high'
                            ? 'error'
                            : event.priority === 'medium'
                              ? 'warning'
                              : 'success'
                        }
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {event.startTime} - {event.endTime}
                    </Typography>
                    {event.location && (
                      <Typography variant="body2" color="text.secondary">
                        📍 {event.location}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Timeline Panel - Desktop/Tablet */}
      {!isMobile && (
        <Box
          sx={{
            width: timelineOpen ? { md: 400, lg: 450 } : 60,
            borderLeft: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            transition: 'width 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={handleTimelineToggle}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {timelineOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {timelineOpen && (
            <Box
              ref={timelineRef}
              sx={{
                height: '100%',
                maxHeight: TIMELINE_HEIGHT,
                position: 'relative',
                overflow: 'auto',
                p: 0,
                background: 'linear-gradient(180deg, #f7f8fa 0%, #f0f4fa 100%)',
                transition: 'background 0.5s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Hour lines and labels */}
              {HOURS_TO_SHOW.map((hour, idx) => (
                <React.Fragment key={hour}>
                  <Box
                    sx={{
                      flex: `0 0 ${HOUR_HEIGHT}px`,
                      minHeight: `${HOUR_HEIGHT}px`,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {/* Hour line and label */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 1,
                        backgroundColor: timeBackground.lineColor,
                        display: 'flex',
                        alignItems: 'center',
                        zIndex: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: '-20px',
                          backgroundColor: timeBackground.labelBg,
                          px: 2,
                          py: 1,
                          color: timeBackground.labelColor,
                          fontSize: '0.875rem',
                          fontWeight: 800,
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          backdropFilter: 'blur(8px)',
                          minWidth: '60px',
                          textAlign: 'center',
                          letterSpacing: '0.5px',
                          zIndex: 10,
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        {formatHourAMPM(hour)}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Divider between hours, except after the last hour */}
                  {idx < HOURS_TO_SHOW.length - 1 && (
                    <Divider
                      sx={{
                        mx: 0,
                        borderColor: timeBackground.lineColor,
                        opacity: 0.7,
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
              {/* Events absolutely positioned on top of the flex column */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: TIMELINE_HEIGHT,
                  pointerEvents: 'none',
                }}
              >
                {todayEvents.map(event => {
                  const start = timeToMinutes(event.startTime);
                  const end = timeToMinutes(event.endTime);
                  const top = start * PIXELS_PER_MINUTE;
                  const height = Math.max(
                    (end - start) * PIXELS_PER_MINUTE,
                    32
                  );
                  if (event.kind === 'reminder') {
                    // Render as a dot/icon at the start time
                    return (
                      <Box
                        key={event.id}
                        sx={{
                          position: 'absolute',
                          top: top - 8,
                          left: 24,
                          zIndex: 5,
                          pointerEvents: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title={event.title}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: '#f59e42',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                          }}
                        >
                          <span role="img" aria-label="reminder">
                            🔔
                          </span>
                        </Box>
                        <Box
                          sx={{
                            ml: 1,
                            fontSize: '0.85rem',
                            color: '#f59e42',
                            fontWeight: 600,
                          }}
                        >
                          {event.title}
                        </Box>
                      </Box>
                    );
                  }
                  // Render as a full event card (blocks calendar)
                  return (
                    <Box
                      key={event.id}
                      sx={{
                        position: 'absolute',
                        top,
                        height,
                        left: 60,
                        right: 8,
                        zIndex: 4,
                        pointerEvents: 'auto',
                      }}
                    >
                      <EventCard
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                      />
                    </Box>
                  );
                })}
                {/* Current time line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: currentMinutes * PIXELS_PER_MINUTE,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: '#ff4757',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 0 10px rgba(255, 71, 87, 0.5)',
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: '#ff4757',
                      marginLeft: -1.5,
                      boxShadow: '0 0 15px rgba(255, 71, 87, 0.8)',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Mobile Timeline FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="timeline"
          onClick={handleTimelineToggle}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <ScheduleIcon />
        </Fab>
      )}

      {/* Floating Add Event Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setAddModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1200,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add Event Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={newEvent.title}
              onChange={e =>
                setNewEvent(ev => ({ ...ev, title: e.target.value }))
              }
              fullWidth
              required
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Start Time"
                type="time"
                value={newEvent.startTime}
                onChange={e =>
                  setNewEvent(ev => ({ ...ev, startTime: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                required
                fullWidth
              />
              <TextField
                label="End Time"
                type="time"
                value={newEvent.endTime}
                onChange={e =>
                  setNewEvent(ev => ({ ...ev, endTime: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                required
                fullWidth
              />
            </Stack>
            <TextField
              label="Location"
              value={newEvent.location}
              onChange={e =>
                setNewEvent(ev => ({ ...ev, location: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={newEvent.description}
              onChange={e =>
                setNewEvent(ev => ({ ...ev, description: e.target.value }))
              }
              fullWidth
              multiline
              minRows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={newEvent.type}
                onChange={e =>
                  setNewEvent(ev => ({ ...ev, type: e.target.value }))
                }
              >
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="presentation">Presentation</MenuItem>
                <MenuItem value="break">Break</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="planning">Planning</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                value={newEvent.priority}
                onChange={e =>
                  setNewEvent(ev => ({ ...ev, priority: e.target.value }))
                }
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Kind</InputLabel>
              <Select
                label="Kind"
                value={newEvent.kind}
                onChange={e =>
                  setNewEvent(ev => ({ ...ev, kind: e.target.value }))
                }
              >
                <MenuItem value="event">Event (blocks calendar)</MenuItem>
                <MenuItem value="reminder">
                  Reminder (notification only)
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={editEvent?.title || ''}
              onChange={e =>
                setEditEvent(ev => ({ ...ev, title: e.target.value }))
              }
              fullWidth
              required
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Start Time"
                type="time"
                value={editEvent?.startTime || ''}
                onChange={e =>
                  setEditEvent(ev => ({ ...ev, startTime: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                required
                fullWidth
              />
              <TextField
                label="End Time"
                type="time"
                value={editEvent?.endTime || ''}
                onChange={e =>
                  setEditEvent(ev => ({ ...ev, endTime: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                required
                fullWidth
              />
            </Stack>
            <TextField
              label="Location"
              value={editEvent?.location || ''}
              onChange={e =>
                setEditEvent(ev => ({ ...ev, location: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={editEvent?.description || ''}
              onChange={e =>
                setEditEvent(ev => ({ ...ev, description: e.target.value }))
              }
              fullWidth
              multiline
              minRows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={editEvent?.type || ''}
                onChange={e =>
                  setEditEvent(ev => ({ ...ev, type: e.target.value }))
                }
              >
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="presentation">Presentation</MenuItem>
                <MenuItem value="break">Break</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="planning">Planning</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                value={editEvent?.priority || ''}
                onChange={e =>
                  setEditEvent(ev => ({ ...ev, priority: e.target.value }))
                }
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Kind</InputLabel>
              <Select
                label="Kind"
                value={editEvent?.kind || 'event'}
                onChange={e =>
                  setEditEvent(ev => ({ ...ev, kind: e.target.value }))
                }
              >
                <MenuItem value="event">Event (blocks calendar)</MenuItem>
                <MenuItem value="reminder">
                  Reminder (notification only)
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEditEvent} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Timeline Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={timelineOpen}
          onClose={() => setTimelineOpen(false)}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: 400,
            },
          }}
        >
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Timeline</Typography>
              <IconButton onClick={() => setTimelineOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                height: TIMELINE_HEIGHT,
                position: 'relative',
                background: 'none',
                transition: 'background 0.5s ease',
                borderRadius: 2,
                p: 1,
              }}
            >
              {/* Hour slots with colored backgrounds */}
              {HOURS_TO_SHOW.map(hour => (
                <Box
                  key={hour}
                  sx={{
                    position: 'absolute',
                    top: hour * HOUR_HEIGHT,
                    left: 0,
                    right: 0,
                    height: HOUR_HEIGHT,
                    background: getTimeBasedBackground().lineColor, // Use the new background for the drawer
                    zIndex: 0,
                  }}
                />
              ))}
              {/* Hour lines and labels */}
              {HOURS_TO_SHOW.map(hour => (
                <Box
                  key={hour + '-label'}
                  sx={{
                    position: 'absolute',
                    top: hour * HOUR_HEIGHT,
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: timeBackground.lineColor,
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '-20px',
                      backgroundColor: timeBackground.labelBg,
                      px: 2,
                      py: 1,
                      color: timeBackground.labelColor,
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(8px)',
                      minWidth: '60px',
                      textAlign: 'center',
                      letterSpacing: '0.5px',
                      zIndex: 10,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {formatHourAMPM(hour)}
                  </Typography>
                </Box>
              ))}
              {/* Current time line */}
              <Box
                sx={{
                  position: 'absolute',
                  top: currentMinutes * PIXELS_PER_MINUTE,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: '#ff4757',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 0 10px rgba(255, 71, 87, 0.5)',
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#ff4757',
                    marginLeft: -1.5,
                    boxShadow: '0 0 15px rgba(255, 71, 87, 0.8)',
                  }}
                />
              </Box>
              {/* Events absolutely positioned */}
              {todayEvents.map(event => {
                const start = timeToMinutes(event.startTime);
                const end = timeToMinutes(event.endTime);
                const top = start * PIXELS_PER_MINUTE;
                const height = Math.max((end - start) * PIXELS_PER_MINUTE, 32);
                if (event.kind === 'reminder') {
                  // Render as a dot/icon at the start time
                  return (
                    <Box
                      key={event.id}
                      sx={{
                        position: 'absolute',
                        top: top - 8,
                        left: 24,
                        zIndex: 5,
                      }}
                      title={event.title}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: '#f59e42',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                        }}
                      >
                        <span role="img" aria-label="reminder">
                          🔔
                        </span>
                      </Box>
                      <Box
                        sx={{
                          ml: 1,
                          fontSize: '0.85rem',
                          color: '#f59e42',
                          fontWeight: 600,
                        }}
                      >
                        {event.title}
                      </Box>
                    </Box>
                  );
                }
                // Render as a full event card (blocks calendar)
                return (
                  <Box
                    key={event.id}
                    sx={{
                      position: 'absolute',
                      top,
                      height,
                      left: 60,
                      right: 8,
                      zIndex: 4,
                    }}
                  >
                    <EventCard
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleRemoveEvent}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Plan My Day with AI Button */}
      <Fab
        color="secondary"
        aria-label="ai-plan"
        onClick={() => setAiModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 32,
          zIndex: 1200,
        }}
      >
        <SmartToyIcon />
      </Fab>
      {/* AI Plan Modal */}
      <Dialog
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Plan My Day with AI</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Prompt sent to AI:
          </Typography>
          <Box
            sx={{
              background: '#f7f8fa',
              p: 2,
              borderRadius: 2,
              mb: 2,
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              whiteSpace: 'pre-wrap',
            }}
          >
            {samplePrompt}
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            AI's Suggested Schedule:
          </Typography>
          <Box
            sx={{
              background: '#f0f4fa',
              p: 2,
              borderRadius: 2,
              fontFamily: 'monospace',
              fontSize: '1.05rem',
              whiteSpace: 'pre-wrap',
            }}
          >
            {sampleSuggestion}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiModalOpen(false)}>Close</Button>
          <Button
            onClick={handleAddAiSchedule}
            variant="contained"
            color="primary"
          >
            Add to Calendar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
