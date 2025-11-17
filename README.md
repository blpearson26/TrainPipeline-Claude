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

![Client Intake Form](./screenshots/client-intake-form.png)
*Add screenshot of the New Client Request modal*

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

![Scoping Call Form](./screenshots/scoping-call-form.png)
*Add screenshot of the Record Scoping Call modal*

![Scoping Status](./screenshots/scoping-status-indicator.png)
*Add screenshot showing the scoping status in the table*

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

![Dark Mode](./screenshots/dark-mode-full.png)
*Add screenshot of the application in dark mode*

---

## 🚀 Features

### Core Functionality
- **Pipeline Management**: Track trainings through 7 stages (Intake → Proposal → Curriculum Dev → Delivery → Evaluation → Invoicing → Completed)
- **Client Intake**: Capture detailed client and training request information
- **Scoping Call Recording**: Document requirements from client scoping calls
- **Search & Filter**: Find trainings by client name, contact, or training title
- **Stage-based Views**: Filter trainings by pipeline stage
- **Analytics Dashboard**: View total pipeline value, active requests, and completed trainings

### User Interface
- **Light/Dark Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Works on desktop and mobile devices
- **Modal Forms**: Clean, organized forms for data entry
- **Visual Indicators**: Color-coded stage badges and status icons
- **Action Buttons**: Quick access to view, edit, record, and delete operations

### Data Management
- **Persistent Storage**: All data saved automatically using browser storage
- **CRUD Operations**: Create, read, update, and delete training records
- **Data Validation**: Required field validation on forms
- **Timestamps**: Automatic tracking of creation and update times

## 🛠️ Technologies

- **React** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
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
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-01-20T14:45:00Z"
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

### Viewing Scoping Call Results
1. Click the Eye icon on any training with completed scoping call
2. Scroll to "Scoping Call Results" section
3. Review all captured information

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