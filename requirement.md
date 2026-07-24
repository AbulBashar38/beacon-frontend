# AI & API Hackathon 2026 — Project Requirements

## 1. Hackathon Information

- **Event:** AI & API Hackathon 2026
- **Edition:** First Edition
- **Round:** Final Round
- **Organizer:** IEEE Computer Society Southeast University Student Branch Chapter
- **Project Type:** Functional, web-based, AI-powered civic infrastructure reporting platform

## 2. Background

Public infrastructure issues such as potholes, broken streetlights, water pipeline leaks, illegal waste dumping, and similar problems often remain unresolved because the existing reporting process is fragmented and inefficient.

Citizens may report the same issue through social media, phone calls, email, or local government offices. These reports may contain incomplete descriptions, unclear locations, duplicate submissions, or insufficient supporting information. Government departments must then manually review, categorize, prioritize, and forward these reports before action can begin.

The required solution should create a single digital platform that connects citizens and government officials. It should transform unstructured citizen reports into structured and actionable information, support faster decision-making, and allow each issue to be tracked from initial submission to final resolution.

## 3. Problem Statement

Build a full-stack, AI-powered web platform that enables citizens to report public infrastructure issues and provides government authorities with the tools required to review, prioritize, manage, assign, monitor, and resolve those reports.

The platform must not function only as a complaint collection system. It should assist government decision-makers by:

- Analyzing submitted reports
- Structuring unorganized information
- Categorizing infrastructure issues
- Estimating issue severity
- Identifying possible duplicate reports
- Supporting prioritization
- Tracking progress and resolution status
- Presenting useful operational information

## 4. Primary User Experiences

### 4.1 Citizen Portal

The Citizen Portal should allow members of the public to:

- Submit infrastructure issue reports
- Provide issue details
- Provide the issue location
- Provide optional contact information
- Upload optional photo or URL evidence
- Receive a unique report ID
- Receive a public tracking code
- Track the progress of submitted reports
- View the assigned department
- View public progress updates
- View the report status history

### 4.2 Government Management Portal

The Government Management Portal should allow authorized officials to:

- View all submitted reports
- Review AI-generated analysis
- Search for reports
- Filter reports
- Prioritize reports
- Assign reports to responsible departments
- Update report status
- Add progress notes
- Monitor report lifecycle
- View operational analytics
- Manage issue resolution

## 5. Core Components

### 5.1 Citizen Reporting Portal

A user-friendly interface for citizens to:

- Report infrastructure issues
- Provide relevant details
- Provide location information
- Upload optional supporting evidence
- Receive a unique tracking code

### 5.2 Government Management Dashboard

A secure dashboard for government officials to:

- Review reports
- Manage report lifecycle
- Assign responsible departments
- Update report progress
- Monitor platform activity

### 5.3 AI-Powered Report Analysis

The system should analyze submitted reports and generate:

- Issue category
- Concise structured summary
- Confidence score
- Severity assessment
- Meaningful insights for government officials

### 5.4 Duplicate Detection System

The system should identify possible duplicate reports using suitable similarity factors while preserving every submitted report.

Potential duplicate reports should remain accessible and should be linked to a primary report instead of being deleted or blocked.

### 5.5 Progress Tracking System

Citizens should be able to track a report using its public tracking code and view:

- Current status
- Progress history
- Assigned department
- Public updates
- Submission date
- AI-generated summary
- AI category
- Severity level

### 5.6 Persistent Data Storage

The application should persistently store:

- Citizen reports
- AI-generated outputs
- Status history
- Progress logs
- Department assignments
- Duplicate links
- System metadata
- Other required application data

### 5.7 External Service Integration

The solution must meaningfully integrate at least one external service, such as:

- AI service
- Mapping or geocoding service
- Cloud storage service
- Notification service
- SMS or email service
- Environmental data service

Passive or trivial API calls are not considered meaningful integrations.

### 5.8 Responsive User Experience

The application should provide a modern, intuitive, and responsive experience that works across different devices and screen sizes.

## 6. Functional Requirements

### Module 1 — Citizen Report Submission

The system must provide a citizen-facing report submission interface.

#### Required submission information

- Issue description
- Issue location

#### Optional submission information

- Contact details
- Photo evidence
- URL evidence

#### Submission output

After successful submission, the system must generate:

- A unique report ID
- A public tracking code

#### Supported issue categories

The system should support categories such as:

- Pothole
- Broken Streetlight
- Water Leak
- Illegal Dumping
- Other

Citizens may select a category, but the AI system should generate or validate the final category.

### Module 2 — AI Report Analysis

Every report must be processed by AI before storage or official review.

The AI analysis should:

- Analyze the issue description
- Generate or validate the issue category
- Produce a concise summary
- Assign a confidence score
- Return validated and structured report information

### Module 3 — Severity Assessment

The system should estimate report priority based on factors such as:

- Public safety risk
- Service impact
- Scale of the issue
- Immediate danger
- Proximity to schools
- Proximity to hospitals
- Proximity to main roads
- Other sensitive locations

The severity assessment should generate:

- Severity level
- Severity score
- Brief explanation or rationale

### Module 4 — Duplicate Detection

The system should detect potentially duplicate reports without preventing new submissions.

Duplicate detection may compare:

- Location or coordinates
- AI-generated category
- Semantic similarity of descriptions
- Submission time
- Optional image similarity

Potential duplicates should:

- Remain accessible
- Be linked to the primary report
- Not be automatically deleted

### Module 5 — Government Management Dashboard

The dashboard must allow authorized officials to:

- View all reports
- Review AI analysis
- Search by keyword
- Search by location
- Search by report ID
- Search by tracking code
- Filter by category
- Filter by severity
- Filter by status
- Filter by department
- Assign reports to departments
- Update status
- Add progress notes
- View operational analytics

### Module 6 — Public Progress Tracking

Citizens must be able to track reports using a public tracking code.

The tracking view should display:

- Report summary
- AI-generated category
- Severity level
- Current status
- Assigned department
- Submission date
- Progress history
- Public updates

The public tracking view must exclude sensitive personal information.

### Module 7 — Data Management and External Integrations

The system must:

- Use persistent data storage
- Store reports
- Store AI analysis
- Store progress history
- Store department assignments
- Store duplicate links
- Store relevant metadata
- Meaningfully integrate at least one external service

## 7. Minimum Required Screens

The completed application must include at least the following screens:

### 7.1 Citizen Report Submission

Purpose:

- Submit a new infrastructure issue report

### 7.2 Submission Success Page

Purpose:

- Confirm successful submission
- Display the generated report ID
- Display the public tracking code

### 7.3 Public Tracking Page

Purpose:

- Track report progress using the public tracking code

### 7.4 Government Dashboard

Purpose:

- Review reports
- Manage reports
- Monitor platform activity

### 7.5 Report Details and Management

Purpose:

- View complete report information
- Review AI-generated output
- Update the report lifecycle
- Assign responsibility
- Add progress updates

## 8. Technical Expectations

### 8.1 Architecture

The system should have a clear and maintainable frontend and backend architecture with proper separation of concerns.

### 8.2 Input Validation

User input must be validated on both client and server sides to preserve data integrity.

### 8.3 Database

Application data must be stored in a persistent database.

In-memory storage alone will not receive full marks.

### 8.4 API Design

The system should provide:

- Clean API structure
- Consistent response formats
- Appropriate HTTP status codes
- Clear success and error responses

### 8.5 AI Integration

AI must provide meaningful value to the platform and must not be used only as a superficial or isolated feature.

### 8.6 Error Handling

The system should gracefully handle:

- Validation failures
- External API failures
- AI processing failures
- Database errors
- Unexpected system errors

### 8.7 Security

The system should:

- Protect sensitive information
- Securely manage API keys
- Securely manage secrets
- Protect environment variables

### 8.8 User Experience

The application should provide:

- Responsive layouts
- Loading indicators
- Informative success messages
- Informative error messages
- Clear user feedback

### 8.9 Code Quality

The codebase should be:

- Clean
- Modular
- Readable
- Maintainable
- Properly documented where necessary

## 9. Constraints

- The solution must be developed during the on-site hackathon.
- The application must be a functional web-based product.
- Core application logic must be developed by the participating team.
- AI-assisted development tools are permitted.
- Third-party libraries and APIs may be used.
- Third-party tools and services must be properly credited in project documentation.
- The application must remain functional even if optional features are not implemented.
- Pre-written source code is not permitted.
- Completed projects are not permitted.
- Reusable project templates are not permitted.
- The project must be developed entirely during the official hackathon period.
- The final architecture, implementation, business logic, and engineering decisions must represent the team’s own work.

## 10. Evaluation Criteria

| Evaluation Area | Marks |
|---|---:|
| Citizen Reporting Experience | 10 |
| Government Dashboard and Report Management | 15 |
| Progress Tracking and Status History | 15 |
| AI Categorization and Structured Output | 15 |
| Severity Scoring Quality and Explainability | 10 |
| Duplicate Detection Approach | 15 |
| Database Design, Validation, and Error Handling | 10 |
| UI/UX Quality and Responsiveness | 5 |
| Code Quality and Documentation | 5 |
| **Total** | **100** |

## 11. Bonus Features

Bonus features will only be considered after the core requirements have been successfully implemented.

Possible bonus features include:

- Interactive map-based issue visualization
- Publicly accessible live deployment
- Image-based issue analysis using AI
- Real-time dashboard updates
- Bangla and English multilingual support
- Smart department recommendation
- AI-generated resolution suggestions
- Push notifications
- Email updates
- SMS updates
- Offline-first experience
- Progressive Web Application support
- Predictive analytics
- Real-time collaboration
- Geospatial visualization
- Other innovative features with real-world value

Additional features cannot compensate for missing mandatory functionality.

## 12. Judging Considerations

In addition to the allocated marks, judges may consider:

- Completeness of the solution
- Real-world applicability
- Creativity
- Innovation
- Quality of AI integration
- Software architecture
- Engineering practices
- Demonstration quality
- Presentation quality
- Team understanding of implementation decisions
- Team understanding of design decisions
- Team understanding of technical trade-offs

## 13. Tie-Breaking Considerations

If multiple teams receive the same score, the judges may consider:

- Quality and effectiveness of AI integration
- Overall system architecture
- Code quality
- Maintainability
- Innovation beyond minimum requirements
- Live demonstration quality
- Judges’ question-and-answer performance

## 14. Hackathon Rules

### 14.1 Project Repository

A new public GitHub repository must be created during the on-site hackathon.

### 14.2 Pre-Written Code

The following are not permitted:

- Pre-written source code
- Completed projects
- Reusable project templates

### 14.3 Development Period

The entire project must be developed during the official hackathon period.

### 14.4 AI-Assisted Development

AI-assisted development tools are permitted, including tools similar to:

- ChatGPT
- Claude
- GitHub Copilot
- Gemini
- Puku
- Other comparable tools

### 14.5 Open-Source Software

Teams may use:

- Open-source frameworks
- Open-source libraries
- APIs
- SDKs
- Publicly available resources

Proper attribution must be included in the project README where applicable.

### 14.6 Original Work

The application’s architecture, implementation, business logic, and engineering work must represent the participating team’s own effort.

## 15. Required Submission Deliverables

Each team must submit the following before the submission deadline:

- Public GitHub repository
- README documentation
- Project description

## 16. Recommended Optional Deliverables

The following are not mandatory but may improve project presentation and evaluation:

- Live deployment
- API documentation
- Database schema
- Entity-relationship diagram
- Testing notes
- Setup guide
- Installation guide
- Architecture diagram
- Demo video
- Presentation slides

## 17. Important Notes

- Judges may ask technical questions about any part of the submitted project.
- Teams should be prepared to explain the complete system architecture.
- Teams should be prepared to explain the AI workflow.
- Teams should be prepared to explain implementation decisions.
- Teams should be prepared to justify technology choices.
- Third-party services, APIs, datasets, models, and libraries must be acknowledged.
- Failure to comply with the rules may result in score deductions.
- Serious rule violations may result in disqualification.
- The judges’ decision is final.

## 18. Project Success Objective

The final solution should demonstrate:

- Technical excellence
- Meaningful AI integration
- Real-world civic impact
- Effective citizen reporting
- Efficient government issue management
- Structured and actionable report information
- Clear progress tracking
- Faster and more informed decision-making
