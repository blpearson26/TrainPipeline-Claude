import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Calendar, DollarSign, Users, CheckCircle, Phone, Mail, MapPin, Video, Building } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Training Management</h1>
              <p className="text-sm text-gray-500 mt-1">AI & Product Management Training Pipeline</p>
            </div>
            <button
              onClick={() => openModal('new')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              New Request
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'pipeline'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'calendar'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
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
                <div key={stage.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className={`w-3 h-3 rounded-full ${stage.color} mb-2`}></div>
                  <div className="text-2xl font-bold text-gray-900">{stats[stage.id] || 0}</div>
                  <div className="text-xs text-gray-600 mt-1">{stage.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by client, contact, or training..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>

            {/* Training List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scoping Call</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTrainings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No client requests found. Click "New Request" to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredTrainings.map(training => {
                      const stage = stages.find(s => s.id === training.stage);
                      return (
                        <tr key={training.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{training.clientName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Users size={12} />
                              {training.attendees || 0} attendees
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{training.title}</div>
                            <div className="text-sm text-gray-500">{training.topicRequests}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{training.contactName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail size={12} />
                              {training.contactEmail}
                            </div>
                            {training.contactPhone && (
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone size={12} />
                                {training.contactPhone}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
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
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {training.scopingCallDate || 'Not scheduled'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal('view', training)}
                                className="p-1 text-gray-600 hover:text-blue-600 transition"
                                title="View details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => openModal('edit', training)}
                                className="p-1 text-gray-600 hover:text-blue-600 transition"
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
                                className="p-1 text-gray-600 hover:text-red-600 transition"
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
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
            <p className="text-gray-600">Calendar view with scheduled trainings coming soon</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Total Pipeline Value</h3>
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ${trainings.reduce((sum, t) => sum + (t.value || 0), 0).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Active Requests</h3>
                  <Users className="text-blue-600" size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {trainings.filter(t => t.stage !== 'completed').length}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Completed</h3>
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {trainings.filter(t => t.stage === 'completed').length}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <TrainingModal
          type={modalType}
          training={selectedItem}
          stages={stages}
          trainingTypes={trainingTypes}
          deliveryModes={deliveryModes}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
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