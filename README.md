# Training Management Application

A comprehensive system for managing AI and Product Management training pipelines from initial client intake through delivery, evaluation, and invoicing.

## 🎯 Project Overview

This application was developed iteratively through conversation with Claude AI, with each feature built based on specific user stories and requirements. The app helps training managers track client requests, record scoping calls, manage the training development pipeline, and monitor progress through various stages.

## 📋 Development History & Prompts

### Initial Setup Prompt
**Prompt:**
> "Develop a Training Management Application that a company will use to manage their AI and Product Management training pipeline – intake, proposal & outline development, curriculum development, delivery, session evaluations, and invoicing."

**Result:** 
- Created base React application with 7 pipeline stages
- Implemented training CRUD operations
- Built analytics dashboard
- Added persistent storage

---

### User Story 1: Client Intake Form
**Prompt:**
> "As a trainer I want to create a record of a client's request so that I can track, share, and monitor the progress of training development, delivery and invoicing.
> 
> **Acceptance criteria:**
> Given: There is no client and/or engagement information in the system
> When: I create a new request
> Then I am prompted to enter the name of the client, the point of contact, their contact information, the initial topic requests, number of attendees, mode (virtual, in-person, or blended), and a date for the initial scoping call"

**Features Added:**
- Required fields for client name, contact information
- Contact name, email, and phone number fields
- Initial topic requests textarea
- Number of attendees field
- Delivery mode dropdown (Virtual, In-Person, Blended)
- Initial scoping call date picker
- Form validation with required field indicators

<details>
<summary>📸 View Client Intake Form Screenshot</summary>

![Client Intake Form](./screenshots/client-intake-form.png)
*Add screenshot of the New Client Request modal*

</details>

---

### User Story 2: Scoping Call Recording
**Prompt:**
> "As a training manager I want to record results from a scoping call so that course writers and trainers can see and refer back to sponsors requests.
> 
> **Given:**
> - There is an existing training request in the system.
> - I have conducted or am conducting a scoping call with the client.
> 
> **When:**
> - I select "Record Scoping Call" from the training request dashboard or details page.
> 
> **Then:**
> I am presented with a fillable scoping call form that includes the following fields:
> - Attendee Roles: (e.g., Executives, Managers, Analysts, etc.)
> - Training Objectives: "At the end of the course, participants should be able to…" (Free-text)
> - Delivery Mode: (Dropdown – Virtual, On-site, Hybrid)
> - Duration: (e.g., 2 days, 3 hours)
> - Preferred Time Window for Delivery: (e.g., Q1 2025, next month, specific dates)
> - Number of Participants (Estimated)
> - Special Requirements / Constraints: (optional)
> - Notes / Additional Context: (free text)"

**Features Added:**
- "Record Scoping Call" button with FileText icon in actions column
- Comprehensive scoping call form with all required fields
- Scoping status indicator (Completed/Not recorded)
- Scoping call results displayed in training details view
- Purpose statement to guide form completion

<details>
<summary>📸 View Scoping Call Screenshots</summary>

### Scoping Call Form
![Scoping Call Form](./screenshots/scoping-call-form.png)
*Add screenshot of the Record Scoping Call modal*

### Scoping Status Indicator
![Scoping Status](./screenshots/scoping-status-indicator.png)
*Add screenshot showing the scoping status in the table*

</details>

---

### User Story 3: Theme Toggle
**Prompt:**
> "Could you create an option to switch between light and dark themes?"

**Features Added:**
- Theme toggle button in header (Sun/Moon icons)
- Complete dark mode styling for all components
- Persistent theme preference saved to storage
- Smooth color transitions between themes
- Accessible color contrast in both modes

<details>
<summary>📸 View Theme Screenshots</summary>

### Dark Mode
![Dark Mode](./screenshots/dark-mode-full.png)
*Add screenshot of the application in dark mode*

</details>

---

### User Story 4: Coordination Call Recording
**Prompt:**
> "As a training manager, I want to log coordination calls so I can capture additional client instructions, updates, or changes to the training plan.
> 
> **Acceptance Criteria:**
> 
> **Given:**
> - There is a training request in the system.
> - A scoping call has been completed for this request.
> - I have had or am about to have a follow-up coordination call with the client.
> 
> **When:**
> - I click the "Record Coordination Call" action on a training request with a completed scoping call.
> 
> **Then:**
> I am presented with a Coordination Call form with the following fields:
> - **Call Date** (Date picker) *
> - **Call Time** (Time picker) *
> - **Attendees and Roles** (e.g., "Sarah Johnson (Client), Mike Chen (Trainer)") *
> - **Purpose of Call** (Dropdown: Logistics Update, Additional Content Requests, Instructor Confirmation, Participant Confirmation, Schedule Changes, Materials Review, General Coordination, Other) *
> - **Summary of Discussion Points** (Free-text, multi-line) *
> - **New or Updated Training Objectives** (Free-text, multi-line, optional)
> - **Additional Materials Requested** (Free-text, multi-line, optional)
> - **Changes to Delivery Mode, Dates, or Duration** (Free-text, multi-line, optional)
> - **Follow-Up Actions and Responsible Parties** (Free-text, multi-line) * (Example: "• Update participant list - Sarah - 3/15/2025")
> - **Notes / Client Instructions** (Free-text, optional)
> 
> **And:**
> - The coordination call is saved and associated with the training request.
> - Multiple coordination calls can be logged per request.
> - A visual indicator (e.g., counter or icon) on the training request shows how many coordination calls have been logged.
> - In the detailed view of a training request, I can see all coordination calls in chronological order.
> - The coordination call action is only enabled after a scoping call is completed."

**Features Added:**
- "Record Coordination Call" button with MessageSquare icon in actions column
- Button is disabled until scoping call is completed (with tooltip)
- Comprehensive coordination call form with all required fields
- Call purpose dropdown with predefined options
- Follow-up actions field with formatting guidance
- Multiple coordination calls can be logged per training
- Counter in pipeline table showing number of coordination calls
- Visual indicator (blue badge) for coordination calls
- Chronological display of all coordination calls in training details view
- Color-coded display (blue theme) to distinguish from scoping calls
- Purpose statement banner explaining the feature

<details>
<summary>📸 View Coordination Call Screenshots</summary>

### Coordination Call Form
![Coordination Call Form](./screenshots/coordination-call-form.png)
*Add screenshot of the Record Coordination Call modal*

### Coordination Call Indicator
![Coordination Call Indicator](./screenshots/coordination-call-indicator.png)
*Add screenshot showing the coordination call counter in the pipeline table*

### Coordination Call History
![Coordination Call History](./screenshots/coordination-call-history.png)
*Add screenshot showing multiple coordination calls in the training details view*

</details>

---

### User Story 5: Email Communication Logging
**Prompt:**
> "As a training manager, I want to log email communications so that I can maintain a complete history of all project-related correspondence for context, accountability, and transparency.
> 
> **Acceptance Criteria:**
> 
> **Given:**
> - There is a training request in the system.
> - I have sent or received an email related to this training.
> 
> **When:**
> - I click "Add Email Communication" from the training request actions.
> 
> **Then:**
> I am presented with an Email Communication form with the following fields:
> - **Sender Name** (Text field) *
> - **Sender Email** (Email field) *
> - **Recipient(s)** (Text field, comma-separated) *
> - **Subject Line** (Text field) *
> - **Email Body** (Large text area, multi-line) *
> - **Attachments** (Text field for listing attachment filenames, comma-separated, optional)
> - **Timestamp** (Auto-populated with current date/time)
> 
> **And:**
> - The email communication is saved and associated with the training request.
> - Multiple emails can be logged per request.
> - A visual indicator (e.g., counter or icon) shows how many emails have been logged.
> - In the detailed view, I can see all emails in chronological order.
> - Email bodies preserve basic formatting (line breaks)."

**Features Added:**
- "Add Email Communication" button with Inbox icon in actions column
- Comprehensive email logging form with all required fields
- Sender information fields (name and email)
- Recipients field supporting multiple email addresses
- Subject line field
- Large text area for email body (preserves formatting with monospace font)
- Attachments field for listing filenames (note: actual files not uploaded)
- Automatic timestamp on save
- Multiple emails can be logged per training
- Counter in pipeline table showing number of emails logged
- Visual indicator (purple badge) for email communications
- Chronological display of all emails in training details view
- Color-coded display (purple theme) to distinguish from calls
- Purpose statement banner explaining the feature
- Expandable email body view with proper formatting

<details>
<summary>📸 View Email Communication Screenshots</summary>

### Email Communication Form
![Email Communication Form](./screenshots/email-communication-form.png)
*Add screenshot of the Add Email Communication modal*

### Email Indicator
![Email Indicator](./screenshots/email-indicator.png)
*Add screenshot showing the email counter in the pipeline table*

### Email History Display
![Email History](./screenshots/email-history-view.png)
*Add screenshot showing multiple emails in the training details view*

</details>

---

### User Story 6: Proposal Document Management
**Prompt:**
> "As a training manager, I want to upload or link to proposal documents so that all stakeholders can access the most recent proposal and see the version history.
> 
> **Acceptance Criteria:**
> 
> **Given:**
> - There is a training request in the system.
> - I have a proposal document ready to share (either as a file or as a link).
> 
> **When:**
> - I navigate to the "Documents" tab or click "Add Proposal" from the training request actions.
> 
> **Then:**
> I am presented with a Proposal Document form with the following options and fields:
> 
> **Upload Method Selection:**
> - Option 1: **Paste Link** (for SharePoint, Google Drive, Dropbox, Box, etc.)
> - Option 2: **Upload File** (PDF, DOCX, PPTX - max 10MB)
> 
> **If Paste Link is selected:**
> - **Document Link** (URL field, validated for common cloud storage domains) *
> 
> **If Upload File is selected:**
> - **File Upload** (File picker with drag-and-drop support) *
> - Accepted formats: .pdf, .docx, .pptx
> - Note displayed: "In this demo, file content is not actually uploaded. Only the filename is stored."
> 
> **Common Fields:**
> - **Version Label** (Text field, e.g., "v1.0", "Draft", "Final", "2025-01-15") *
> - **Notes** (Text area, optional, for additional context about this version)
> 
> **And:**
> - When I save the proposal:
>   - The document is marked as the **current version**
>   - Any previous versions remain accessible but are no longer marked as current
>   - The system records: upload date, uploaded by (user), filename/link
> - A "Documents" tab shows all proposal documents across all trainings
> - Each training's proposal section displays:
>   - All versions in reverse chronological order
>   - Clear indication of which is the current version
>   - Version label, upload date, uploader, and notes
>   - Link to open (if cloud link) or download (if file)
> - Multiple versions can exist, but only one is marked "Current" at a time
> - Visual indicator shows which trainings have proposals uploaded"

**Features Added:**
- **New "Documents" Tab** in main navigation
- **"Add Proposal" button** with Upload icon
- **Dual Upload Method Selection:**
  - Paste Link option with URL validation for cloud storage (SharePoint, Google Drive, Dropbox, Box)
  - Upload File option with drag-and-drop interface (PDF, DOCX, PPTX)
- **Version Control System:**
  - Version label field (required)
  - Notes field (optional)
  - Automatic marking of current version (only one active at a time)
  - Upload timestamp and user tracking
  - All historical versions remain accessible
- **Documents Tab Display:**
  - Grouped by training engagement
  - All proposal versions shown in reverse chronological order
  - Current version badge (green)
  - File information (name, size, type for uploads)
  - External link icon for cloud storage links
  - Add new version button per training
- **File Upload Features:**
  - File type validation (PDF, DOCX, PPTX only)
  - File size limit (10MB)
  - Visual file preview after selection
  - Note: Demo only stores filename, not actual file content
- **URL Validation:**
  - Checks for valid URL format
  - Validates against approved cloud storage domains
  - Warning message for invalid URLs
- **Visual Indicators:**
  - Purpose statement banner explaining version control
  - Info banner explaining current version marking
  - Color-coded proposal cards (green theme)
  - Icon differentiation (File icon vs External Link icon)

<details>
<summary>📸 View Proposal Document Screenshots</summary>

### Proposal Upload Modal - Link Option
![Proposal Link Upload](./screenshots/proposal-link-upload.png)
*Add screenshot of the proposal modal with link paste option selected*

### Proposal Upload Modal - File Option
![Proposal File Upload](./screenshots/proposal-file-upload.png)
*Add screenshot of the proposal modal with file upload option selected*

### Documents Tab View
![Documents Tab](./screenshots/documents-tab-view.png)
*Add screenshot of the Documents tab showing multiple proposals with version history*

### Proposal Version History
![Proposal Versions](./screenshots/proposal-versions.png)
*Add screenshot showing multiple versions of a proposal with current version highlighted*

</details>

---

## 🚀 Features

### Core Functionality
- **Pipeline Management**: Track trainings through 7 stages (Intake → Proposal → Curriculum Dev → Delivery → Evaluation → Invoicing → Completed)
- **Client Intake**: Capture detailed client and training request information
- **Scoping Call Recording**: Document requirements from client scoping calls
- **Coordination Call Tracking**: Log follow-up calls with clients to capture updates and changes
- **Email Communication Logging**: Maintain complete email correspondence history
- **Proposal Document Management**: Version-controlled proposal documents with cloud storage integration
- **Search & Filter**: Find trainings by client name, contact, or training title
- **Stage-based Views**: Filter trainings by pipeline stage
- **Analytics Dashboard**: View total pipeline value, active requests, and completed trainings

### User Interface
- **Light/Dark Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Works on desktop and mobile devices
- **Modal Forms**: Clean, organized forms for data entry
- **Visual Indicators**: Color-coded stage badges and status icons
- **Action Buttons**: Quick access to view, edit, record, and delete operations
- **Tabbed Navigation**: Pipeline, Documents, and Analytics views

### Data Management
- **Persistent Storage**: All data saved automatically using browser storage
- **CRUD Operations**: Create, read, update, and delete training records
- **Data Validation**: Required field validation on forms
- **Timestamps**: Automatic tracking of creation and update times
- **Version Control**: Proposal documents with version tracking

### Communication History
- **Chronological Timeline**: All communications displayed in order
- **Color-Coded Events**: 
  - Purple for emails
  - Blue for coordination calls
  - Green for scoping calls
- **Complete Context**: Full email bodies, call summaries, and notes preserved
- **Visual Indicators**: Badges showing number of each communication type

## 🛠️ Technologies

- **React 19.2** - UI framework
- **Vite 7.2** - Build tool and development server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Browser Storage API** - Data persistence (with localStorage fallback)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/blpearson26/TrainPipeline-Claude.git

# Navigate to project directory
cd TrainPipeline-Claude

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Project Structure

```
training-management-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── src/
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind imports
├── public/
├── screenshots/                # Application screenshots
├── vite.config.js              # Vite configuration
├── package.json
└── README.md
```

## 📊 Data Model

### Training Request Object
```javascript
{
  id: "TR1234567890",
  clientName: "Acme Corporation",
  contactName: "John Smith",
  contactEmail: "john@acme.com",
  contactPhone: "(555) 123-4567",
  title: "AI Fundamentals for Product Teams",
  topicRequests: "Machine learning, AI ethics, practical applications",
  attendees: 25,
  deliveryMode: "Hybrid",
  scopingCallDate: "2025-02-01",
  stage: "intake",
  value: 50000,
  deliveryDate: "2025-03-15",
  
  // Scoping Call
  scopingCallCompleted: true,
  scopingCall: {
    attendeeRoles: "Product Managers, Engineers, Executives",
    trainingObjectives: "Participants will be able to...",
    deliveryMode: "Hybrid",
    duration: "2 days",
    preferredTimeWindow: "Q1 2025",
    numberOfParticipants: 25,
    specialRequirements: "Projector, breakout rooms",
    notes: "Client prefers morning sessions",
    completedDate: "2025-01-20"
  },
  
  // Coordination Calls (Multiple)
  coordinationCalls: [
    {
      id: "CC001",
      callDate: "2025-02-20",
      callTime: "14:00",
      attendeesAndRoles: "Sarah Johnson (Client), Mike Chen (Trainer)",
      callPurpose: "Logistics Update",
      discussionSummary: "Confirmed room setup and technical requirements",
      updatedObjectives: "Added focus on generative AI tools",
      additionalMaterials: "Client requested fintech case studies",
      deliveryChanges: "Changed start time from 9am to 8:30am",
      followUpActions: "• Send agenda - Mike - 2/25\n• Prepare case studies - Lisa - 3/1",
      notes: "Client mentioned potential follow-up course"
    }
  ],
  
  // Email Communications (Multiple)
  emailCommunications: [
    {
      id: "EM001",
      timestamp: "2025-02-12T09:30:00Z",
      senderName: "Sarah Johnson",
      senderEmail: "sarah@techcorp.com",
      recipients: "training@company.com",
      subject: "Initial Training Request - AI Fundamentals",
      body: "Full email body text...",
      attachments: ["proposal_draft.pdf", "requirements.docx"]
    }
  ],
  
  // Proposal Documents (Multiple Versions)
  proposalDocuments: [
    {
      id: "PR001",
      fileName: "AI_Training_Proposal_v2.pdf", // or null if link
      linkUrl: null, // or "https://sharepoint.com/..." if link
      versionLabel: "v2.0 - Final",
      notes: "Updated pricing and added case studies",
      isCurrent: true,
      uploadedAt: "2025-02-15T10:00:00Z",
      uploadedBy: "Current User"
    },
    {
      id: "PR002",
      fileName: null,
      linkUrl: "https://sharepoint.com/proposals/v1",
      versionLabel: "v1.0 - Draft",
      notes: "Initial proposal draft",
      isCurrent: false,
      uploadedAt: "2025-02-10T14:30:00Z",
      uploadedBy: "Current User"
    }
  ],
  
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-02-20T14:45:00Z"
}
```

## 🎯 Pipeline Stages

1. **Intake** - Initial client request captured
2. **Proposal** - Training proposal being developed
3. **Curriculum Dev** - Course content being created
4. **Delivery** - Training is being delivered
5. **Evaluation** - Post-training assessment
6. **Invoicing** - Billing and payment processing
7. **Completed** - Training engagement finished

## 🔐 Storage

The application uses a storage adapter that works in both environments:
- **Claude Artifacts**: Uses `window.storage` API
- **Browser/Production**: Falls back to `localStorage`

All data is stored with keys prefixed by `training:` for easy organization.

## 🚀 Deployment

The application automatically deploys to GitHub Pages via GitHub Actions on every push to the main branch.

**Live URL:** `https://blpearson26.github.io/TrainPipeline-Claude/`

### Deployment Configuration
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Build output: `dist/`
- Base URL configured in `vite.config.js`

## 📝 Usage Examples

### Creating a New Client Request
1. Click "New Request" button in the header
2. Fill in all required fields marked with asterisks (*)
3. Click "Create Request"

### Recording a Scoping Call
1. Find the training request in the pipeline table
2. Click the FileText icon (Record Scoping Call)
3. Fill in the scoping call form
4. Click "Save Scoping Call"

### Recording a Coordination Call
1. Ensure scoping call is completed first
2. Click the MessageSquare icon (Record Coordination Call)
3. Select call purpose and fill in details
4. Document discussion, updates, and follow-up actions
5. Click "Save Coordination Call"

### Logging Email Communications
1. Click the Inbox icon on any training
2. Enter sender information and recipients
3. Add subject line and paste full email body
4. List any attachments (filenames only)
5. Click "Add Email to Record"

### Adding Proposal Documents
1. Navigate to "Documents" tab or click Upload icon
2. Choose upload method: Link or File
3. **If using Link:**
   - Paste cloud storage URL (SharePoint, Google Drive, etc.)
4. **If using File:**
   - Select PDF, DOCX, or PPTX file (max 10MB)
   - Note: Demo only stores filename
5. Enter version label (e.g., "v1.0", "Final Draft")
6. Add optional notes about this version
7. Click "Add Proposal Document"
8. Document is automatically marked as current version

### Viewing Communication History
1. Click the Eye icon on any training with communications
2. View complete chronological timeline:
   - 📧 Purple cards = Email communications
   - 💬 Blue cards = Coordination calls  
   - 📄 Green cards = Scoping call
3. All details preserved including timestamps

### Viewing Proposal Versions
1. Navigate to "Documents" tab
2. Find your training engagement
3. View all versions with:
   - Green "Current" badge on active version
   - Version labels and upload dates
   - Notes for each version
4. Click external link icon to open cloud storage links
5. Click Upload icon to add new version

### Switching Themes
1. Click the Sun/Moon icon in the header
2. Theme switches immediately and preference is saved

## 🤝 Contributing

This project was developed through iterative collaboration with Claude AI. Each feature was implemented based on specific user stories and acceptance criteria.

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with guidance from Claude (Anthropic)
- Developed iteratively through conversation-driven development
- User stories and requirements provided by training management team

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Note:** This application demonstrates the power of AI-assisted development, where features are built incrementally through natural language conversation and user story refinement.