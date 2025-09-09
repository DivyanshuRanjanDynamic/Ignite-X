# 🎨 PM Internship Platform - Mermaid Diagrams

## 🏗️ **System Architecture Diagram**

```mermaid
graph TB
    %% Define styles
    classDef frontend fill:#3B82F6,stroke:#1E40AF,stroke-width:2px,color:#fff
    classDef backend fill:#10B981,stroke:#047857,stroke-width:2px,color:#fff
    classDef database fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:#fff
    classDef external fill:#8B5CF6,stroke:#7C3AED,stroke-width:2px,color:#fff
    classDef user fill:#EF4444,stroke:#DC2626,stroke-width:2px,color:#fff

    %% Users
    Student[👨‍🎓 Student User]:::user
    Admin[👨‍💼 Admin User]:::user
    Recruiter[🏢 Recruiter User]:::user

    %% Frontend Layer
    subgraph Frontend["🖥️ Frontend Layer (React + Vite)"]
        StudentDash[📊 Student Dashboard]:::frontend
        AdminDash[⚙️ Admin Dashboard]:::frontend
        RecruiterDash[💼 Recruiter Dashboard]:::frontend
        AuthPages[🔐 Authentication Pages]:::frontend
        LandingPage[🏠 Landing Page]:::frontend
    end

    %% Backend Layer
    subgraph Backend["⚡ Backend Layer (Node.js + Express)"]
        AuthService[🔑 Authentication Service]:::backend
        UserAPI[👥 User Management API]:::backend
        InternshipAPI[💼 Internship API]:::backend
        ApplicationAPI[📝 Application API]:::backend
        FileAPI[📁 File Upload API]:::backend
        EmailAPI[📧 Email Service]:::backend
        AnalyticsAPI[📈 Analytics API]:::backend
    end

    %% Database Layer
    subgraph Database["🗄️ Database Layer (MongoDB + Prisma)"]
        UserDB[(👤 Users Collection)]:::database
        InternDB[(💼 Internships Collection)]:::database
        AppDB[(📝 Applications Collection)]:::database
        FileDB[(📁 Files Collection)]:::database
        AnalyticsDB[(📊 Analytics Collection)]:::database
        AuditDB[(📋 Audit Logs)]:::database
    end

    %% External Services
    subgraph External["🌐 External Services"]
        GoogleOAuth[🔍 Google OAuth]:::external
        GitHubOAuth[⚫ GitHub OAuth]:::external
        Cloudinary[☁️ Cloudinary Storage]:::external
        SMTP[📧 SMTP Email Service]:::external
        Redis[⚡ Redis Cache]:::external
        PaymentGW[💳 Payment Gateway]:::external
    end

    %% User Connections
    Student --> StudentDash
    Admin --> AdminDash
    Recruiter --> RecruiterDash
    Student --> AuthPages
    Admin --> AuthPages
    Recruiter --> AuthPages

    %% Frontend to Backend
    StudentDash --> UserAPI
    StudentDash --> InternshipAPI
    StudentDash --> ApplicationAPI
    StudentDash --> FileAPI
    
    AdminDash --> UserAPI
    AdminDash --> InternshipAPI
    AdminDash --> ApplicationAPI
    AdminDash --> AnalyticsAPI
    
    RecruiterDash --> InternshipAPI
    RecruiterDash --> ApplicationAPI
    RecruiterDash --> UserAPI
    
    AuthPages --> AuthService

    %% Backend to Database
    AuthService --> UserDB
    UserAPI --> UserDB
    InternshipAPI --> InternDB
    ApplicationAPI --> AppDB
    FileAPI --> FileDB
    EmailAPI --> AuditDB
    AnalyticsAPI --> AnalyticsDB

    %% Backend to External Services
    AuthService --> GoogleOAuth
    AuthService --> GitHubOAuth
    AuthService --> Redis
    FileAPI --> Cloudinary
    EmailAPI --> SMTP
    UserAPI --> Redis
    InternshipAPI --> PaymentGW
```

## 🎯 **User Journey Flow Diagram**

```mermaid
graph LR
    %% Define styles
    classDef start fill:#22C55E,stroke:#16A34A,stroke-width:2px,color:#fff
    classDef process fill:#3B82F6,stroke:#1E40AF,stroke-width:2px,color:#fff
    classDef decision fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:#fff
    classDef end fill:#EF4444,stroke:#DC2626,stroke-width:2px,color:#fff

    %% Student Journey
    subgraph StudentFlow["👨‍🎓 Student User Journey"]
        S1[🚀 Start]:::start
        S2[📝 Registration]:::process
        S3[📧 Email Verification]:::process
        S4{✅ Verified?}:::decision
        S5[👤 Profile Setup]:::process
        S6[📊 Dashboard Access]:::process
        S7[🔍 Browse Internships]:::process
        S8[🎯 Apply to Internship]:::process
        S9[📈 Track Application]:::process
        S10[🎉 Success]:::end
    end

    %% Admin Journey
    subgraph AdminFlow["👨‍💼 Admin User Journey"]
        A1[🚀 Admin Login]:::start
        A2[⚙️ Admin Dashboard]:::process
        A3[👥 User Management]:::process
        A4[💼 Internship Oversight]:::process
        A5[📊 Analytics Review]:::process
        A6[📋 Generate Reports]:::process
        A7[🔧 System Config]:::process
        A8[✅ Task Complete]:::end
    end

    %% Recruiter Journey
    subgraph RecruiterFlow["🏢 Recruiter User Journey"]
        R1[🚀 Company Registration]:::start
        R2[✅ Verification]:::process
        R3[💼 Recruiter Dashboard]:::process
        R4[📝 Post New Internship]:::process
        R5[📋 Review Applications]:::process
        R6[🤝 Interview Process]:::process
        R7[🎯 Selection Process]:::process
        R8[🎉 Onboarding]:::end
    end

    %% Flow connections
    S1 --> S2 --> S3 --> S4
    S4 -->|Yes| S5 --> S6 --> S7 --> S8 --> S9 --> S10
    S4 -->|No| S3

    A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7 --> A8

    R1 --> R2 --> R3 --> R4 --> R5 --> R6 --> R7 --> R8
```

## 📊 **Database Schema Diagram**

```mermaid
erDiagram
    USERS {
        string id PK
        string email UK
        string password
        enum role
        string firstName
        string lastName
        string phone
        datetime createdAt
        datetime updatedAt
        boolean isVerified
        boolean isActive
    }

    PROFILES {
        string id PK
        string userId FK
        string bio
        string location
        string avatar
        json skills
        json socialLinks
        datetime dateOfBirth
        enum gender
    }

    EDUCATION {
        string id PK
        string profileId FK
        string instituteName
        string degree
        string fieldOfStudy
        date startDate
        date endDate
        float cgpa
    }

    EXPERIENCE {
        string id PK
        string profileId FK
        string companyName
        string position
        string description
        date startDate
        date endDate
        boolean isCurrent
    }

    INTERNSHIPS {
        string id PK
        string recruiterId FK
        string title
        string description
        string companyName
        string location
        enum mode
        int duration
        date startDate
        date applicationDeadline
        float stipend
        json requirements
        json responsibilities
        int totalPositions
        string category
        json tags
        enum status
        datetime createdAt
    }

    APPLICATIONS {
        string id PK
        string studentId FK
        string internshipId FK
        enum status
        string coverLetter
        json resumeUrl
        json additionalDocs
        datetime appliedAt
        datetime reviewedAt
        string reviewComments
    }

    NOTIFICATIONS {
        string id PK
        string userId FK
        string title
        string message
        enum type
        boolean isRead
        json metadata
        datetime createdAt
    }

    FILES {
        string id PK
        string userId FK
        string fileName
        string fileUrl
        string fileType
        int fileSize
        enum category
        datetime uploadedAt
    }

    ANALYTICS {
        string id PK
        string userId FK
        string eventType
        json eventData
        string ipAddress
        string userAgent
        datetime timestamp
    }

    AUDIT_LOGS {
        string id PK
        string userId FK
        string action
        string entityType
        string entityId
        json changes
        datetime timestamp
        string ipAddress
    }

    %% Relationships
    USERS ||--|| PROFILES : has
    PROFILES ||--o{ EDUCATION : contains
    PROFILES ||--o{ EXPERIENCE : contains
    USERS ||--o{ INTERNSHIPS : creates
    USERS ||--o{ APPLICATIONS : submits
    INTERNSHIPS ||--o{ APPLICATIONS : receives
    USERS ||--o{ NOTIFICATIONS : gets
    USERS ||--o{ FILES : uploads
    USERS ||--o{ ANALYTICS : generates
    USERS ||--o{ AUDIT_LOGS : creates
```

## 🔐 **Authentication Flow Diagram**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant OAuth as OAuth Provider
    participant Email as Email Service

    %% Registration Flow
    Note over U,Email: User Registration Flow
    U->>F: Fill Registration Form
    F->>B: POST /api/v1/auth/register
    B->>DB: Check if email exists
    alt Email exists
        DB-->>B: User found
        B-->>F: Error: Email already exists
        F-->>U: Show error message
    else New user
        DB-->>B: User not found
        B->>B: Hash password
        B->>DB: Create new user
        B->>Email: Send verification email
        B-->>F: Success: Check email
        F-->>U: Show verification message
    end

    %% Email Verification
    Note over U,Email: Email Verification Flow
    U->>U: Click verification link
    U->>F: GET /verify-email?token=xyz
    F->>B: GET /api/v1/auth/verify-email
    B->>B: Verify JWT token
    alt Valid token
        B->>DB: Update user.isVerified = true
        B-->>F: Success: Email verified
        F-->>U: Redirect to login
    else Invalid token
        B-->>F: Error: Invalid token
        F-->>U: Show error page
    end

    %% Login Flow
    Note over U,Email: Login Flow
    U->>F: Enter credentials
    F->>B: POST /api/v1/auth/login
    B->>DB: Find user by email
    B->>B: Compare password
    alt Valid credentials
        B->>B: Generate JWT tokens
        B->>DB: Save refresh token
        B-->>F: Return access & refresh tokens
        F-->>U: Redirect to dashboard
    else Invalid credentials
        B-->>F: Error: Invalid credentials
        F-->>U: Show error message
    end

    %% OAuth Flow
    Note over U,OAuth: OAuth Flow (Google/GitHub)
    U->>F: Click "Login with Google"
    F->>OAuth: Redirect to OAuth provider
    OAuth->>U: Show consent screen
    U->>OAuth: Grant permission
    OAuth->>F: Return authorization code
    F->>B: POST /api/v1/auth/oauth/callback
    B->>OAuth: Exchange code for user info
    OAuth-->>B: Return user profile
    B->>DB: Find or create user
    B->>B: Generate JWT tokens
    B-->>F: Return tokens
    F-->>U: Redirect to dashboard
```

## 🚀 **Deployment Architecture Diagram**

```mermaid
graph TB
    %% Define styles
    classDef cdn fill:#FF6B6B,stroke:#E55353,stroke-width:2px,color:#fff
    classDef loadbalancer fill:#4ECDC4,stroke:#45B7B8,stroke-width:2px,color:#fff
    classDef app fill:#45B7D1,stroke:#3A9BC8,stroke-width:2px,color:#fff
    classDef db fill:#FFA07A,stroke:#FF7F50,stroke-width:2px,color:#fff
    classDef cache fill:#98D8C8,stroke:#82C2B0,stroke-width:2px,color:#fff
    classDef monitor fill:#F7DC6F,stroke:#F1C40F,stroke-width:2px,color:#fff

    %% Internet & CDN
    Internet[🌐 Internet Users]
    CDN[☁️ CDN - Cloudflare]:::cdn

    %% Load Balancer & Security
    LB[⚖️ Load Balancer - Nginx]:::loadbalancer
    WAF[🛡️ Web Application Firewall]:::loadbalancer
    SSL[🔒 SSL/TLS Termination]:::loadbalancer

    %% Application Servers
    subgraph AppCluster["🖥️ Application Cluster"]
        App1[📱 App Server 1<br/>Node.js + Express]:::app
        App2[📱 App Server 2<br/>Node.js + Express]:::app
        App3[📱 App Server 3<br/>Node.js + Express]:::app
    end

    %% Database Cluster
    subgraph DBCluster["🗄️ Database Cluster"]
        DBPrimary[(📊 MongoDB Primary)]:::db
        DBSecondary1[(📊 MongoDB Secondary 1)]:::db
        DBSecondary2[(📊 MongoDB Secondary 2)]:::db
    end

    %% Cache & Session Store
    subgraph CacheCluster["⚡ Cache & Sessions"]
        Redis1[(🔄 Redis Master)]:::cache
        Redis2[(🔄 Redis Replica)]:::cache
    end

    %% Monitoring & Logging
    subgraph Monitoring["📊 Monitoring & Logs"]
        Prometheus[📈 Prometheus]:::monitor
        Grafana[📊 Grafana Dashboard]:::monitor
        ELK[📋 ELK Stack<br/>Elasticsearch, Logstash, Kibana]:::monitor
    end

    %% External Services
    subgraph External["🌐 External Services"]
        CloudinaryExt[☁️ Cloudinary]:::cdn
        SMTPExt[📧 SMTP Service]:::cdn
        OAuthExt[🔑 OAuth Providers]:::cdn
    end

    %% Connections
    Internet --> CDN
    CDN --> WAF
    WAF --> SSL
    SSL --> LB
    LB --> App1
    LB --> App2
    LB --> App3

    App1 --> Redis1
    App2 --> Redis1
    App3 --> Redis1
    Redis1 --> Redis2

    App1 --> DBPrimary
    App2 --> DBPrimary
    App3 --> DBPrimary
    DBPrimary --> DBSecondary1
    DBPrimary --> DBSecondary2

    App1 --> CloudinaryExt
    App1 --> SMTPExt
    App1 --> OAuthExt

    App1 --> Prometheus
    App2 --> Prometheus
    App3 --> Prometheus
    Prometheus --> Grafana

    App1 --> ELK
    App2 --> ELK
    App3 --> ELK
```

## 💡 **How to Use These Mermaid Diagrams**

### **1. Online Mermaid Editor**
- Visit: https://mermaid.live/
- Copy any diagram code above
- Paste and see live preview
- Export as PNG/SVG

### **2. Install Mermaid CLI**
```bash
npm install -g @mermaid-js/mermaid-cli
```

### **3. Generate Images**
```bash
# Create diagram file
echo "graph TD; A-->B;" > diagram.mmd

# Generate PNG
mmdc -i diagram.mmd -o diagram.png

# Generate SVG  
mmdc -i diagram.mmd -o diagram.svg
```

### **4. GitHub Integration**
```markdown
<!-- In your README.md -->
## System Architecture

```mermaid
graph TB
    Frontend --> Backend
    Backend --> Database
```
```

### **5. VS Code Extension**
Install "Mermaid Preview" extension to preview diagrams directly in VS Code.

## 🎨 **Customization Tips**

### **Colors**
```mermaid
classDef frontend fill:#3B82F6,stroke:#1E40AF,color:#fff
classDef backend fill:#10B981,stroke:#047857,color:#fff
```

### **Icons**
Use emojis in node labels:
- 🖥️ Frontend
- ⚡ Backend  
- 🗄️ Database
- 👤 Users
- 📊 Analytics

These Mermaid diagrams will generate professional, interactive diagrams that you can use in presentations, documentation, and GitHub repositories!
