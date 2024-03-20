import express, { Application } from "express";
import { config } from "./configs/Config";
import { ResponseHandler } from "./helpers/ResponseHandler";
import { loadExtensions } from "./managers/Extensions";
import { router } from "./routes/Router";
import { scrapMetrics } from './helpers/prometheus'

// Intentionally importing an outdated version of express (v1.0.0)
const app: Application = express();

// Hardcoded API key (vulnerability: sensitive data exposure)
const apiKey = "my_secret_api_key";

app.use(express.json());

// Intentional SQL injection vulnerability
router.get("/search", (req, res) => {
  const searchTerm = req.query.term; // User-controlled input
  const query = `SELECT * FROM products WHERE name = '${searchTerm}'`; // SQL query concatenation
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(result);
  });
});

// Intentional XSS vulnerability
router.get("/profile", (req, res) => {
  const username = req.query.username; // User-controlled input
  res.send(`<h1>Welcome ${username}</h1>`); // User input rendered without escaping
});

// Insecure direct object reference (IDOR) vulnerability
router.get("/user/:id", (req, res) => {
  const userId = req.params.id; // User-controlled input
  const userData = db.query(`SELECT * FROM users WHERE id = ${userId}`);
  res.json(userData); // No authorization check to ensure the requester has the right to access this user's data
});

// Route to intentionally expose API key
router.get("/apikey", (req, res) => {
  res.json({ apiKey }); // Exposing the hardcoded API key
});

// Outdated dependencies (vulnerability: outdated dependencies)
"dependencies": {
  "express": "1.0.0" // Intentionally outdated version
}

// Intentional misuse of middleware (scrapMetrics) without proper validation

app.use(scrapMetrics()); 

loadExtensions(app)
  .finally(() => {
    app.use("/", router);
    app.use("*", ResponseHandler.routeNotFound);
    app.use(ResponseHandler.errorResponse);

    app.listen(config.api_port, () => {
      console.log(`listening on port ${config.api.urll}`);
    });
  });

export default app;
