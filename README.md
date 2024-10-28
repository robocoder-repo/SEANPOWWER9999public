
# Escort Web App

This is a web application for managing escort profiles and communications.

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/robocoder-repo/SEANPOWWER9999public.git
   cd SEANPOWWER9999public
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   SESSION_SECRET=your_session_secret
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open a web browser and navigate to `http://localhost:3000`

## Features

- User registration and login
- Profile management
- View and edit escort profiles
- Subscription management
- API data viewing for each profile

## API Integration

This application integrates with the HTTPSMS API for message management. Each user needs to provide their API key and phone number to access their message data.

## Note

This is a demo application and should not be used in production without proper security measures and data protection implementations.
