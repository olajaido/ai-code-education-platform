# AI Code Education Platform Architecture

## Overview

The AI Code Education Platform follows a modern, cloud-native architecture that separates concerns across multiple layers while leveraging Azure services for scalability, security, and AI capabilities. The platform enables users to learn programming through interactive challenges enhanced by artificial intelligence.

## Components

### 1. React Frontend (client/)
- **Technology**: React.js, Monaco Editor, React Router
- **Purpose**: Provides the user interface for interacting with coding challenges
- **Key Features**:
  - Interactive code editor with syntax highlighting
  - Challenge selection and navigation
  - Submission of code for evaluation
  - Display of AI-powered hints and explanations
  - User progress tracking visualization

### 2. Node.js API (api/)
- **Technology**: Express.js, Node.js
- **Purpose**: Serves as the backend for the application, handling business logic and data flow
- **Key Features**:
  - RESTful API endpoints for challenges, users, and progress
  - Authentication and authorization
  - Orchestration of requests to Azure Functions
  - Data validation and transformation

### 3. Azure Functions (functions/)
- **Technology**: Node.js, Azure Functions
- **Purpose**: Provides serverless compute for code execution and AI processing
- **Key Components**:
  - **ExecuteCode**: Safely executes user-submitted code against test cases
  - **AnalyzeCode**: Leverages Azure OpenAI to analyze code for educational insights
  - **GenerateHint**: Creates personalized learning hints based on user code

### 4. Azure OpenAI Service
- **Technology**: gpt-35-turbo-16k model
- **Purpose**: Provides AI capabilities for code analysis and educational guidance
- **Key Features**:
  - Natural language explanations of code
  - Personalized learning hints
  - Code improvement suggestions

## Data Flow

### User Interaction Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │  1  │             │  2  │             │  3  │             │
│    User     │────▶│    React    │────▶│   Express   │────▶│    Azure    │
│  Interface  │     │  Frontend   │     │     API     │     │  Functions  │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ▲                                                            │
       │                                                            │
       │               ┌─────────────┐                              │
       │               │             │                              │
       └───────────────│    Azure    │◀─────────────────────────────┘
          6            │   OpenAI    │            4
                       │             │
                       └─────────────┘
                              │
                              │ 5
                              ▼
                       ┌─────────────┐
                       │    Azure    │
                       │  Functions  │
                       │             │
                       └─────────────┘
```

### Step-by-Step Flow Description

1. **User to Frontend**:
   - User selects a coding challenge
   - User writes code in the editor
   - User requests hints or submits code for evaluation

2. **Frontend to API**:
   - Frontend sends AJAX requests to the Express API
   - Requests include user code, challenge ID, and action type (run, submit, hint)

3. **API to Azure Functions**:
   - API routes the request to the appropriate Azure Function
   - API adds necessary metadata and validation

4. **Azure Functions to Azure OpenAI** (for AI features):
   - For hints or code analysis, the Function sends the code to Azure OpenAI
   - Includes contextual information about the challenge and user's progress

5. **Azure OpenAI to Azure Functions**:
   - OpenAI returns AI-generated content (hints, explanations, analysis)
   - Function processes and formats the response

6. **Results back to User**:
   - Azure Function returns results to API
   - API sends response to Frontend
   - Frontend displays results to the user (test results, hints, explanations)

### Code Execution Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│   Browser   │────▶│    API      │────▶│ ExecuteCode │
│             │     │             │     │  Function   │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       │                                       │
       │                                       ▼
       │                               ┌─────────────┐
       │                               │ Sandboxed   │
       └───────────────────────────────│ Execution   │
                                       │ Environment │
                                       └─────────────┘
```

1. User submits code from the browser
2. API forwards code and test cases to ExecuteCode function
3. Function executes code in a sandboxed environment
4. Results are returned to the user

### AI Assistance Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│   Browser   │────▶│    API      │────▶│AnalyzeCode/ │────▶│    Azure    │
│             │     │             │     │GenerateHint │     │    OpenAI   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ▲                                                            │
       │                                                            │
       └────────────────────────────────────────────────────────────┘
```

1. User requests hints or explanations
2. API forwards request to appropriate function
3. Function calls Azure OpenAI with appropriate context
4. AI-generated content is returned to the user

## Security Considerations

1. **Code Execution**:
   - User code is executed in a sandboxed environment
   - Resource limits prevent excessive computation
   - Input validation prevents malicious code execution

2. **API Security**:
   - Input validation on all endpoints
   - CORS configuration to prevent unauthorized access
   - Rate limiting to prevent abuse

3. **Azure Service Security**:
   - Azure Functions secured with proper authentication
   - API keys stored in environment variables and secure storage
   - Least privilege access principles followed

## Scalability

1. **Frontend**:
   - Static content can be served through CDN
   - React application is optimized for performance

2. **API Layer**:
   - Horizontally scalable Express service
   - Stateless design allows for multiple instances

3. **Azure Functions**:
   - Automatically scales based on demand
   - Consumption plan optimizes for cost and performance

4. **Azure OpenAI**:
   - Managed service with built-in scaling capabilities
   - Fallback mechanisms for service unavailability

## Multi-Modal Implementation

The platform implements multiple AI modalities:

1. **Text Processing**:
   - Natural language generation for hints and explanations
   - Processing of user questions and requests

2. **Code Analysis**:
   - Structural understanding of code syntax and patterns
   - Semantic analysis of code functionality and logic

This multi-modal approach allows the AI to understand both the user's intent (through natural language) and their code implementation, providing holistic educational assistance.

## Future Architecture Enhancements

1. **Data Persistence**:
   - Integration with Azure Cosmos DB for user profiles and progress
   - Challenge metadata and analytics storage

2. **Authentication**:
   - Azure AD B2C for identity management
   - Social login integration

3. **Additional AI Modalities**:
   - Speech interface for accessibility
   - Visual diagramming of code execution

4. **Monitoring and Analytics**:
   - Application Insights for performance monitoring
   - Custom analytics for learning progress trends