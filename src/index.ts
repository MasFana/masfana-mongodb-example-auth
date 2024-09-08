import { Hono } from "hono";
import { CookieStore, sessionMiddleware } from "hono-sessions";
import { MongoDBAPI } from "masfana-mongodb-api-sdk";
import { Context } from "hono";

// Define the User type
type User = {
  _id?: string;
  username: string;
  password: string;
};

// MongoDB connection setup
const client = new MongoDBAPI<User>({
  MONGO_API_URL:
    "",
  MONGO_API_KEY:
    "",
  DATABASE: "",
  COLLECTION: "",
  DATA_SOURCE: "",
});

const sessionStore = new CookieStore();

// Create a Hono app instance
const app = new Hono();

// Use session middleware
app.use(
  "*",
  sessionMiddleware({
    store: sessionStore,
    encryptionKey: "this-is-a-very-secure-and-long-encryption-key", // Use a secure key
    expireAfterSeconds: 900, // Sessions expire after 900 seconds (15 minutes)
    sessionCookieName: "session",
    cookieOptions: {
      path: "/",
      httpOnly: true, // Ensure cookie is HTTP only
    },
  })
);

// Route to register new users and save to MongoDB
app.post("/register", async (c: Context) => {
  const body = await c.req.parseBody();
  const { username, password }:User = body as User;
  // Store user data in MongoDB
  await client.insertOne({
    username,
    password,
  });

  return c.json({ message: "User registered successfully" });
});


// Login route and set session
app.post("/login", async (c: Context) => {
  const session = c.get("session");
  const body = await c.req.parseBody();
  const { username, password }:User = body as User;
  // Assuming a simple user login flow
  const user = await client.findOne({username: username , password: password });
  console.log(user.document);
  if(user.document) {
    session.set("userId", user.document._id); // Store userId in session
    return c.redirect("/",301);
  } else {
    return c.json({ message: "User not found" }, 404);
  }
});


// Logout route
app.get("/logout", (c: Context) => {
  const session = c.get("session");
  session.deleteSession();
  return c.redirect("/");
});

// Protected route
app.get("/protected", (c: Context) => {
  const session = c.get("session");
  const userId = session.get("userId");

  if (userId) {
    return c.json({
      message: `Welcome to the protected route, User ID: ${userId}`,
    });
  } else {
    return c.json({ message: "Not authenticated" }, 401);
  }
});


app.get("/",async (c: Context) => {
  let user = c.get("session").get("userId");
  let userdata = (await client.find({ _id: user ,})).documents[0];
  return c.html(`
    <h1>Welcome to Auth Hono APP</h1>

    <!-- Display User Information -->
    <a id="userId">ID : ${userdata?._id || "Please Login"}</a><br>
    <a id="username">Username : ${userdata?.username || "Please Login"}</a><br>
    <a id="password">Passsword : ${
      userdata?.password || "Please Login"
    }</a>

    <!-- Login Form -->
    <h2>Login</h2>
    <form method="post" action="/login">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
    </form>

    <!-- Navigation Links -->
    <a href="/register">Register</a> |
    <a href="/logout">Logout</a> |
    <a href="/protected">Protected</a>

    <!-- Registration Form -->
    <h2>Register</h2>
    <form method="post" action="/register">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
    </form>
    `);
});

// Start the server
app.fire();
