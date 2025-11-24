import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Calendar, DollarSign, Users, CheckCircle, Phone, Mail, MapPin, Video, Building, FileText, Clock, Sun, Moon, MessageSquare, Inbox, Paperclip, Upload, ExternalLink, File, ClipboardList, FileCheck, TrendingUp } from 'lucide-react';

// Storage adapter
const storage = {
  async get(key) {
    if (window.storage?.get) {
      try {
        return await window.storage.get(key);
      } catch (e) {}
    }
    const value = localStorage.getItem(key);
    return value ? { key, value, shared: false } : null;
  },
  async set(key, value) {
    if (window.storage?.set) {
      try {
        return await window.storage.set(key, value);
      } catch (e) {}
    }
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },
  async delete(key) {
    if (window.storage?.delete) {
      try {
        return await window.storage.delete(key);
      } catch (e) {}
    }
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  },
  async list(prefix = '') {
    if (window.storage?.list) {
      try {
        return await window.storage.list(prefix);
      } catch (e) {}
    }
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) keys.push(key);
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
  const [scheduleView, setScheduleView] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    loadData();
    loadThemePreference();
  }, []);

  const loadData = async () => {
    try {
      const result = await storage.list('training:');
      if (result?.keys?.length > 0) {
        const loadedTrainings = await Promise.all(
          result.keys.map(async (key) => {
            const data = await storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setTrainings(loadedTrainings.filter(Boolean));
      }
    } catch (error) {
      console.log('No existing data');
      setTrainings([]);
    }
  };

  const loadThemePreference = async () => {
    try {
      const result = await storage.get('theme');
      if (result?.value === 'dark') setDarkMode(true);
    } catch (error) {
      console.log('No theme preference');
    }
  };

  const toggleTheme = async () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    try {
      await storage.set('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const loadTestData = () => {
    const testData = [{
      id: 'TR001',
      clientName: 'TechCorp Industries',
      contactName: 'Sarah Johnson',
      contactEmail: 'sarah@techcorp.com',
      contactPhone: '(555) 123-4567',
      title: 'AI Fundamentals for Product Teams',
      topicRequests: 'Machine learning basics, AI ethics, practical applications',
      attendees: 25,
      deliveryMode: 'Hybrid',
      scopingCallDate: '2025-02-15',
      stage: 'curriculum',
      type: 'AI Fundamentals',
      value: 45000,
      deliveryDate: '2025-03-20',
      scopingCallCompleted: true,
      scopingCall: {
        attendeeRoles: 'Product Managers, Senior Analysts, Engineering Leads',
        trainingObjectives: 'At the end of the course, participants should be able to:\n• Understand fundamental AI/ML concepts\n• Evaluate AI solutions for business problems\n• Apply prompt engineering techniques',
        deliveryMode: 'Hybrid',
        duration: '2 days',
        preferredTimeWindow: 'March 20-21, 2025',
        numberOfParticipants: 25,
        specialRequirements: 'Projector, breakout rooms, ChatGPT access',
        notes: 'Client wants hands-on exercises',
        completedDate: '2025-02-10'
      },
      coordinationCalls: [{
        id: 'CC001',
        callDate: '2025-02-20',
        callTime: '14:00',
        attendeesAndRoles: 'Sarah Johnson (Client), Mike Chen (Trainer)',
        callPurpose: 'Logistics Update',
        discussionSummary: 'Confirmed room setup and technical requirements',
        updatedObjectives: 'Added focus on generative AI tools',
        additionalMaterials: 'Client requested fintech case studies',
        deliveryChanges: 'Changed start time from 9am to 8:30am',
        followUpActions: '• Send agenda - Mike - 2/25\n• Prepare case studies - Lisa - 3/1',
        notes: 'Client mentioned potential follow-up course'
      }],
      emailCommunications: [
        {
          id: 'EM001',
          timestamp: '2025-02-12T09:30:00Z',
          senderName: 'Sarah Johnson',
          senderEmail: 'sarah@techcorp.com',
          recipients: 'training@company.com',
          subject: 'Initial Training Request - AI Fundamentals',
          body: 'Hi Team,\n\nWe are interested in scheduling an AI fundamentals training for our product management team. We have approximately 25 people who would benefit from understanding AI concepts and how to apply them in product development.\n\nCould we schedule a call to discuss the details?\n\nBest regards,\nSarah Johnson\nVP of Product, TechCorp',
          attachments: []
        },
        {
          id: 'EM002',
          timestamp: '2025-02-15T14:20:00Z',
          senderName: 'Mike Chen',
          senderEmail: 'mike@company.com',
          recipients: 'sarah@techcorp.com',
          subject: 'RE: Initial Training Request - AI Fundamentals',
          body: 'Hi Sarah,\n\nThank you for reaching out! We would love to work with TechCorp on this training.\n\nBased on our scoping call today, I wanted to confirm:\n- 2-day hybrid training (March 20-21)\n- 25 participants from PM team\n- Focus on ML basics, AI ethics, and practical applications\n\nI will send over the proposal by end of week.\n\nBest,\nMike Chen\nSenior Trainer',
          attachments: []
        },
        {
          id: 'EM003',
          timestamp: '2025-02-22T16:45:00Z',
          senderName: 'Sarah Johnson',
          senderEmail: 'sarah@techcorp.com',
          recipients: 'mike@company.com',
          subject: 'Additional Request - Fintech Case Studies',
          body: 'Hi Mike,\n\nAfter our coordination call, I wanted to follow up on the fintech-specific case studies we discussed. Our team would really benefit from seeing examples relevant to our industry.\n\nAlso, please confirm the 8:30am start time works for the training materials delivery.\n\nThanks!\nSarah',
          attachments: []
        }
      ],
      proposalDocuments: [
        {
          id: 'PR001',
          fileName: 'AI_Training_Proposal_v2.pdf',
          linkUrl: null,
          versionLabel: 'v2.0 - Final',
          notes: 'Updated pricing and added fintech case studies',
          isCurrent: true,
          uploadedAt: '2025-02-15T10:00:00Z',
          uploadedBy: 'Mike Chen'
        },
        {
          id: 'PR002',
          fileName: null,
          linkUrl: 'https://sharepoint.com/proposals/techcorp-ai-v1',
          versionLabel: 'v1.0 - Draft',
          notes: 'Initial proposal draft',
          isCurrent: false,
          uploadedAt: '2025-02-10T14:30:00Z',
          uploadedBy: 'Mike Chen'
        }
      ],
      runOfShowDocuments: [
        {
          id: 'ROS001',
          fileName: null,
          linkUrl: 'https://sharepoint.com/agendas/techcorp-ai-agenda',
          versionLabel: 'Final Agenda',
          notes: 'Updated with fintech case studies in afternoon session',
          isCurrent: true,
          uploadedAt: '2025-03-10T09:00:00Z',
          uploadedBy: 'Mike Chen'
        },
        {
          id: 'ROS002',
          fileName: 'AI_Training_Agenda_Draft.xlsx',
          linkUrl: null,
          versionLabel: 'Draft v1',
          notes: 'Initial two-day agenda',
          isCurrent: false,
          uploadedAt: '2025-03-01T14:30:00Z',
          uploadedBy: 'Lisa Thompson'
        }
      ],
      sowDocuments: [
        {
          id: 'SOW001',
          fileName: 'TechCorp_AI_Training_SOW.pdf',
          linkUrl: null,
          versionLabel: 'Final SOW',
          status: 'Signed / Executed',
          notes: 'Signed by Sarah Johnson on 2/18/2025',
          isCurrent: true,
          uploadedAt: '2025-02-18T15:30:00Z',
          uploadedBy: 'Mike Chen'
        },
        {
          id: 'SOW002',
          fileName: null,
          linkUrl: 'https://sharepoint.com/contracts/techcorp-ai-sow-draft',
          versionLabel: 'Draft v1',
          status: 'Pending Client Signature',
          notes: 'Initial draft sent for review',
          isCurrent: false,
          uploadedAt: '2025-02-10T11:00:00Z',
          uploadedBy: 'Mike Chen'
        }
      ],
      scheduledSessions: [
        {
          id: 'SESS001',
          eventTitle: 'AI Fundamentals Training - Day 1',
          startDate: '2025-03-20',
          startTime: '08:30',
          endDate: '2025-03-20',
          endTime: '16:30',
          deliveryMode: 'Hybrid',
          location: 'TechCorp HQ, Conference Room A',
          virtualLink: 'https://zoom.us/j/123456789',
          instructor: 'Mike Chen',
          facilitators: ['Lisa Thompson', 'John Davis'],
          status: 'Confirmed'
        },
        {
          id: 'SESS002',
          eventTitle: 'AI Fundamentals Training - Day 2',
          startDate: '2025-03-21',
          startTime: '08:30',
          endDate: '2025-03-21',
          endTime: '16:30',
          deliveryMode: 'Hybrid',
          location: 'TechCorp HQ, Conference Room A',
          virtualLink: 'https://zoom.us/j/123456789',
          instructor: 'Mike Chen',
          facilitators: ['Lisa Thompson'],
          status: 'Confirmed'
        }
      ],
      createdAt: '2025-01-20T10:30:00Z',
      updatedAt: '2025-02-22T16:45:00Z'
    }];
    
    setTrainings(testData);
    testData.forEach(training => {
      storage.set(`training:${training.id}`, JSON.stringify(training));
    });
  };

  const saveTraining = async (training) => {
    try {
      await storage.set(`training:${training.id}`, JSON.stringify(training));
      await loadData();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const deleteTraining = async (id) => {
    try {
      await storage.delete(`training:${id}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting:', error);
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
        value: parseFloat(formData.value) || 0,
        attendees: parseInt(formData.attendees) || 0,
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
    } else if (modalType === 'coordination') {
      const existingCalls = selectedItem.coordinationCalls || [];
      const training = {
        ...selectedItem,
        coordinationCalls: [...existingCalls, { ...formData, id: `CC${Date.now()}` }],
        updatedAt: new Date().toISOString()
      };
      await saveTraining(training);
    } else if (modalType === 'email') {
      const existingEmails = selectedItem.emailCommunications || [];
      const training = {
        ...selectedItem,
        emailCommunications: [...existingEmails, { ...formData, id: `EM${Date.now()}`, timestamp: new Date().toISOString() }],
        updatedAt: new Date().toISOString()
      };
      await saveTraining(training);
    } else if (modalType === 'proposal') {
      const existingProposals = selectedItem.proposalDocuments || [];
      const updatedProposals = existingProposals.map(p => ({ ...p, isCurrent: false }));
      const training = {
        ...selectedItem,
        proposalDocuments: [...updatedProposals, { 
          ...formData, 
          id: `PR${Date.now()}`, 
          isCurrent: true,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current User'
        }],
        updatedAt: new Date().toISOString()
      };
      await saveTraining(training);
    } else if (modalType === 'runofshow') {
      const existingDocs = selectedItem.runOfShowDocuments || [];
      const updatedDocs = existingDocs.map(d => ({ ...d, isCurrent: false }));
      const training = {
        ...selectedItem,
        runOfShowDocuments: [...updatedDocs, {
          ...formData,
          id: `ROS${Date.now()}`,
          isCurrent: true,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current User'
        }],
        updatedAt: new Date().toISOString()
      };
      await saveTraining(training);
    } else if (modalType === 'sow') {
      const existingDocs = selectedItem.sowDocuments || [];
      const updatedDocs = existingDocs.map(d => ({ ...d, isCurrent: false }));
      const training = {
        ...selectedItem,
        sowDocuments: [...updatedDocs, {
          ...formData,
          id: `SOW${Date.now()}`,
          isCurrent: true,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current User'
        }],
        updatedAt: new Date().toISOString()
      };
      await saveTraining(training);
    } else if (modalType === 'schedule') {
      const existingSessions = selectedItem.scheduledSessions || [];
      const training = {
        ...selectedItem,
        scheduledSessions: [...existingSessions, {
          ...formData,
          id: `SESS${Date.now()}`
        }],
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

  const stats = {};
  stages.forEach(stage => {
    stats[stage.id] = trainings.filter(t => t.stage === stage.id).length;
  });

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
      <header className={`${cardBgClass} border-b ${borderClass} sticky top-0 z-10`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${textClass}`}>Training Management</h1>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>AI & Product Management Training Pipeline</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { if (window.confirm('Load test data?')) loadTestData(); }}
                className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textClass} text-sm transition`}
              >
                Load Test Data
              </button>
              <button onClick={toggleTheme} className={`p-2 rounded-lg ${hoverClass} transition ${textClass}`}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => openModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <Plus size={20} />
                New Request
              </button>
            </div>
          </div>

          <div className={`flex gap-4 mt-4 border-b ${borderClass}`}>
            {['pipeline', 'documents', 'schedule', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : textSecondaryClass
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        {activeTab === 'pipeline' && (
          <>
            <div className="grid grid-cols-7 gap-4 mb-6">
              {stages.map(stage => (
                <div key={stage.id} className={`${cardBgClass} rounded-lg p-4 border ${borderClass}`}>
                  <div className={`w-3 h-3 rounded-full ${stage.color} mb-2`}></div>
                  <div className={`text-2xl font-bold ${textClass}`}>{stats[stage.id] || 0}</div>
                  <div className={`text-xs ${textSecondaryClass} mt-1`}>{stage.label}</div>
                </div>
              ))}
            </div>

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

            <div className={`${cardBgClass} rounded-lg border ${borderClass}`}>
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${borderClass}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Client</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Request</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Contact</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Stage</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Calls</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${borderClass}`}>
                  {filteredTrainings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={`px-6 py-12 text-center ${textSecondaryClass}`}>
                        No trainings found. Click "Load Test Data" or "New Request".
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
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${stage?.color}`}>
                              {stage?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {training.scopingCallCompleted && (
                                <div className="flex items-center gap-1 text-green-600 text-xs">
                                  <CheckCircle size={14} />
                                  Scoping
                                </div>
                              )}
                              {training.coordinationCalls?.length > 0 && (
                                <div className="flex items-center gap-1 text-blue-600 text-xs">
                                  <MessageSquare size={14} />
                                  {training.coordinationCalls.length} Coord
                                </div>
                              )}
                              {training.emailCommunications?.length > 0 && (
                                <div className="flex items-center gap-1 text-purple-600 text-xs">
                                  <Inbox size={14} />
                                  {training.emailCommunications.length} Emails
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => openModal('email', training)} className={`p-1 ${textSecondaryClass} hover:text-purple-600 transition`} title="Add email communication">
                                <Inbox size={18} />
                              </button>
                              <button onClick={() => openModal('scoping', training)} className={`p-1 ${textSecondaryClass} hover:text-green-600 transition`} title="Record scoping call">
                                <FileText size={18} />
                              </button>
                              <button
                                onClick={() => openModal('coordination', training)}
                                disabled={!training.scopingCallCompleted}
                                className={`p-1 ${training.scopingCallCompleted ? `${textSecondaryClass} hover:text-blue-600` : 'text-gray-300 cursor-not-allowed'} transition`}
                                title={training.scopingCallCompleted ? "Record coordination call" : "Complete scoping call first"}
                              >
                                <MessageSquare size={18} />
                              </button>
                              <button onClick={() => openModal('sow', training)} className={`p-1 ${textSecondaryClass} hover:text-amber-600 transition`} title="Add SOW / Contract">
                                <FileCheck size={18} />
                              </button>
                              <button onClick={() => openModal('view', training)} className={`p-1 ${textSecondaryClass} hover:text-blue-600 transition`} title="View details">
                                <Eye size={18} />
                              </button>
                              <button onClick={() => openModal('edit', training)} className={`p-1 ${textSecondaryClass} hover:text-blue-600 transition`} title="Edit">
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Delete this training?')) deleteTraining(training.id);
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

        {activeTab === 'documents' && (
          <div className="space-y-8">
            {/* Current Design Documents Overview */}
            <div>
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${textClass}`}>Current Design Documents</h2>
                <p className={`text-sm ${textSecondaryClass} mt-1`}>Quick reference to all approved and current design documents across engagements</p>
              </div>

              <div className={`${cardBgClass} rounded-lg border ${borderClass} overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${borderClass}`}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Client / Training</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Document Type</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Title / Filename</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Last Updated</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Status</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderClass}`}>
                      {(() => {
                        // Collect all current documents from all trainings
                        const currentDocs = [];

                        trainings.forEach(training => {
                          // Proposals
                          const currentProposal = training.proposalDocuments?.find(doc => doc.isCurrent);
                          if (currentProposal) {
                            currentDocs.push({
                              training,
                              type: 'Proposal',
                              typeColor: 'text-green-600',
                              typeBg: 'bg-green-100 dark:bg-green-900',
                              icon: <File size={16} className="text-green-600" />,
                              doc: currentProposal
                            });
                          }

                          // Run of Show
                          const currentRunOfShow = training.runOfShowDocuments?.find(doc => doc.isCurrent);
                          if (currentRunOfShow) {
                            currentDocs.push({
                              training,
                              type: 'Run of Show',
                              typeColor: 'text-blue-600',
                              typeBg: 'bg-blue-100 dark:bg-blue-900',
                              icon: <ClipboardList size={16} className="text-blue-600" />,
                              doc: currentRunOfShow
                            });
                          }

                          // SOW/Contract
                          const currentSOW = training.sowDocuments?.find(doc => doc.isCurrent);
                          if (currentSOW) {
                            currentDocs.push({
                              training,
                              type: 'SOW / Contract',
                              typeColor: 'text-amber-600',
                              typeBg: 'bg-amber-100 dark:bg-amber-900',
                              icon: <FileCheck size={16} className="text-amber-600" />,
                              doc: currentSOW
                            });
                          }
                        });

                        // Sort by last updated date (most recent first)
                        currentDocs.sort((a, b) => new Date(b.doc.uploadedAt) - new Date(a.doc.uploadedAt));

                        if (currentDocs.length === 0) {
                          return (
                            <tr>
                              <td colSpan="6" className={`px-6 py-12 text-center ${textSecondaryClass}`}>
                                <FileText size={48} className={`mx-auto ${textSecondaryClass} mb-4 opacity-50`} />
                                <p>No current design documents yet. Upload proposals, run of show, or SOW/contracts to see them here.</p>
                              </td>
                            </tr>
                          );
                        }

                        return currentDocs.map((item, index) => (
                          <tr key={index} className={hoverClass}>
                            <td className="px-6 py-4">
                              <div className={`font-medium ${textClass}`}>{item.training.clientName}</div>
                              <div className={`text-sm ${textSecondaryClass} line-clamp-1`}>{item.training.title}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {item.icon}
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.typeBg} ${item.typeColor}`}>
                                  {item.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${textClass} font-medium`}>
                                {item.doc.fileName || item.doc.linkUrl?.split('/').pop() || 'Document'}
                              </div>
                              <div className={`text-xs ${textSecondaryClass}`}>
                                {item.doc.versionLabel}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${textClass}`}>
                                {new Date(item.doc.uploadedAt).toLocaleDateString()}
                              </div>
                              <div className={`text-xs ${textSecondaryClass}`}>
                                {new Date(item.doc.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Current Version</span>
                                {item.doc.status === 'Signed / Executed' && (
                                  <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">🟢 Signed</span>
                                )}
                                {item.doc.status === 'Pending Client Signature' && (
                                  <span className="px-2 py-0.5 bg-yellow-600 text-white text-xs rounded-full">🟡 Pending</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {item.doc.linkUrl ? (
                                <a
                                  href={item.doc.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  <ExternalLink size={14} />
                                  Open Link
                                </a>
                              ) : (
                                <button
                                  onClick={() => openModal('view', item.training)}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  <Eye size={14} />
                                  View Details
                                </button>
                              )}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Proposals Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-xl font-bold ${textClass}`}>Proposal Documents</h2>
                  <p className={`text-sm ${textSecondaryClass} mt-1`}>Client proposals and contracts</p>
                </div>
                <button
                  onClick={() => {
                    const training = trainings[0];
                    if (training) openModal('proposal', training);
                  }}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Upload size={20} />
                  Add Proposal
                </button>
              </div>

              <div className="grid gap-4">
                {trainings.map(training => (
                  training.proposalDocuments?.length > 0 && (
                    <div key={training.id} className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                      <h3 className={`font-semibold ${textClass} mb-4`}>{training.clientName} - {training.title}</h3>
                      <div className="space-y-3">
                        {training.proposalDocuments.map(doc => (
                          <div key={doc.id} className={`flex items-start gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <File className="text-green-600 mt-1" size={24} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`font-medium ${textClass}`}>{doc.fileName || doc.linkUrl}</span>
                                {doc.isCurrent && (
                                  <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">Current</span>
                                )}
                              </div>
                              <div className={`text-sm ${textSecondaryClass} space-y-1`}>
                                <div>Version: {doc.versionLabel}</div>
                                <div>Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleString()}</div>
                                {doc.notes && <div className="italic">Notes: {doc.notes}</div>}
                              </div>
                              {doc.linkUrl && (
                                <a 
                                  href={doc.linkUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
                                >
                                  <ExternalLink size={14} />
                                  Open Link
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => openModal('proposal', training)}
                              className={`p-2 ${textSecondaryClass} hover:text-blue-600 transition`}
                              title="Add new version"
                            >
                              <Upload size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
                {!trainings.some(t => t.proposalDocuments?.length > 0) && (
                  <div className={`${cardBgClass} rounded-lg border ${borderClass} p-12 text-center`}>
                    <File size={48} className={`mx-auto ${textSecondaryClass} mb-4`} />
                    <p className={textSecondaryClass}>No proposal documents yet. Add proposals to training engagements.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Run of Show / Agenda Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-xl font-bold ${textClass}`}>Run of Show / Agenda</h2>
                  <p className={`text-sm ${textSecondaryClass} mt-1`}>Training delivery schedules and agendas</p>
                </div>
                <button
                  onClick={() => {
                    const training = trainings[0];
                    if (training) openModal('runofshow', training);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <ClipboardList size={20} />
                  Add Run of Show
                </button>
              </div>

              <div className="grid gap-4">
                {trainings.map(training => (
                  training.runOfShowDocuments?.length > 0 && (
                    <div key={training.id} className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                      <h3 className={`font-semibold ${textClass} mb-4`}>{training.clientName} - {training.title}</h3>
                      <div className="space-y-3">
                        {training.runOfShowDocuments.map(doc => (
                          <div key={doc.id} className={`flex items-start gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <ClipboardList className="text-blue-600 mt-1" size={24} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`font-medium ${textClass}`}>{doc.fileName || doc.linkUrl}</span>
                                {doc.isCurrent && (
                                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Current</span>
                                )}
                              </div>
                              <div className={`text-sm ${textSecondaryClass} space-y-1`}>
                                <div>Version: {doc.versionLabel}</div>
                                <div>Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleString()}</div>
                                {doc.notes && <div className="italic">Notes: {doc.notes}</div>}
                              </div>
                              {doc.linkUrl && (
                                <a 
                                  href={doc.linkUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
                                >
                                  <ExternalLink size={14} />
                                  Open Link
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => openModal('runofshow', training)}
                              className={`p-2 ${textSecondaryClass} hover:text-blue-600 transition`}
                              title="Add new version"
                            >
                              <Upload size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
                {!trainings.some(t => t.runOfShowDocuments?.length > 0) && (
                  <div className={`${cardBgClass} rounded-lg border ${borderClass} p-12 text-center`}>
                    <ClipboardList size={48} className={`mx-auto ${textSecondaryClass} mb-4`} />
                    <p className={textSecondaryClass}>No run of show documents yet. Add agendas to training engagements.</p>
                  </div>
                )}
              </div>
            </div>

            {/* SOW / Contract Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className={`text-xl font-bold ${textClass}`}>Statement of Work / Contract</h2>
                  <p className={`text-sm ${textSecondaryClass} mt-1`}>SOW and contract documents with signature status tracking</p>
                </div>
                <button
                  onClick={() => {
                    const training = trainings[0];
                    if (training) openModal('sow', training);
                  }}
                  className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  <FileCheck size={20} />
                  Add SOW / Contract
                </button>
              </div>

              <div className="grid gap-4">
                {trainings.map(training => (
                  training.sowDocuments?.length > 0 && (
                    <div key={training.id} className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                      <h3 className={`font-semibold ${textClass} mb-4`}>{training.clientName} - {training.title}</h3>
                      <div className="space-y-3">
                        {training.sowDocuments.map(doc => (
                          <div key={doc.id} className={`flex items-start gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <FileCheck className="text-amber-600 mt-1" size={24} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`font-medium ${textClass}`}>{doc.fileName || doc.linkUrl}</span>
                                {doc.isCurrent && (
                                  <span className="px-2 py-0.5 bg-amber-600 text-white text-xs rounded-full">Current</span>
                                )}
                                {doc.status === 'Signed / Executed' && (
                                  <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">🟢 Signed / Executed</span>
                                )}
                                {doc.status === 'Pending Client Signature' && (
                                  <span className="px-2 py-0.5 bg-yellow-600 text-white text-xs rounded-full">🟡 Pending Client Signature</span>
                                )}
                              </div>
                              <div className={`text-sm ${textSecondaryClass} space-y-1`}>
                                <div>Version: {doc.versionLabel}</div>
                                <div>Status: {doc.status}</div>
                                <div>Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleString()}</div>
                                {doc.notes && <div className="italic">Notes: {doc.notes}</div>}
                              </div>
                              {doc.linkUrl && (
                                <a
                                  href={doc.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
                                >
                                  <ExternalLink size={14} />
                                  Open Link
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => openModal('sow', training)}
                              className={`p-2 ${textSecondaryClass} hover:text-amber-600 transition`}
                              title="Add new version"
                            >
                              <Upload size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
                {!trainings.some(t => t.sowDocuments?.length > 0) && (
                  <div className={`${cardBgClass} rounded-lg border ${borderClass} p-12 text-center`}>
                    <FileCheck size={48} className={`mx-auto ${textSecondaryClass} mb-4`} />
                    <p className={textSecondaryClass}>No SOW / contract documents yet. Add SOW/contracts to training engagements.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Header with View Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${textClass}`}>Master Schedule</h2>
                <p className={`text-sm ${textSecondaryClass} mt-1`}>View all scheduled training sessions</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg border ${borderClass} p-1">
                  <button
                    onClick={() => setScheduleView('list')}
                    className={`px-4 py-2 rounded transition ${
                      scheduleView === 'list'
                        ? 'bg-blue-600 text-white'
                        : `${textSecondaryClass} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
                    }`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setScheduleView('calendar')}
                    className={`px-4 py-2 rounded transition ${
                      scheduleView === 'calendar'
                        ? 'bg-blue-600 text-white'
                        : `${textSecondaryClass} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
                    }`}
                  >
                    Calendar View
                  </button>
                </div>
                <button
                  onClick={() => openModal('schedule', trainings[0])}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={20} />
                  Add Session
                </button>
              </div>
            </div>

            {/* List View */}
            {scheduleView === 'list' && (
              <div className={`${cardBgClass} rounded-lg border ${borderClass} overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${borderClass}`}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Event / Course Title</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Client Name</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Date & Time</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Delivery Mode</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Location / Link</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Instructor</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondaryClass} uppercase`}>Status</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderClass}`}>
                      {(() => {
                        // Collect all scheduled sessions from all trainings
                        const allSessions = [];
                        trainings.forEach(training => {
                          if (training.scheduledSessions?.length > 0) {
                            training.scheduledSessions.forEach(session => {
                              allSessions.push({
                                ...session,
                                clientName: training.clientName,
                                training: training
                              });
                            });
                          }
                        });

                        // Sort by date and time
                        allSessions.sort((a, b) => {
                          const dateA = new Date(`${a.startDate}T${a.startTime}`);
                          const dateB = new Date(`${b.startDate}T${b.startTime}`);
                          return dateA - dateB;
                        });

                        if (allSessions.length === 0) {
                          return (
                            <tr>
                              <td colSpan="7" className={`px-6 py-12 text-center ${textSecondaryClass}`}>
                                <Calendar size={48} className={`mx-auto ${textSecondaryClass} mb-4 opacity-50`} />
                                <p>No scheduled sessions yet. Click "Add Session" to schedule training.</p>
                              </td>
                            </tr>
                          );
                        }

                        return allSessions.map((session, index) => (
                          <tr key={index} className={hoverClass}>
                            <td className="px-6 py-4">
                              <div className={`font-medium ${textClass}`}>{session.eventTitle}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${textClass}`}>{session.clientName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${textClass}`}>
                                {new Date(session.startDate).toLocaleDateString()}
                              </div>
                              <div className={`text-xs ${textSecondaryClass}`}>
                                {session.startTime} – {session.endTime}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                session.deliveryMode === 'Virtual' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                session.deliveryMode === 'On-site' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              }`}>
                                {session.deliveryMode}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {session.deliveryMode === 'Virtual' || session.deliveryMode === 'Hybrid' ? (
                                <a
                                  href={session.virtualLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  <ExternalLink size={14} />
                                  Join Meeting
                                </a>
                              ) : (
                                <div className={`text-sm ${textClass} flex items-center gap-1`}>
                                  <MapPin size={14} />
                                  {session.location}
                                </div>
                              )}
                              {session.deliveryMode === 'Hybrid' && (
                                <div className={`text-xs ${textSecondaryClass} mt-1`}>{session.location}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${textClass}`}>{session.instructor}</div>
                              {session.facilitators?.length > 0 && (
                                <div className={`text-xs ${textSecondaryClass}`}>
                                  +{session.facilitators.length} facilitator{session.facilitators.length > 1 ? 's' : ''}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                session.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                session.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {session.status}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Calendar View */}
            {scheduleView === 'calendar' && (
              <div className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                {(() => {
                  // Collect all sessions
                  const allSessions = [];
                  trainings.forEach(training => {
                    if (training.scheduledSessions?.length > 0) {
                      training.scheduledSessions.forEach(session => {
                        allSessions.push({
                          ...session,
                          clientName: training.clientName
                        });
                      });
                    }
                  });

                  if (allSessions.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Calendar size={48} className={`mx-auto ${textSecondaryClass} mb-4 opacity-50`} />
                        <p className={textSecondaryClass}>No scheduled sessions yet. Click "Add Session" to schedule training.</p>
                      </div>
                    );
                  }

                  // Group sessions by date
                  const sessionsByDate = {};
                  allSessions.forEach(session => {
                    const date = session.startDate;
                    if (!sessionsByDate[date]) {
                      sessionsByDate[date] = [];
                    }
                    sessionsByDate[date].push(session);
                  });

                  // Sort dates
                  const sortedDates = Object.keys(sessionsByDate).sort();

                  return (
                    <div className="space-y-6">
                      <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Upcoming Sessions</h3>
                      {sortedDates.map(date => (
                        <div key={date} className={`border ${borderClass} rounded-lg p-4`}>
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar className="text-blue-600" size={24} />
                            <div>
                              <div className={`font-semibold ${textClass}`}>
                                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                              <div className={`text-sm ${textSecondaryClass}`}>
                                {sessionsByDate[date].length} session{sessionsByDate[date].length > 1 ? 's' : ''} scheduled
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {sessionsByDate[date].map((session, idx) => (
                              <div
                                key={idx}
                                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className={`font-medium ${textClass} mb-1`}>
                                      {session.clientName} – {session.eventTitle}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="flex items-center gap-1">
                                        <Clock size={14} className={textSecondaryClass} />
                                        <span className={textSecondaryClass}>
                                          {session.startTime} – {session.endTime}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users size={14} className={textSecondaryClass} />
                                        <span className={textSecondaryClass}>{session.instructor}</span>
                                      </div>
                                      {(session.deliveryMode === 'Virtual' || session.deliveryMode === 'Hybrid') && (
                                        <a
                                          href={session.virtualLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                        >
                                          <Video size={14} />
                                          Join
                                        </a>
                                      )}
                                      {(session.deliveryMode === 'On-site' || session.deliveryMode === 'Hybrid') && (
                                        <div className="flex items-center gap-1">
                                          <MapPin size={14} className={textSecondaryClass} />
                                          <span className={textSecondaryClass}>{session.location}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    session.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    session.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}>
                                    {session.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* General Metrics */}
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

            {/* Conversion Metrics */}
            <div>
              <h2 className={`text-xl font-bold ${textClass} mb-4`}>Proposal to Contract Conversion</h2>
              <div className="grid grid-cols-3 gap-6">
                {(() => {
                  // Calculate conversion metrics
                  const proposalsSent = trainings.filter(t => t.proposalDocuments?.length > 0).length;
                  const contractsSigned = trainings.filter(t =>
                    t.sowDocuments?.some(doc => doc.status === 'Signed / Executed')
                  ).length;
                  const conversionRate = proposalsSent > 0
                    ? ((contractsSigned / proposalsSent) * 100).toFixed(1)
                    : 0;

                  return (
                    <>
                      <div className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`font-medium ${textClass}`}>Proposals Sent</h3>
                          <File className="text-green-600" size={24} />
                        </div>
                        <div className={`text-3xl font-bold ${textClass}`}>
                          {proposalsSent}
                        </div>
                        <p className={`text-sm ${textSecondaryClass} mt-2`}>
                          Engagements with proposals
                        </p>
                      </div>

                      <div className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`font-medium ${textClass}`}>Contracts Signed</h3>
                          <FileCheck className="text-amber-600" size={24} />
                        </div>
                        <div className={`text-3xl font-bold ${textClass}`}>
                          {contractsSigned}
                        </div>
                        <p className={`text-sm ${textSecondaryClass} mt-2`}>
                          SOWs fully executed
                        </p>
                      </div>

                      <div className={`${cardBgClass} rounded-lg border ${borderClass} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`font-medium ${textClass}`}>Conversion Rate</h3>
                          <TrendingUp className={
                            conversionRate >= 50 ? 'text-green-600' :
                            conversionRate >= 25 ? 'text-yellow-600' :
                            'text-red-600'
                          } size={24} />
                        </div>
                        <div className={`text-3xl font-bold ${textClass}`}>
                          {conversionRate}%
                        </div>
                        <p className={`text-sm ${textSecondaryClass} mt-2`}>
                          {proposalsSent > 0 ? `${contractsSigned} of ${proposalsSent} proposals` : 'No proposals yet'}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <>
          {modalType === 'runofshow' ? (
            <RunOfShowModal training={selectedItem} darkMode={darkMode} onClose={closeModal} onSubmit={handleSubmit} />
          ) : modalType === 'sow' ? (
            <SOWModal training={selectedItem} darkMode={darkMode} onClose={closeModal} onSubmit={handleSubmit} />
          ) : modalType === 'schedule' ? (
            <ScheduleModal training={selectedItem} session={null} darkMode={darkMode} onClose={closeModal} onSubmit={handleSubmit} />
          ) : modalType === 'proposal' ? (
            <ProposalModal training={selectedItem} darkMode={darkMode} onClose={closeModal} onSubmit={handleSubmit} />
          ) : modalType === 'email' ? (
            <EmailModal training={selectedItem} darkMode={darkMode} onClose={closeModal} onSubmit={handleSubmit} />
          ) : modalType === 'coordination' ? (
            <CoordinationCallModal training={selectedItem} darkMode={darkMode} onClose={closeModal} onSubmit={handleSubmit} />
          ) : modalType === 'scoping' ? (
            <ScopingCallModal training={selectedItem} darkMode={darkMode} onClose={closeModal} onSubmit={handleSubmit} />
          ) : (
            <TrainingModal type={modalType} training={selectedItem} stages={stages} trainingTypes={trainingTypes} deliveryModes={deliveryModes} darkMode={darkMode} onClose={closeModal} onSubmit={handleSubmit} />
          )}
        </>
      )}
    </div>
  );
};

const RunOfShowModal = ({ training, darkMode, onClose, onSubmit }) => {
  const [uploadType, setUploadType] = useState('link');
  const [formData, setFormData] = useState({
    fileName: '',
    linkUrl: '',
    versionLabel: '',
    notes: ''
  });

  const [fileInfo, setFileInfo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['.pdf', '.docx', '.xlsx', '.xls', '.doc'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExt)) {
        alert('Only PDF, Word (DOCX/DOC), and Excel (XLSX/XLS) files are allowed');
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        return;
      }

      setFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return url.includes('sharepoint.com') || url.includes('drive.google.com') || url.includes('dropbox.com') || url.includes('box.com');
    } catch {
      return false;
    }
  };

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4`}>
          <div className="flex items-center gap-3">
            <ClipboardList className="text-blue-600" size={24} />
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>Add Run of Show / Agenda</h2>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>{training?.clientName} - {training?.title}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <p className={`text-sm ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
              <strong>Purpose:</strong> Upload or link the training agenda/run of show so trainers and stakeholders can see what will happen during delivery. Only one document can be marked as the current version.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-3`}>Upload Method</label>
            <div className="flex gap-4">
              <button
                onClick={() => setUploadType('link')}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  uploadType === 'link'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                    : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                }`}
              >
                <ExternalLink className={uploadType === 'link' ? 'text-blue-600' : textSecondaryClass} size={24} />
                <div className={`font-medium ${textClass} mt-2`}>Paste Link</div>
                <div className={`text-xs ${textSecondaryClass} mt-1`}>SharePoint, Google Drive, etc.</div>
              </button>
              <button
                onClick={() => setUploadType('file')}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  uploadType === 'file'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                    : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                }`}
              >
                <Upload className={uploadType === 'file' ? 'text-blue-600' : textSecondaryClass} size={24} />
                <div className={`font-medium ${textClass} mt-2`}>Upload File</div>
                <div className={`text-xs ${textSecondaryClass} mt-1`}>PDF, Word, Excel</div>
              </button>
            </div>
          </div>

          {uploadType === 'link' && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Document Link *</label>
              <input
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                required
                placeholder="https://sharepoint.com/... or https://drive.google.com/..."
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
              <p className={`text-xs ${textSecondaryClass} mt-1`}>
                Paste a link to SharePoint, Google Drive, Dropbox, or Box
              </p>
              {formData.linkUrl && !validateUrl(formData.linkUrl) && (
                <p className="text-xs text-red-600 mt-1">⚠️ Please provide a valid SharePoint or cloud storage link</p>
              )}
            </div>
          )}

          {uploadType === 'file' && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Upload File *</label>
              <div className={`border-2 border-dashed ${inputBorderClass} rounded-lg p-6 text-center`}>
                <ClipboardList className={`mx-auto ${textSecondaryClass} mb-2`} size={32} />
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="runofshow-upload"
                />
                <label
                  htmlFor="runofshow-upload"
                  className={`cursor-pointer text-sm ${textClass} hover:text-blue-600 transition`}
                >
                  Click to upload or drag and drop
                </label>
                <p className={`text-xs ${textSecondaryClass} mt-1`}>
                  PDF, Word (DOCX/DOC), or Excel (XLSX/XLS) - max 10MB
                </p>
              </div>
              {fileInfo && (
                <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${textClass}`}>{fileInfo.name}</div>
                      <div className={`text-xs ${textSecondaryClass}`}>{fileInfo.size}</div>
                    </div>
                  </div>
                </div>
              )}
              <p className={`text-xs ${textSecondaryClass} mt-2`}>
                Note: In this demo, file content is not actually uploaded. Only the filename is stored.
              </p>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Version Label *</label>
            <input
              type="text"
              value={formData.versionLabel}
              onChange={(e) => setFormData(prev => ({ ...prev, versionLabel: e.target.value }))}
              required
              placeholder="e.g., Final Agenda, Day 1 Schedule, v2.0"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Notes / Key Updates</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows="3"
              placeholder="Describe key updates or changes in this version (e.g., 'Added afternoon breakout session', 'Updated timings for Day 2')..."
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className={`${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-3`}>
            <p className={`text-sm ${darkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>
              ℹ️ This run of show will be marked as the <strong>current version</strong>. Previous versions will remain accessible but will no longer be marked as current.
            </p>
          </div>

          <div className={`flex gap-3 pt-4 border-t ${borderClass}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${inputBorderClass} ${textClass} rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (uploadType === 'link' && !validateUrl(formData.linkUrl)) {
                  alert('Please provide a valid cloud storage link');
                  return;
                }
                if (uploadType === 'file' && !formData.fileName) {
                  alert('Please select a file to upload');
                  return;
                }
                if (!formData.versionLabel) {
                  alert('Please provide a version label');
                  return;
                }
                onSubmit(formData);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Run of Show
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleModal = ({ training, session, darkMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    eventTitle: session?.eventTitle || '',
    startDate: session?.startDate || '',
    startTime: session?.startTime || '',
    endDate: session?.endDate || '',
    endTime: session?.endTime || '',
    deliveryMode: session?.deliveryMode || 'Virtual',
    location: session?.location || '',
    virtualLink: session?.virtualLink || '',
    instructor: session?.instructor || '',
    facilitators: session?.facilitators?.join(', ') || '',
    status: session?.status || 'Tentative'
  });

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4`}>
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>
                {session ? 'Edit Training Session' : 'Add New Training Session'}
              </h2>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>
                {training?.clientName} - {training?.title}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <p className={`text-sm ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
              <strong>Purpose:</strong> Schedule a training delivery session with all key details including dates, times, instructor, and logistics.
            </p>
          </div>

          {/* Event Title */}
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Event / Course Title *
            </label>
            <input
              type="text"
              value={formData.eventTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, eventTitle: e.target.value }))}
              required
              placeholder="e.g., AI Fundamentals Training - Day 1"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          {/* Delivery Mode */}
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Delivery Mode *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Virtual', 'On-site', 'Hybrid'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setFormData(prev => ({ ...prev, deliveryMode: mode }))}
                  className={`p-3 rounded-lg border-2 transition ${
                    formData.deliveryMode === mode
                      ? mode === 'Virtual' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' :
                        mode === 'On-site' ? 'border-green-600 bg-green-50 dark:bg-green-900' :
                        'border-purple-600 bg-purple-50 dark:bg-purple-900'
                      : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                  }`}
                >
                  <div className={`font-medium ${textClass} text-sm`}>{mode}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location (for On-site and Hybrid) */}
          {(formData.deliveryMode === 'On-site' || formData.deliveryMode === 'Hybrid') && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
                placeholder="e.g., TechCorp HQ, Conference Room A"
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          )}

          {/* Virtual Link (for Virtual and Hybrid) */}
          {(formData.deliveryMode === 'Virtual' || formData.deliveryMode === 'Hybrid') && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>
                Virtual Meeting Link *
              </label>
              <input
                type="url"
                value={formData.virtualLink}
                onChange={(e) => setFormData(prev => ({ ...prev, virtualLink: e.target.value }))}
                required
                placeholder="https://zoom.us/j/123456789"
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          )}

          {/* Instructor */}
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Instructor *
            </label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
              required
              placeholder="Primary instructor name"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Facilitators */}
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Facilitators (Optional)
            </label>
            <input
              type="text"
              value={formData.facilitators}
              onChange={(e) => setFormData(prev => ({ ...prev, facilitators: e.target.value }))}
              placeholder="Comma-separated names (e.g., Lisa Thompson, John Davis)"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
            <p className={`text-xs ${textSecondaryClass} mt-1`}>
              Enter multiple facilitators separated by commas
            </p>
          </div>

          {/* Status */}
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>
              Status *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Tentative', 'Confirmed', 'Completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFormData(prev => ({ ...prev, status }))}
                  className={`p-3 rounded-lg border-2 transition ${
                    formData.status === status
                      ? status === 'Confirmed' ? 'border-green-600 bg-green-50 dark:bg-green-900' :
                        status === 'Tentative' ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900' :
                        'border-gray-600 bg-gray-50 dark:bg-gray-700'
                      : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                  }`}
                >
                  <div className={`font-medium ${textClass} text-sm`}>{status}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={`flex gap-3 pt-4 border-t ${borderClass}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${inputBorderClass} ${textClass} rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!formData.eventTitle || !formData.startDate || !formData.startTime ||
                    !formData.endDate || !formData.endTime || !formData.instructor) {
                  alert('Please fill in all required fields');
                  return;
                }
                if ((formData.deliveryMode === 'On-site' || formData.deliveryMode === 'Hybrid') && !formData.location) {
                  alert('Please provide a location for on-site or hybrid delivery');
                  return;
                }
                if ((formData.deliveryMode === 'Virtual' || formData.deliveryMode === 'Hybrid') && !formData.virtualLink) {
                  alert('Please provide a virtual meeting link');
                  return;
                }

                const sessionData = {
                  ...formData,
                  facilitators: formData.facilitators.split(',').map(f => f.trim()).filter(f => f)
                };

                onSubmit(sessionData);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {session ? 'Update Session' : 'Add Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SOWModal = ({ training, darkMode, onClose, onSubmit }) => {
  const [uploadType, setUploadType] = useState('link');
  const [formData, setFormData] = useState({
    fileName: '',
    linkUrl: '',
    versionLabel: '',
    status: 'Pending Client Signature',
    notes: ''
  });

  const [fileInfo, setFileInfo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['.pdf', '.docx', '.doc'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();

      if (!allowedTypes.includes(fileExt)) {
        alert('Only PDF and Word (DOCX/DOC) files are allowed');
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        return;
      }

      setFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return url.includes('sharepoint.com') || url.includes('drive.google.com') || url.includes('dropbox.com') || url.includes('box.com');
    } catch {
      return false;
    }
  };

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4`}>
          <div className="flex items-center gap-3">
            <FileCheck className="text-amber-600" size={24} />
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>Add SOW / Contract</h2>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>{training?.clientName} - {training?.title}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${darkMode ? 'bg-amber-900 border-amber-700' : 'bg-amber-50 border-amber-200'} border rounded-lg p-4`}>
            <p className={`text-sm ${darkMode ? 'text-amber-100' : 'text-amber-900'}`}>
              <strong>Purpose:</strong> Upload or link the Statement of Work (SOW) or Contract and track its signature status. Only one document can be marked as the current version.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-3`}>Upload Method</label>
            <div className="flex gap-4">
              <button
                onClick={() => setUploadType('link')}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  uploadType === 'link'
                    ? 'border-amber-600 bg-amber-50 dark:bg-amber-900'
                    : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                }`}
              >
                <ExternalLink className={uploadType === 'link' ? 'text-amber-600' : textSecondaryClass} size={24} />
                <div className={`font-medium ${textClass} mt-2`}>Paste Link</div>
                <div className={`text-xs ${textSecondaryClass} mt-1`}>SharePoint, Google Drive, etc.</div>
              </button>
              <button
                onClick={() => setUploadType('file')}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  uploadType === 'file'
                    ? 'border-amber-600 bg-amber-50 dark:bg-amber-900'
                    : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                }`}
              >
                <Upload className={uploadType === 'file' ? 'text-amber-600' : textSecondaryClass} size={24} />
                <div className={`font-medium ${textClass} mt-2`}>Upload File</div>
                <div className={`text-xs ${textSecondaryClass} mt-1`}>PDF, Word</div>
              </button>
            </div>
          </div>

          {uploadType === 'link' && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Document Link *</label>
              <input
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                required
                placeholder="https://sharepoint.com/... or https://drive.google.com/..."
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-amber-500`}
              />
              <p className={`text-xs ${textSecondaryClass} mt-1`}>
                Paste a link to SharePoint, Google Drive, Dropbox, or Box
              </p>
              {formData.linkUrl && !validateUrl(formData.linkUrl) && (
                <p className="text-xs text-red-600 mt-1">⚠️ Please provide a valid SharePoint or cloud storage link</p>
              )}
            </div>
          )}

          {uploadType === 'file' && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Upload File *</label>
              <div className={`border-2 border-dashed ${inputBorderClass} rounded-lg p-6 text-center`}>
                <FileCheck className={`mx-auto ${textSecondaryClass} mb-2`} size={32} />
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                  id="sow-upload"
                />
                <label
                  htmlFor="sow-upload"
                  className={`cursor-pointer text-sm ${textClass} hover:text-amber-600 transition`}
                >
                  Click to upload or drag and drop
                </label>
                <p className={`text-xs ${textSecondaryClass} mt-1`}>
                  PDF or Word (DOCX/DOC) - max 10MB
                </p>
              </div>
              {fileInfo && (
                <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <FileCheck className="text-amber-600" size={20} />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${textClass}`}>{fileInfo.name}</div>
                      <div className={`text-xs ${textSecondaryClass}`}>{fileInfo.size}</div>
                    </div>
                  </div>
                </div>
              )}
              <p className={`text-xs ${textSecondaryClass} mt-2`}>
                Note: In this demo, file content is not actually uploaded. Only the filename is stored.
              </p>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Version Label *</label>
            <input
              type="text"
              value={formData.versionLabel}
              onChange={(e) => setFormData(prev => ({ ...prev, versionLabel: e.target.value }))}
              required
              placeholder="e.g., Final SOW, Draft v2.0, Revised Contract"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-amber-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Document Status *</label>
            <div className="flex gap-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, status: 'Pending Client Signature' }))}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  formData.status === 'Pending Client Signature'
                    ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900'
                    : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                }`}
              >
                <div className={`text-2xl mb-2`}>🟡</div>
                <div className={`font-medium ${textClass} text-sm`}>Pending Client Signature</div>
                <div className={`text-xs ${textSecondaryClass} mt-1`}>Awaiting client to sign</div>
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, status: 'Signed / Executed' }))}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  formData.status === 'Signed / Executed'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900'
                    : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                }`}
              >
                <div className={`text-2xl mb-2`}>🟢</div>
                <div className={`font-medium ${textClass} text-sm`}>Signed / Executed</div>
                <div className={`text-xs ${textSecondaryClass} mt-1`}>Fully executed contract</div>
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Notes / Key Updates</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows="3"
              placeholder="Add notes about this version (e.g., 'Signed by client on 2/18/2025', 'Updated pricing terms', 'Pending legal review')..."
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-amber-500`}
            />
          </div>

          <div className={`${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-3`}>
            <p className={`text-sm ${darkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>
              ℹ️ This SOW/Contract will be marked as the <strong>current version</strong>. Previous versions will remain accessible but will no longer be marked as current.
            </p>
          </div>

          <div className={`flex gap-3 pt-4 border-t ${borderClass}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${inputBorderClass} ${textClass} rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (uploadType === 'link' && !validateUrl(formData.linkUrl)) {
                  alert('Please provide a valid cloud storage link');
                  return;
                }
                if (uploadType === 'file' && !formData.fileName) {
                  alert('Please select a file to upload');
                  return;
                }
                if (!formData.versionLabel) {
                  alert('Please provide a version label');
                  return;
                }
                if (!formData.status) {
                  alert('Please select a document status');
                  return;
                }
                onSubmit(formData);
              }}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Add SOW / Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProposalModal = ({ training, darkMode, onClose, onSubmit }) => {
  const [uploadType, setUploadType] = useState('link');
  const [formData, setFormData] = useState({
    fileName: '',
    linkUrl: '',
    versionLabel: '',
    notes: ''
  });

  const [fileInfo, setFileInfo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['.pdf', '.docx', '.pptx'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExt)) {
        alert('Only PDF, DOCX, and PPTX files are allowed');
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        return;
      }

      setFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return url.includes('sharepoint.com') || url.includes('drive.google.com') || url.includes('dropbox.com') || url.includes('box.com');
    } catch {
      return false;
    }
  };

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4`}>
          <div className="flex items-center gap-3">
            <Upload className="text-green-600" size={24} />
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>Add Proposal Document</h2>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>{training?.clientName} - {training?.title}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
            <p className={`text-sm ${darkMode ? 'text-green-100' : 'text-green-900'}`}>
              <strong>Purpose:</strong> Upload or link proposal documents so all stakeholders can access the most recent proposal. Only one document can be marked as the current version.
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-3`}>Upload Method</label>
            <div className="flex gap-4">
              <button
                onClick={() => setUploadType('link')}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  uploadType === 'link'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900'
                    : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                }`}
              >
                <ExternalLink className={uploadType === 'link' ? 'text-green-600' : textSecondaryClass} size={24} />
                <div className={`font-medium ${textClass} mt-2`}>Paste Link</div>
                <div className={`text-xs ${textSecondaryClass} mt-1`}>SharePoint, Google Drive, etc.</div>
              </button>
              <button
                onClick={() => setUploadType('file')}
                className={`flex-1 p-4 rounded-lg border-2 transition ${
                  uploadType === 'file'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900'
                    : `border-${darkMode ? 'gray-600' : 'gray-300'}`
                }`}
              >
                <Upload className={uploadType === 'file' ? 'text-green-600' : textSecondaryClass} size={24} />
                <div className={`font-medium ${textClass} mt-2`}>Upload File</div>
                <div className={`text-xs ${textSecondaryClass} mt-1`}>PDF, DOCX, PPTX</div>
              </button>
            </div>
          </div>

          {uploadType === 'link' && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Document Link *</label>
              <input
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                required
                placeholder="https://sharepoint.com/... or https://drive.google.com/..."
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-green-500`}
              />
              <p className={`text-xs ${textSecondaryClass} mt-1`}>
                Paste a link to SharePoint, Google Drive, Dropbox, or Box
              </p>
              {formData.linkUrl && !validateUrl(formData.linkUrl) && (
                <p className="text-xs text-red-600 mt-1">⚠️ Please provide a valid SharePoint or cloud storage link</p>
              )}
            </div>
          )}

          {uploadType === 'file' && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Upload File *</label>
              <div className={`border-2 border-dashed ${inputBorderClass} rounded-lg p-6 text-center`}>
                <Upload className={`mx-auto ${textSecondaryClass} mb-2`} size={32} />
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer text-sm ${textClass} hover:text-green-600 transition`}
                >
                  Click to upload or drag and drop
                </label>
                <p className={`text-xs ${textSecondaryClass} mt-1`}>
                  PDF, DOCX, or PPTX (max 10MB)
                </p>
              </div>
              {fileInfo && (
                <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <File className="text-green-600" size={20} />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${textClass}`}>{fileInfo.name}</div>
                      <div className={`text-xs ${textSecondaryClass}`}>{fileInfo.size}</div>
                    </div>
                  </div>
                </div>
              )}
              <p className={`text-xs ${textSecondaryClass} mt-2`}>
                Note: In this demo, file content is not actually uploaded. Only the filename is stored.
              </p>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Version Label *</label>
            <input
              type="text"
              value={formData.versionLabel}
              onChange={(e) => setFormData(prev => ({ ...prev, versionLabel: e.target.value }))}
              required
              placeholder="e.g., v1.0, Draft, Final, 2025-01-15"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-green-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows="3"
              placeholder="Any additional notes about this version..."
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-green-500`}
            />
          </div>

          <div className={`${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-3`}>
            <p className={`text-sm ${darkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>
              ℹ️ This proposal will be marked as the <strong>current version</strong>. Previous versions will remain accessible but will no longer be marked as current.
            </p>
          </div>

          <div className={`flex gap-3 pt-4 border-t ${borderClass}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${inputBorderClass} ${textClass} rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (uploadType === 'link' && !validateUrl(formData.linkUrl)) {
                  alert('Please provide a valid cloud storage link');
                  return;
                }
                if (uploadType === 'file' && !formData.fileName) {
                  alert('Please select a file to upload');
                  return;
                }
                if (!formData.versionLabel) {
                  alert('Please provide a version label');
                  return;
                }
                onSubmit(formData);
              }}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add Proposal Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailModal = ({ training, darkMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    recipients: '',
    subject: '',
    body: '',
    attachments: []
  });

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4`}>
          <div className="flex items-center gap-3">
            <Inbox className="text-purple-600" size={24} />
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>Add Email Communication</h2>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>{training?.clientName} - {training?.title}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'} border rounded-lg p-4`}>
            <p className={`text-sm ${darkMode ? 'text-purple-100' : 'text-purple-900'}`}>
              <strong>Purpose:</strong> Capture email communications to maintain a complete history of all project correspondence for context, accountability, and transparency.
            </p>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${textClass} mb-4 pb-2 border-b ${borderClass}`}>Email Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Sender Name *</label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                  required
                  placeholder="e.g., Sarah Johnson"
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Sender Email *</label>
                <input
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, senderEmail: e.target.value }))}
                  required
                  placeholder="e.g., sarah@techcorp.com"
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-purple-500`}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Recipient(s) *</label>
              <input
                type="text"
                value={formData.recipients}
                onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                required
                placeholder="e.g., training@company.com, mike@company.com"
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-purple-500`}
              />
              <p className={`text-xs ${textSecondaryClass} mt-1`}>Separate multiple recipients with commas</p>
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Subject Line *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required
                placeholder="e.g., Training Request - AI Fundamentals"
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-purple-500`}
              />
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${textClass} mb-4 pb-2 border-b ${borderClass}`}>Email Content</h3>
            
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Email Body *</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                required
                rows="12"
                placeholder="Paste the full email body here..."
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm`}
              />
              <p className={`text-xs ${textSecondaryClass} mt-1`}>Copy and paste the email content to preserve formatting</p>
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Attachments</label>
              <div className={`flex items-center gap-2 px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg`}>
                <Paperclip size={16} className={textSecondaryClass} />
                <input
                  type="text"
                  value={formData.attachments.join(', ')}
                  onChange={(e) => setFormData(prev => ({ ...prev, attachments: e.target.value.split(',').map(a => a.trim()).filter(Boolean) }))}
                  placeholder="List attachment filenames (e.g., proposal.pdf, agenda.docx)"
                  className={`flex-1 bg-transparent focus:outline-none ${textClass}`}
                />
              </div>
              <p className={`text-xs ${textSecondaryClass} mt-1`}>Note: Actual files are not uploaded, only filenames are recorded</p>
            </div>
          </div>

          <div className={`flex gap-3 pt-4 border-t ${borderClass}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${inputBorderClass} ${textClass} rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Add Email to Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoordinationCallModal = ({ training, darkMode, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    callDate: new Date().toISOString().split('T')[0],
    callTime: new Date().toTimeString().slice(0, 5),
    attendeesAndRoles: training?.scopingCall?.attendeeRoles || '',
    callPurpose: '',
    discussionSummary: '',
    updatedObjectives: '',
    additionalMaterials: '',
    deliveryChanges: '',
    followUpActions: '',
    notes: ''
  });

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4`}>
          <div className="flex items-center gap-3">
            <MessageSquare className="text-blue-600" size={24} />
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>Record Coordination Call</h2>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>{training?.clientName} - {training?.title}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <p className={`text-sm ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
              <strong>Purpose:</strong> Capture additional client instructions, updates, or changes to the training plan.
            </p>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${textClass} mb-4 pb-2 border-b ${borderClass}`}>Call Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Call Date *</label>
                <input
                  type="date"
                  name="callDate"
                  value={formData.callDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, callDate: e.target.value }))}
                  required
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Call Time *</label>
                <input
                  type="time"
                  name="callTime"
                  value={formData.callTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, callTime: e.target.value }))}
                  required
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Attendees and Roles *</label>
              <input
                type="text"
                value={formData.attendeesAndRoles}
                onChange={(e) => setFormData(prev => ({ ...prev, attendeesAndRoles: e.target.value }))}
                required
                placeholder="e.g., John Smith (Client Lead), Sarah Johnson (Training Manager)"
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Purpose of Call *</label>
              <select
                value={formData.callPurpose}
                onChange={(e) => setFormData(prev => ({ ...prev, callPurpose: e.target.value }))}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select purpose...</option>
                <option value="Logistics Update">Logistics Update</option>
                <option value="Additional Content Requests">Additional Content Requests</option>
                <option value="Instructor Confirmation">Instructor Confirmation</option>
                <option value="Participant Confirmation">Participant Confirmation</option>
                <option value="Schedule Changes">Schedule Changes</option>
                <option value="Materials Review">Materials Review</option>
                <option value="General Coordination">General Coordination</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${textClass} mb-4 pb-2 border-b ${borderClass}`}>Discussion Summary</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Summary of Discussion Points *</label>
                <textarea
                  value={formData.discussionSummary}
                  onChange={(e) => setFormData(prev => ({ ...prev, discussionSummary: e.target.value }))}
                  required
                  rows="4"
                  placeholder="Key topics discussed, decisions made, questions raised..."
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>New or Updated Training Objectives</label>
                <textarea
                  value={formData.updatedObjectives}
                  onChange={(e) => setFormData(prev => ({ ...prev, updatedObjectives: e.target.value }))}
                  rows="3"
                  placeholder="Any changes or additions to objectives..."
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${textClass} mb-4 pb-2 border-b ${borderClass}`}>Updates and Changes</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Additional Materials Requested</label>
                <textarea
                  value={formData.additionalMaterials}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalMaterials: e.target.value }))}
                  rows="3"
                  placeholder="List any new materials, handouts, tools, or resources..."
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Changes to Delivery Mode, Dates, or Duration</label>
                <textarea
                  value={formData.deliveryChanges}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryChanges: e.target.value }))}
                  rows="3"
                  placeholder="Note any changes to delivery format, dates, or duration..."
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${textClass} mb-4 pb-2 border-b ${borderClass}`}>Follow-Up</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Follow-Up Actions and Responsible Parties *</label>
                <textarea
                  value={formData.followUpActions}
                  onChange={(e) => setFormData(prev => ({ ...prev, followUpActions: e.target.value }))}
                  required
                  rows="4"
                  placeholder="List action items:&#10;• Update participant list - Sarah - 3/15/2025&#10;• Send revised agenda - Mike - 3/10/2025"
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>Notes / Client Instructions</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  placeholder="Any additional notes or context..."
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>

          <div className={`flex gap-3 pt-4 border-t ${borderClass}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${inputBorderClass} ${textClass} rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Coordination Call
            </button>
          </div>
        </div>
      </div>
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

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4`}>
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" size={24} />
            <div>
              <h2 className={`text-xl font-bold ${textClass}`}>Record Scoping Call</h2>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>{training?.clientName} - {training?.title}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Attendee Roles *</label>
            <input
              type="text"
              value={formData.attendeeRoles}
              onChange={(e) => setFormData(prev => ({ ...prev, attendeeRoles: e.target.value }))}
              required
              placeholder="e.g., Executives, Managers, Analysts"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Training Objectives *</label>
            <textarea
              value={formData.trainingObjectives}
              onChange={(e) => setFormData(prev => ({ ...prev, trainingObjectives: e.target.value }))}
              required
              rows="5"
              placeholder="At the end of the course, participants should be able to..."
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Delivery Mode *</label>
              <select
                value={formData.deliveryMode}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryMode: e.target.value }))}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select mode...</option>
                <option value="Virtual">Virtual</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Duration *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                required
                placeholder="e.g., 2 days, 6 hours"
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Preferred Time Window *</label>
            <input
              type="text"
              value={formData.preferredTimeWindow}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredTimeWindow: e.target.value }))}
              required
              placeholder="e.g., Q1 2025, March 15-20"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Number of Participants *</label>
            <input
              type="number"
              value={formData.numberOfParticipants}
              onChange={(e) => setFormData(prev => ({ ...prev, numberOfParticipants: e.target.value }))}
              required
              min="1"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Special Requirements</label>
            <textarea
              value={formData.specialRequirements}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
              rows="3"
              placeholder="Technical setup, materials, language preferences..."
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows="3"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className={`flex gap-3 pt-4 border-t ${borderClass}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${inputBorderClass} ${textClass} rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
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

const TrainingModal = ({ type, training, stages, trainingTypes, deliveryModes, darkMode, onClose, onSubmit }) => {
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
    type: '',
    value: '',
    deliveryDate: '',
    description: '',
    notes: ''
  });

  const isViewMode = type === 'view';
  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const inputBorderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${bgClass} border-b ${borderClass} px-6 py-4`}>
          <h2 className={`text-xl font-bold ${textClass}`}>
            {type === 'new' ? 'New Client Request' : type === 'edit' ? 'Edit Request' : 'Request Details'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {isViewMode && (training?.emailCommunications?.length > 0 || training?.coordinationCalls?.length > 0 || training?.scopingCallCompleted) && (
            <div>
              <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Communications History</h3>
              <div className="space-y-4">
                {training?.emailCommunications?.map((email) => (
                  <div key={email.id} className={`${darkMode ? 'bg-purple-900 bg-opacity-30' : 'bg-purple-50'} border ${darkMode ? 'border-purple-700' : 'border-purple-200'} rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <Inbox className="text-purple-600 mt-1" size={20} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`font-semibold ${textClass}`}>{email.subject}</div>
                          <div className={`text-xs ${textSecondaryClass}`}>
                            {new Date(email.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className={`text-sm ${textSecondaryClass} mb-2`}>
                          <strong>From:</strong> {email.senderName} ({email.senderEmail})
                          <br />
                          <strong>To:</strong> {email.recipients}
                        </div>
                        <div className={`text-sm ${textClass} whitespace-pre-wrap bg-${darkMode ? 'gray-800' : 'white'} p-3 rounded border ${borderClass}`}>
                          {email.body}
                        </div>
                        {email.attachments?.length > 0 && (
                          <div className={`text-xs ${textSecondaryClass} mt-2 flex items-center gap-1`}>
                            <Paperclip size={12} />
                            <span>Attachments: {email.attachments.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {training?.coordinationCalls?.map((call, idx) => (
                  <div key={call.id} className={`${darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'} border ${darkMode ? 'border-blue-700' : 'border-blue-200'} rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <MessageSquare className="text-blue-600 mt-1" size={20} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`font-semibold ${textClass}`}>Coordination Call #{idx + 1} - {call.callPurpose}</div>
                          <div className={`text-xs ${textSecondaryClass}`}>{call.callDate} at {call.callTime}</div>
                        </div>
                        <div className={`text-sm ${textClass}`}>{call.discussionSummary}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {training?.scopingCallCompleted && (
                  <div className={`${darkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-50'} border ${darkMode ? 'border-green-700' : 'border-green-200'} rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <FileText className="text-green-600 mt-1" size={20} />
                      <div className="flex-1">
                        <div className={`font-semibold ${textClass} mb-2`}>Scoping Call</div>
                        <div className={`text-sm ${textClass}`}>
                          <strong>Objectives:</strong> {training.scopingCall?.trainingObjectives}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Client Name *</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              disabled={isViewMode}
              required
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg disabled:bg-gray-100`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Contact Name *</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                disabled={isViewMode}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg disabled:bg-gray-100`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Contact Email *</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                disabled={isViewMode}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg disabled:bg-gray-100`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Training Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={isViewMode}
              required
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg disabled:bg-gray-100`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-1`}>Topic Requests *</label>
            <textarea
              value={formData.topicRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, topicRequests: e.target.value }))}
              disabled={isViewMode}
              required
              rows="3"
              className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg disabled:bg-gray-100`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Attendees *</label>
              <input
                type="number"
                value={formData.attendees}
                onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
                disabled={isViewMode}
                required
                min="1"
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg disabled:bg-gray-100`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>Delivery Mode *</label>
              <select
                value={formData.deliveryMode}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryMode: e.target.value }))}
                disabled={isViewMode}
                required
                className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} rounded-lg disabled:bg-gray-100`}
              >
                <option value="">Select...</option>
                {deliveryModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`flex gap-3 pt-4 border-t ${borderClass}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${inputBorderClass} ${textClass} rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button
                onClick={() => onSubmit(formData)}
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