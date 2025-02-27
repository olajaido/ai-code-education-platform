# AI-Powered Code Education Platform

An interactive learning platform that helps users master programming through AI-enhanced coding challenges. Built for the Azure AI Developer Hackathon.

## 🧠 Project Overview

The AI-Powered Code Education Platform combines modern web technologies with Azure AI services to create an intelligent learning environment that provides personalized guidance and real-time feedback to coding students.

By leveraging Azure OpenAI Service and serverless computing, the platform offers:

- Interactive coding challenges with incremental difficulty
- AI-powered hints and explanations when users get stuck
- Real-time code execution and feedback
- Personalized learning paths based on user performance

## 🏗️ Architecture

The application follows a three-tier architecture with clear separation of concerns:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│    React    │────▶│   Express   │────▶│    Azure    │────▶│    Azure    │
│  Frontend   │     │     API     │     │  Functions  │     │ OpenAI/AI   │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

- **React Frontend**: Responsive single-page application with embedded code editor
- **Express API**: Node.js backend that manages application logic and routing
- **Azure Functions**: Serverless compute for code execution and AI processing
- **Azure OpenAI**: AI services for code analysis and educational hints

## ✨ Features

### For Learners

- **Interactive Code Editor**: Professional coding environment powered by Monaco Editor
- **AI Assistance**: Get personalized hints and explanations when stuck
- **Instant Feedback**: Execute code and receive immediate results
- **Progressive Learning**: Advance through challenges of increasing difficulty

### Technical Highlights

- **Secure Code Execution**: Sandboxed environment for safe code evaluation
- **Multi-Modal AI Integration**: Combines code analysis with natural language understanding
- **Responsive Design**: Works seamlessly across devices
- **Real-time Processing**: Immediate feedback for an engaging learning experience

## 🔧 Technologies Used

### Frontend
- React.js
- Monaco Editor for code editing
- React Router for navigation
- Axios for API communication

### Backend
- Node.js with Express
- RESTful API architecture
- Azure SDK integration

### Cloud Services
- Azure Functions for serverless computing
- Azure OpenAI Service for AI capabilities
- Azure App Service for hosting

### Development Tools
- GitHub for version control
- GitHub Copilot for AI-assisted development
- VS Code as primary IDE

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v16+)
- Azure subscription
- GitHub account with Copilot access

### Local Development

1. **Clone the repository**

   git clone https://github.com/olajaido/ai-code-education-platform.git
   cd ai-code-education-platform
   

2. **Set up the client**
   
   cd client
   npm install
   

3. **Set up the API**

   cd ../api
   npm install
   

4. **Set up Azure Functions**
   
   cd ../functions
   npm install
   

5. **Configure environment variables**
   Create a `.env` file in the API directory and a `local.settings.json` file in the Functions directory with your Azure configuration.

6. **Start development servers**
   
   # Terminal 1 (API)
   cd api
   npm start

   # Terminal 2 (Client)
   cd client
   npm start

   # Terminal 3 (Functions)
   cd functions
   func start


## 🔍 Azure AI Integration

The platform effectively demonstrates multi-modal AI capabilities through:

1. **Code Analysis**: Azure OpenAI interprets code structure and patterns
2. **Natural Language Guidance**: AI provides educational hints in clear, helpful language
3. **Pattern Recognition**: System identifies common coding mistakes and offers targeted assistance

Azure OpenAI (gpt-35-turbo-16k model) powers the AI components, delivering context-aware responses that guide users without solving challenges for them.

## 🛠️ GitHub Copilot Usage

GitHub Copilot accelerated development across the entire application:

- Generated React component templates and logic
- Suggested Azure Functions integration code
- Implemented robust error handling patterns
- Created testing frameworks and scenarios
- Assisted with complex API integrations

The synergy between Copilot and developer expertise resulted in higher quality code produced in less time.

## 🏆 Hackathon Categories

This project addresses the following Azure AI Developer Hackathon categories:

### Best Use of GitHub Copilot
Demonstrates how Copilot accelerates development and improves code quality across frontend, backend, and cloud integration.

### Best Azure App Integration
Showcases thoughtful architecture that leverages Azure services for a scalable, secure learning platform.

### Best Use of Azure AI
Implements multi-modal AI (text and code) to enhance the educational experience with context-aware assistance.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Microsoft Azure for providing the AI and cloud infrastructure
- GitHub Copilot for assisting in the development process
- Monaco Editor for the code editing component
- The organizers of the Azure AI Developer Hackathon

---

*Created for the Azure AI Developer Hackathon, 2025*