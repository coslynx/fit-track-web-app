<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
FitTrack
</h1>
<h4 align="center">Comprehensive fitness goal tracking web application for enthusiasts to set, monitor, and achieve their health objectives.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-Next.js_14-black?style=flat-square&logo=next.js" alt="Next.js 14">
  <img src="https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma" alt="Prisma">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/spectra-ai-codegen/fit-track-web-app?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/spectra-ai-codegen/fit-track-web-app?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/spectra-ai-codegen/fit-track-web-app?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
FitTrack is a comprehensive web application designed to revolutionize the way fitness enthusiasts track their goals and share achievements. Built with Next.js 14, TypeScript, and PostgreSQL, FitTrack offers a robust platform for setting specific, measurable fitness objectives, monitoring progress, and engaging with a supportive community of like-minded individuals.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| ⚙️ | **Architecture**   | Utilizes Next.js 14 with App Router for optimal performance and server-side rendering capabilities.                 |
| 📄 | **Documentation**  | Comprehensive README and API documentation using Swagger UI for clear understanding and usage instructions.         |
| 🔗 | **Dependencies**   | Leverages key packages like Chakra UI, Zustand, Prisma, and NextAuth for robust functionality and user experience. |
| 🧩 | **Modularity**     | Implements a modular structure with separate components for goals, progress tracking, and social features.         |
| 🧪 | **Testing**        | Incorporates unit and integration tests using Jest and React Testing Library for reliability.                      |
| ⚡️  | **Performance**    | Optimized with Next.js Image component and dynamic imports for efficient loading and rendering.                    |
| 🔐 | **Security**       | Implements NextAuth.js for secure authentication and Prisma for type-safe database queries.                        |
| 🔀 | **Version Control**| Utilizes Git with a structured branching strategy and GitHub Actions for CI/CD pipelines.                          |
| 🔌 | **Integrations**   | Seamlessly integrates with PostgreSQL database and supports potential future integrations with fitness APIs.       |
| 📶 | **Scalability**    | Designed with a scalable architecture using Next.js and Prisma, ready for future feature expansions.               |

## 📂 Structure
```text
fit-track-web-app/
├── components/
│   ├── Dashboard.tsx
│   ├── GoalForm.tsx
│   ├── ProgressChart.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/
│   ├── index.tsx
│   ├── goals.tsx
│   ├── progress.tsx
│   └── social.tsx
├── styles/
│   └── globals.css
├── utils/
│   ├── api.ts
│   └── helpers.ts
├── stores/
│   ├── goalStore.ts
│   └── userStore.ts
├── types/
│   └── index.ts
├── public/
│   ├── favicon.ico
│   └── logo.png
├── prisma/
│   └── schema.prisma
├── app/
│   ├── api/
│   │   ├── goals/
│   │   │   └── route.ts
│   │   ├── progress/
│   │   │   └── route.ts
│   │   └── auth/
│   │       └── [...nextauth].ts
│   └── layout.tsx
├── next.config.js
├── tsconfig.json
├── .env.local
├── package.json
└── README.md
```

## 💻 Installation
### 🔧 Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL

### 🚀 Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/spectra-ai-codegen/fit-track-web-app.git
   ```
2. Navigate to the project directory:
   ```
   cd fit-track-web-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up your environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required database and authentication credentials

5. Set up the database:
   ```
   npx prisma migrate dev
   ```

## 🏗️ Usage
### 🏃‍♂️ Running the Application
1. Start the development server:
   ```
   npm run dev
   ```
2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### ⚙️ Configuration
Adjust configuration settings in `.env.local` file. Key variables include:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: A secret key for NextAuth.js
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: For Google OAuth (if used)

### 📚 Examples
- 📝 **Setting a Goal**: Navigate to the 'Goals' page and use the GoalForm component to create a new fitness goal.
- 📊 **Tracking Progress**: Use the ProgressChart component on the 'Progress' page to visualize your fitness journey.
- 🤝 **Social Sharing**: On the 'Social' page, share your achievements and connect with other FitTrack users.

## 🌐 Hosting
### 🚀 Deployment Instructions

#### Vercel (Recommended)
1. Fork the repository to your GitHub account.
2. Sign up for a Vercel account and connect it to your GitHub.
3. Create a new project in Vercel and select the forked repository.
4. Configure your environment variables in the Vercel dashboard.
5. Deploy the application.

#### Heroku
1. Install the Heroku CLI:
   ```
   npm install -g heroku
   ```
2. Login to Heroku:
   ```
   heroku login
   ```
3. Create a new Heroku app:
   ```
   heroku create fit-track-app
   ```
4. Set up PostgreSQL addon:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```
5. Set environment variables:
   ```
   heroku config:set NEXTAUTH_URL=https://your-app-name.herokuapp.com
   heroku config:set NEXTAUTH_SECRET=your_secret_key
   ```
6. Deploy the code:
   ```
   git push heroku main
   ```

### 🔑 Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Full URL of your application
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (if used)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (if used)

## 📜 API Documentation
### 🔍 Endpoints
- **GET /api/goals**: Retrieves a list of user goals.
- **POST /api/goals**: Creates a new goal.
- **GET /api/progress**: Fetches user progress data.
- **POST /api/progress**: Logs new progress data.

### 🔒 Authentication
FitTrack uses NextAuth.js for authentication. JWT tokens are used for securing API routes.

### 📝 Examples
- Fetch user goals:
  ```
  curl -X GET http://localhost:3000/api/goals -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```
- Create a new goal:
  ```
  curl -X POST http://localhost:3000/api/goals -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"title":"Lose 10 pounds","description":"Through diet and exercise","targetDate":"2023-12-31"}'
  ```

## 📜 License
This project is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/).

## 👥 Authors
- **Spectra.codes Team** - [Spectra.codes](https://spectra.codes)
- **DRIX10** - [GitHub](https://github.com/Drix10)

<p align="center">
  <h1 align="center">🌐 Spectra.Codes</h1>
</p>
<p align="center">
  <em>Why only generate Code? When you can generate the whole Repository!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developer-Drix10-red" alt="">
<img src="https://img.shields.io/badge/Website-Spectra.codes-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4-black" alt="">
</div>