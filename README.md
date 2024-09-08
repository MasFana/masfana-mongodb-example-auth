
# Hono Authentication Example App using `masfana-mongodb-api-sdk`, Cloudflare, and Cloudflare Workers

This project is an example of a lightweight authentication system built using the following technologies:

-   **Hono Framework**: A fast web framework for the Edge.
-   **masfana-mongodb-api-sdk**: A MongoDB API SDK for handling MongoDB operations.
[masfana-mongodb-api-sdk](https://www.npmjs.com/package/masfana-mongodb-api-sdk?activeTab=readme)

-   **Cloudflare Workers**: Serverless execution environment for running apps at the Edge.
-   **Hono Sessions**: Middleware to manage user sessions stored as cookies.

## Features

-   User registration and login with credentials stored in MongoDB.
-   User sessions using cookies, with session expiration.
-   Simple protected route example requiring authentication.
-   Logout functionality to clear user sessions.
-   Deployed on Cloudflare Workers for edge performance.

## Prerequisites

Before running the application, you will need:

1.  **Cloudflare Workers Account**: Set up and configure Cloudflare Workers.
2.  **MongoDB API Key**: Create an API key and set up the `masfana-mongodb-api-sdk` with your MongoDB instance.
3.  **Hono Framework**: This is used to create the web application.

## Getting Started
Installation
**1. Clone the repository**:
```bash
git clone <repository-url>
cd <project-directory>
```
**2. Install dependencies**:

If you're using a package manager like `npm` or `yarn`, install the necessary dependencies:
```bash
npm install hono masfana-mongodb-api-sdk hono-sessions
```
**3. Set up MongoDB connection**:

In your application, replace the MongoDB connection details with your own:
```javascript
const client = new MongoDBAPI<User>({
  MONGO_API_URL: "your-mongo-api-url",
  MONGO_API_KEY: "your-mongo-api-key",
  DATABASE: "your-database",
  COLLECTION: "your-collection",
  DATA_SOURCE: "your-data-source",
});
```
**4. Deploy to Cloudflare Workers**:

You'll need to configure your Cloudflare Workers environment. Follow the Cloudflare Workers documentation for deployment.

### Project Structure

-   `index.ts`: This file contains the main application logic, including session management, user registration, login, logout, and protected routes.
-   `MongoDBAPI`: This is the MongoDB client used to handle CRUD operations with the MongoDB database.

### Routes

1.  **Registration Route** (`POST /register`):
    
    -   Allows users to register by providing a username and password.
    -   Stores user credentials in the MongoDB database.
2.  **Login Route** (`POST /login`):
    
    -   Verifies user credentials against the MongoDB database.
    -   If successful, a session is created for the user, storing their ID in a session cookie.
3.  **Logout Route** (`GET /logout`):
    
    -   Clears the session and logs the user out.
4.  **Protected Route** (`GET /protected`):
    
    -   Only accessible to authenticated users with an active session.
    -   Returns a personalized message based on the session data.
5.  **Home Route** (`GET /`):
    
    -   Displays basic user information and login/registration forms.
    -   Accessible to both authenticated and non-authenticated users.

### Security

-   **Session Management**: Sessions are managed using the `hono-sessions` library, with cookies securely stored and marked as `HTTP-only`.
-   **Encryption Key**: Ensure you replace the encryption key with a secure, random string.

### Example Usage

Once the app is deployed, users can:

1.  Register a new account by entering a username and password.
2.  Log in using their credentials, which will create a session.
3.  Access protected content by visiting the protected route, available only after logging in.
4.  Log out, which will clear their session and log them out of the app.

## Deployment

To deploy this application on Cloudflare Workers:

1.  Set up a Cloudflare Workers environment and install Wrangler (`npm install -g wrangler`).
    
2.  Deploy the application using:
```bash
wrangler publish
```
3.  Your application will be deployed at your Cloudflare Workers URL, accessible globally.