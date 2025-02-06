import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fetch from "node-fetch";

//  current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dotenv
dotenv.config({ path: join(__dirname, ".env") });

const app = express();

//  CORS
app.use(cors());
app.use(express.json());

// db connection
const db = new pg.Pool({
  connectionString: process.env.DB_CONN,
  ssl: {
    rejectUnauthorized: false,
  },
});

// API Ninja
const API_NINJA_KEY = process.env.API_NINJA_KEY;
const API_NINJA_URL = "https://api.api-ninjas.com/v1/facts";

// random fact from API Ninja
app.get("/api/random-fact", async (req, res) => {
  const { category } = req.query;
  try {
    let query = "SELECT * FROM facts";
    const params = [];

    if (category && category !== "all") {
      query += " WHERE category = $1";
      params.push(category);
    }

    query += " ORDER BY RANDOM() LIMIT 1";

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      // If no fact found in database, fetch from API
      // Your existing API Ninja code here
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching random fact:", error);
    res.status(500).json({ error: "Failed to fetch random fact" });
  }
});

// GET facts from database with optional category filter
app.get("/api/facts", async (req, res) => {
  const { category } = req.query;
  try {
    let query = "SELECT * FROM facts";
    const params = [];

    if (category && category !== "all") {
      query += " WHERE category = $1";
      params.push(category);
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch facts" });
  }
});

// POST new fact to database
app.post("/api/facts", async (req, res) => {
  const { text, category } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const query =
      "INSERT INTO facts (text, category) VALUES ($1, $2) RETURNING *";
    const result = await db.query(query, [text, category || "general"]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save fact" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
