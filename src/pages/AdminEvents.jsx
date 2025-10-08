import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Edit, 
  Save, 
  X, 
  Image as ImageIcon,
  Calendar,
  MapPin,
  Users,
  Eye,
  EyeOff,
  LogOut,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

// Services
import { eventsService } from '../services/eventsService';

// Context
import { useAuth } from '../contexts/AuthContext';

// Utils
import { NGO_INFO } from '../utils/constants';
import config from '../config/environment';

const AdminEvents = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    impact: '',
    status: 'upcoming'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsService.getAllEvents();
      if (response.success) {
        setEvents(response.data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (eventId, files) => {
    try {
      setUploading(true);
      const response = await eventsService.uploadEventImages(eventId, files);
      if (response.success) {
        toast.success('Images uploaded successfully');
        fetchEvents(); // Refresh events
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (eventId, imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await eventsService.deleteEventImage(eventId, imageId);
      if (response.success) {
        toast.success('Image deleted successfully');
        fetchEvents(); // Refresh events
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleAddEvent = async () => {
    try {
      const response = await eventsService.createEvent(newEvent);
      if (response.success) {
        toast.success('Event created successfully');
        setNewEvent({
          title: '',
          description: '',
          date: '',
          location: '',
          impact: '',
          status: 'upcoming'
        });
        setShowAddEvent(false);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await eventsService.updateEvent(editingEvent.id, editingEvent);
      if (response.success) {
        toast.success('Event updated successfully');
        setEditingEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also delete all associated images.')) {
      return;
    }

    try {
      const response = await eventsService.deleteEvent(eventId);
      if (response.success) {
        toast.success('Event deleted successfully');
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-soft-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin - Events Management - {NGO_INFO.name}</title>
        <meta name="description" content="Manage events and images for INFANT NGO" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-primary-50 to-accent-50">
        {/* Enhanced Header */}
        <section className="py-12 bg-white/90 backdrop-blur-lg border-b border-primary-200/30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
                  <h1 className="text-4xl font-bold text-soft-900">Events Management</h1>
                </div>
                <p className="text-lg text-soft-600 mb-2">Manage events and upload images for your organization</p>
                {user && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-600" />
                    <p className="text-sm text-soft-500">
                      Welcome, <span className="font-semibold text-soft-700">{user.full_name}</span> 
                      <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {user.role}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setShowAddEvent(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                  Add Event
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Events List */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {events.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-soft-100 to-soft-200 rounded-3xl p-16 border-2 border-dashed border-soft-300 max-w-2xl mx-auto">
                  <ImageIcon className="h-20 w-20 text-soft-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-soft-600 mb-4">No Events Created Yet</h3>
                  <p className="text-soft-500 text-lg mb-8">Create your first event to start managing your organization's activities</p>
                  <motion.button
                    onClick={() => setShowAddEvent(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Create Your First Event
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="grid gap-8">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-primary-200/30"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-soft-900">{event.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="text-soft-600 mb-3">{event.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-soft-500">
                          {event.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                          {event.impact && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.impact}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="p-2 text-soft-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-soft-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Images Section */}
                    <div className="border-t border-soft-200 pt-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
                          <h4 className="font-semibold text-soft-900 text-lg">Event Images</h4>
                          <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                            {event.images?.length || 0}
                          </div>
                        </div>
                        <label className="btn-secondary cursor-pointer flex items-center gap-2 hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 shadow-sm hover:shadow-md">
                          <Upload className="h-4 w-4" />
                          Upload Images
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(event.id, e.target.files)}
                            disabled={uploading}
                          />
                        </label>
                      </div>

                      {event.images && event.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                          {event.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-soft-100 to-soft-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <img
                                  src={image.url ? `${config.BASE_URL}${image.url}` : (image.file_path ? `${config.BASE_URL}${image.file_path}` : image)}
                                  alt={`${event.title} - Image ${index + 1}`}
                                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                                  crossOrigin="anonymous"
                                  onError={(e) => {
                                    console.error('Image load error:', image.url || image.file_path);
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                              
                              {/* Enhanced Delete Button */}
                              <button
                                onClick={() => handleDeleteImage(event.id, image.id || index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm"
                              >
                                <X className="h-3 w-3" />
                              </button>

                              {/* Image Number Badge */}
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {index + 1}
                              </div>

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-soft-500">
                          <div className="bg-gradient-to-br from-soft-100 to-soft-200 rounded-2xl p-8 border-2 border-dashed border-soft-300">
                            <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-soft-600 font-medium">No images uploaded yet</p>
                            <p className="text-sm text-soft-500 mt-1">Upload images to showcase this event</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Add Event Modal */}
        <AnimatePresence>
          {showAddEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddEvent(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-soft-900">Add New Event</h2>
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="p-2 text-soft-600 hover:text-soft-900 hover:bg-soft-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter event description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Status
                      </label>
                      <select
                        value={newEvent.status}
                        onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                        className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter event location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Impact
                    </label>
                    <input
                      type="text"
                      value={newEvent.impact}
                      onChange={(e) => setNewEvent({ ...newEvent, impact: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 150+ children received health checkups"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="px-4 py-2 text-soft-600 hover:text-soft-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    disabled={!newEvent.title || !newEvent.description}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    Create Event
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Event Modal */}
        <AnimatePresence>
          {editingEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setEditingEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-soft-900">Edit Event</h2>
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="p-2 text-soft-600 hover:text-soft-900 hover:bg-soft-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={editingEvent.date}
                        onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                        className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Status
                      </label>
                      <select
                        value={editingEvent.status}
                        onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                        className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Impact
                    </label>
                    <input
                      type="text"
                      value={editingEvent.impact}
                      onChange={(e) => setEditingEvent({ ...editingEvent, impact: e.target.value })}
                      className="w-full px-3 py-2 border border-soft-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 text-soft-600 hover:text-soft-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateEvent}
                    disabled={!editingEvent.title || !editingEvent.description}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    Update Event
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminEvents;
