# WebChat

WebChat is a full-stack MERN real-time chat application with JWT-based authentication, MongoDB persistence, and Socket.IO live messaging. It includes a React + Vite frontend, an Express + MongoDB backend, and Docker support for the complete stack.

## Features

- User signup, login, and logout
- JWT auth stored in an httpOnly cookie
- Protected chat and message APIs
- Real-time messaging with Socket.IO
- Online user presence updates
- Conversation and message history stored in MongoDB
- React frontend with search, chat list, message panel, and login/signup screens
- Dockerized frontend, backend, and MongoDB through Docker Compose

## Tech Stack

- Frontend: React, Vite, Axios, React Router, Zustand, React Hot Toast, Socket.IO client, Tailwind CSS, DaisyUI
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO, CORS, cookie-parser, jsonwebtoken, bcryptjs
- Containerization: Docker, Docker Compose, Nginx

## Project Structure

```text
WebChat/
  Backend/          Express API, auth, routes, controllers, models, Socket.IO server
  Frontend/         React UI, Vite app, auth/context state, chat UI, Nginx config
  docker-compose.yml
```

## How It Works

### Backend

The backend exposes REST APIs for authentication and messaging, connects to MongoDB, and creates the Socket.IO server for live updates.

Main responsibilities:

- Create and verify JWT cookies
- Register and log in users
- Load the authenticated user profile
- Fetch users for chat selection
- Send and fetch conversation messages
- Broadcast online user lists
- Emit new messages to the correct receiver in real time

### Frontend

The frontend is a React single-page app that uses the backend API and Socket.IO connection to provide the chat interface.

Main screens and flows:

- Signup page
- Login page
- Main chat layout after authentication
- User search and conversation selection
- Message list and message composer
- Real-time updates when new messages arrive
- Online user status updates

## API Endpoints

### Auth

- `POST /api/users/signup`
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/getUserprofile`

### Messages

- `POST /api/messages/send/:id`
- `GET /api/messages/get/:id`

## Socket Events

- Server emits `getonlineusers` with the list of currently connected user IDs
- Server emits `newMessage` to the receiver when a message is sent

## Environment Variables

### Backend

Create `Backend/.env` from `Backend/.env.example` and set:

```env
PORT=5002
MONGO_URI=mongodb+srv://your_username:your_password@cluster.name.mongodb.net/WebChat-MERN?appName=Cluster0
JWT_TOKEN=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:4001
NODE_ENV=development
```

Notes:

- `MONGO_URI` can also use `MONGODB_URI`
- `JWT_TOKEN` must be a strong secret
- `FRONTEND_URL` must match the frontend origin

### Frontend

Set the Vite API URL to the backend base URL.

```env
VITE_API_URL=http://localhost:5002
```

If you are using Docker Compose, this is injected automatically during the frontend image build.

## Run Locally Without Docker

### 1. Start MongoDB

Use a local MongoDB instance or a hosted Atlas connection string.

### 2. Start the backend

```bash
cd Backend
npm install
npm run dev
```

### 3. Start the frontend

```bash
cd Frontend
npm install
npm run dev
```

Then open the Vite development URL shown in the terminal.

## Run With Docker

The repository includes a full stack Docker Compose setup:

- MongoDB runs in a `mongo` container
- Backend runs on port `5002`
- Frontend runs on port `4001`
- MongoDB data is persisted in the `mongo_data` volume

### Start the stack

```bash
docker compose up --build
```

### Open the app

- Frontend: `http://localhost:4001`
- Backend health check: `http://localhost:5002/health`

## Docker Details

### Backend Dockerfile

- Uses `node:20-alpine`
- Installs dependencies with `npm ci`
- Exposes port `5002`
- Starts the server with `npm start`

### Frontend Dockerfile

- Builds the app in a Node 20 Alpine stage
- Accepts `VITE_API_URL` as a build argument
- Serves the production bundle with `nginx:1.27-alpine`
- Uses Nginx SPA fallback so React Router routes work on refresh

## Useful Notes

- Authentication is cookie-based, so the browser must send credentials with requests
- Socket.IO uses the authenticated user ID to map live connections
- The frontend stores the logged-in user in local storage as `userInfo`
- The backend requires `JWT_TOKEN` to sign and verify session cookies

## Common Production Setup

When deploying behind Docker or another reverse proxy:

- Point `FRONTEND_URL` to the public frontend origin
- Point `VITE_API_URL` to the public backend API URL before building the frontend
- Ensure HTTPS is enabled in production so secure cookies work correctly
- Use a managed MongoDB instance or a persistent MongoDB volume

## Status Endpoints

- `GET /` returns `WebChat API is running`
- `GET /health` returns `{ "status": "ok" }`

## License

ISC
