import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Calendar, DollarSign, Users, CheckCircle, Phone, Mail, MapPin, Video, Building, FileText, Clock, Sun, Moon } from 'lucide-react';

// Storage adapter that works both in Claude and in browser
const storage = {
  async get(key) {
    if (window.storage && window.storage.get) {
      try {
        return await window.storage.get(key);
      } catch (e) {
        // Fall through to localStorage
      }
    }
    const value = localStorage.getItem(key);
    return value ? { key, value, shared: false } : null;
  },

  async set(key, value) {
    if (window.storage && window.storage.set) {
      try {
        return await window.storage.set(key, value);
      } catch (e) {
        // Fall through to localStorage
      }
    }
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },

  async delete(key) {
    if (window.storage && window.storage.delete) {
      try {
        return await window.storage.delete(key);
      } catch (e) {
        // Fall through to localStorage
      }
    }
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  },

  async list(prefix = '') {
    if (window.storage && window.storage.list) {
      try {
        return await window.storage.list(prefix);
      } catch (e) {
        // Fall through to localStorage
      }
    }
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return { keys, prefix, shared: false };
  }
};

const TrainingManagementApp = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load data and theme preference on mount
  useEffect(() => {
    loadData();
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const result = await storage.get('theme');
      if (result && result.value === 'dark') {
        setDarkMode(true);
      }
    } catch (error) {
      console.log('No theme preference found');
    }
  };

  const toggleTheme = async () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    try {
      await storage.set('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await storage.list('training:');
      if (result && result.keys) {
        const loadedTrainings = await Promise.all(
          result.keys.map(async (key) => {
            const data = await storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setTrainings(loadedTrainings.filter(Boolean));
      }
    } catch (error) {
      console.log('No existing data, starting fresh');
      setTrainings([]);
    }
  };

  const saveTraining = async (training) => {
    try {
      await storage.set(`training:${training.id}`, JSON.stringify(training));
      await loadData();
    } catch (error) {
      console.error('Error saving training:', error);
    }
  };

  const deleteTraining = async (id) => {
    try {
      await storage.delete(`training:${id}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  const stages = [
    { id: 'intake', label: 'Intake', color: 'bg-blue-500' },
    { id: 'proposal', label: 'Proposal', color: 'bg-purple-500' },
    { id: 'curriculum', label: 'Curriculum Dev', color: 'bg-yellow-500' },
    { id: 'delivery', label: 'Delivery', color: 'bg-green-500' },
    { id: 'evaluation', label: 'Evaluation', color: 'bg-orange-500' },
    { id: 'invoicing', label: 'Invoicing', color: 'bg-red-500' },
    { id: 'completed', label: 'Completed', color: 'bg-gray-500' }
  ];

  const trainingTypes = ['AI Fundamentals', 'Product Management', 'AI for PMs', 'Custom'];
  const deliveryModes = ['Virtual', 'In-Person', 'Blended'];

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
  };

  const handleSubmit = async (formData) => {
    if (modalType === 'new' || modalType === 'edit') {
      const training = {
        id: selectedItem?.id || `TR${Date.now()}`,
        ...formData,
        createdAt: selectedItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await saveTraining(training);
    } else if (modalType === 'scoping') {
      const training = {
        ...selectedItem,
        scopingCall: formData,
        scopingCallCompleted: true,
        updatedAt: new Date().toISOString()
      };
      await saveTraining(training);
    }
    closeModal();
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesStage = selectedStage === 'all' || training.stage === selectedStage;
    const matchesSearch = !searchQuery || 
      training.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.contactName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageStats = () => {
    const stats = {};
    stages.forEach(stage => {
      stats[stage.id] = trainings.filter(t => t.stage === stage.id).length;
    });
    return stats;
  };

  const stats = getStageStats();

  // Theme classes
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverClass = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <header className={`${cardBgClass} border-b ${borderClass} sticky top-0 z-10`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${textClass}`}>Training Management</h1>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>AI & Product Management Training Pipeline</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${hoverClass} transition ${textClass}`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => openModal('new')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                New Request
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={`flex gap-4 mt-4 border-b ${borderClass}`}>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'pipeline'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : `${textSecondaryClass} hover:${textClass}`
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'calendar'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : `${textSecondaryClass} hover:${textClass}`
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : `${textSecondaryClass} hover:${textClass}`
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        {activeTab === 'pipeline' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-7 gap-4 mb-6">
              {stages.map(stage => (
                <div key={stage.id} className={`${cardBgClass} rounded-lg p-4 border ${borderClass}`}>
                  <div className={`w-3 h-3 rounded-full ${stage.color} mb-2`}></div>
                  <div className={`text-2xl font-bold ${textClass}`}>{stats[stage.id] || 0}</div>
                  <div className={`text-xs ${textSecondaryClass} mt-1`}>{stage.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} size={20} />
                <input
                  type="text"
                  placeholder="Search by client, contact, or training..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className={`px-4 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>

            {/* Training List */}
            <div className={`${cardBgClass} rounded-lg border ${borderClass}`}>
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${borderClass}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Client</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Request</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Contact</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Mode</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Stage</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Scoping</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${borderClass}`}>
                  {filteredTrainings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className={`px-6 py-12 text-center ${textSecondaryClass}`}>
                        No client requests found. Click "New Request" to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredTrainings.map(training => {
                      const stage = stages.find(s => s.id === training.stage);
                      return (
                        <tr key={training.id} className={hoverClass}>
                          <td className="px-6 py-4">
                            <div className={`font-medium ${textClass}`}>{training.clientName}</div>
                            <div className={`text-xs ${textSecondaryClass} flex items-center gap-1 mt-1`}>
                              <Users size={12} />
                              {training.attendees || 0} attendees
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`font-medium ${textClass}`}>{training.title}</div>
                            <div className={`text-sm ${textSecondaryClass} line-clamp-1`}>{training.topicRequests}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm ${textClass}`}>{training.contactName}</div>
                            <div className={`text-xs ${textSecondaryClass} flex items-center gap-1`}>
                              <Mail size={12} />
                              {training.contactEmail}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-1 text-sm ${textClass}`}>
                              {training.deliveryMode === 'Virtual' && <Video size={14} />}
                              {training.deliveryMode === 'In-Person' && <Building size={14} />}
                              {training.deliveryMode === 'Blended' && <MapPin size={14} />}
                              {training.deliveryMode}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${stage?.color}`}>
                              {stage?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {training.scopingCallCompleted ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle size={16} />
                                Completed
                              </span>
                            ) : (
                              <span className={`${textSecondaryClass} text-sm`}>Not recorded</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal('scoping', training)}
                                className={`p-1 ${textSecondaryClass} hover:text-green-600 transition`}
                                title="Record scoping call"
                              >
                                <FileText size={18} />
                              </button>
                              <button
                                onClick={() => openModal('view', training)}
                                className={`p-1 ${textSecondaryClass} hover:text-blue-600 transition`}
                                title="View details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => openModal('edit', training)}
                                className={`p-1 ${textSecondaryClass} hover:text-blue-600 transition`}
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Delete this training request?')) {
                                    deleteTraining(training.id);
                                  }
                                }}
                                className={`p-1 ${textSecondaryClass} hover:text-red-600 transition`}
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'calendar' && (
          <div className={`${cardBgClass} rounded-lg border ${borderClass} p-8 text-center`}>
            <Calendar size={48} className={`mx-auto ${textSecondaryClass} mb-4`} />
            <h3 className={`text-lg font-medium ${textClass} mb-2`}>Calendar View</h3>
            <p className={textSecondaryClass}>Calendar view with scheduled trainings coming soon</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-medium ${textClass}`}>Total Pipeline Value</h3>
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div className={`text-3xl font-bold ${textClass}`}>
                  ${trainings.reduce((sum, t) => sum + (t.value || 0), 0).toLocaleString()}
                </div>
              </div>
              
              <div className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-medium ${textClass}`}>Active Requests</h3>
                  <Users className="text-blue-600" size={24} />
                </div>
                <div className={`text-3xl font-bold ${textClass}`}>
                  {trainings.filter(t => t.stage !== 'completed').length}
                </div>
              </div>
              
              <div className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-medium ${textClass}`}>Completed</h3>
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className={`text-3xl font-bold ${textClass}`}>
                  {trainings.filter(t => t.stage === 'completed').length}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        modalType === 'scoping' ? (
          <ScopingCallModal
            training={selectedItem}
            darkMode={darkMode}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        ) : (
          <TrainingModal
            type={modalType}
            training={selectedItem}
            stages={stages}
            trainingTypes={trainingTypes}
            deliveryModes={deliveryModes}
            darkMode={darkMode}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )
      )}
    </div>
  );
};

const ScopingCallModal = ({ training, darkMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(training?.scopingCall || {
    attendeeRoles: '',
    trainingObjectives: '',
    deliveryMode: training?.deliveryMode || '',
    duration: '',
    preferredTimeWindow: '',
    numberOfParticipants: training?.attendees || '',
    specialRequirements: '',
    notes: '',
    completedDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitClick = () => {
    onSubmit(formData);
  };

  const deliveryModes = ['Virtual', 'On-site', 'Hybrid'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Record Scoping Call</h2>
              <p className="text-sm text-gray-500 mt-1">
                {training?.clientName} - {training?.title}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Purpose:</strong> Record detailed requirements from the scoping call so course writers and trainers can reference sponsor requests throughout development and delivery.
            </p>
          </div>

          {/* Participant Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Participant Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendee Roles *
                </label>
                <input
                  type="text"
                  name="attendeeRoles"
                  value={formData.attendeeRoles}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Executives, Managers, Analysts, Product Managers, Engineers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Specify the job roles or levels of participants</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Participants (Estimated) *
                </label>
                <input
                  type="number"
                  name="numberOfParticipants"
                  value={formData.numberOfParticipants}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Expected number of attendees"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Training Objectives */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Learning Outcomes</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Training Objectives *
              </label>
              <textarea
                name="trainingObjectives"
                value={formData.trainingObjectives}
                onChange={handleChange}
                required
                rows="5"
                placeholder="At the end of the course, participants should be able to...&#10;&#10;• Understand key AI concepts and applications&#10;• Apply AI tools to product management workflows&#10;• Evaluate AI solutions for business problems&#10;• ..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">List specific, measurable learning objectives</p>
            </div>
          </div>

          {/* Logistics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Delivery Logistics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Mode *
                </label>
                <select
                  name="deliveryMode"
                  value={formData.deliveryMode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select mode...</option>
                  {deliveryModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2 days, 6 hours, 3 half-days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time Window for Delivery *
              </label>
              <input
                type="text"
                name="preferredTimeWindow"
                value={formData.preferredTimeWindow}
                onChange={handleChange}
                required
                placeholder="e.g., Q1 2025, March 15-20, Next month, Week of May 5th"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Additional Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requirements / Constraints
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Technical setup (specific software, tools), materials needed, language preferences, accessibility requirements, budget constraints"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes / Additional Context
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Capture any qualitative details, client preferences, background information, or other important context from the scoping call..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scoping Call Completed Date
                </label>
                <input
                  type="date"
                  name="completedDate"
                  value={formData.completedDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitClick}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Scoping Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrainingModal = ({ type, training, stages, trainingTypes, deliveryModes, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(training || {
    clientName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    title: '',
    topicRequests: '',
    attendees: '',
    deliveryMode: '',
    scopingCallDate: '',
    stage: 'intake',
    value: '',
    deliveryDate: '',
    description: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitClick = () => {
    onSubmit({
      ...formData,
      value: parseFloat(formData.value) || 0,
      attendees: parseInt(formData.attendees) || 0
    });
  };

  const isViewMode = type === 'view';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            {type === 'new' ? 'New Client Request' : type === 'edit' ? 'Edit Request' : 'Request Details'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {type === 'new' && 'Create a record of a client\'s training request'}
          </p>
          
          {/* Show scoping call summary if completed */}
          {isViewMode && training?.scopingCallCompleted && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 font-medium text-sm">
                <CheckCircle size={16} />
                Scoping Call Completed
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Client Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  placeholder="Enter organization or company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Point of Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Point of Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  placeholder="Full name of primary contact"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  placeholder="contact@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  disabled={isViewMode}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Training Request Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Training Request Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Training Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  placeholder="e.g., AI Fundamentals for Product Teams"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Topic Requests *
                </label>
                <textarea
                  name="topicRequests"
                  value={formData.topicRequests}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  rows="3"
                  placeholder="List the topics the client has requested (e.g., Machine Learning basics, AI ethics, Product strategy with AI)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Attendees *
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    disabled={isViewMode}
                    required
                    min="1"
                    placeholder="Expected participants"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Mode *
                  </label>
                  <select
                    name="deliveryMode"
                    value={formData.deliveryMode}
                    onChange={handleChange}
                    disabled={isViewMode}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Select mode...</option>
                    {deliveryModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Scoping Call Date *
                </label>
                <input
                  type="date"
                  name="scopingCallDate"
                  value={formData.scopingCallDate}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Scoping Call Details (if completed) */}
          {isViewMode && training?.scopingCallCompleted && training?.scopingCall && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                <FileText size={20} className="text-green-600" />
                Scoping Call Results
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Attendee Roles</div>
                  <div className="text-sm text-gray-900 mt-1">{training.scopingCall.attendeeRoles}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Training Objectives</div>
                  <div className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{training.scopingCall.trainingObjectives}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Delivery Mode</div>
                    <div className="text-sm text-gray-900 mt-1">{training.scopingCall.deliveryMode}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Duration</div>
                    <div className="text-sm text-gray-900 mt-1">{training.scopingCall.duration}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Participants</div>
                    <div className="text-sm text-gray-900 mt-1">{training.scopingCall.numberOfParticipants}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Preferred Time Window</div>
                  <div className="text-sm text-gray-900 mt-1">{training.scopingCall.preferredTimeWindow}</div>
                </div>
                {training.scopingCall.specialRequirements && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Special Requirements</div>
                    <div className="text-sm text-gray-900 mt-1">{training.scopingCall.specialRequirements}</div>
                  </div>
                )}
                {training.scopingCall.notes && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Notes</div>
                    <div className="text-sm text-gray-900 mt-1">{training.scopingCall.notes}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information (Optional) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Additional Information (Optional)</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Training Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                >
                  <option value="">Select type...</option>
                  {trainingTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                >
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  disabled={isViewMode}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                disabled={isViewMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isViewMode}
                rows="2"
                placeholder="Additional context about the training request"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={isViewMode}
                rows="2"
                placeholder="Private notes for internal use"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button
                onClick={handleSubmitClick}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {type === 'new' ? 'Create Request' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingManagementApp;