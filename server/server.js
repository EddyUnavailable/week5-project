import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

//  current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dotenv
dotenv.config({ path: join(__dirname, '.env') });

const app = express();

//  CORS
app.use(cors());
app.use(express.json());

// db connection
const db = new pg.Pool({
    connectionString: process.env.DB_CONN,
    ssl: {
        rejectUnauthorized: false
    }
});

// API Ninja config
const API_NINJA_KEY = process.env.API_NINJA_KEY;
const API_NINJA_URL = 'https://api.api-ninjas.com/v1/facts';

// random fact from API Ninja
app.get('/api/random-fact', async (req, res) => {
    const { category } = req.query;
    try {
        let apiUrl = API_NINJA_URL;
        if (category && category !== 'all') {
            apiUrl += `?category=${category}`;
        }
        
        const response = await fetch(apiUrl, {
            headers: {
                'X-Api-Key': API_NINJA_KEY
            }
        });
        const data = await response.json();
        
        // Add category to the response if not present
        const fact = data[0];
        if (fact && !fact.category) {
            fact.category = category || 'general';
        }
        
        res.json(fact);
    } catch (error) {
        console.error('Error fetching from API Ninja:', error);
        res.status(500).json({ error: 'Failed to fetch random fact' });
    }
});

// GET facts from database with optional category filter
app.get('/api/facts', async (req, res) => {
    const { category } = req.query;
    try {
        let query = 'SELECT * FROM facts';
        const params = [];

        if (category && category !== 'all') {
            query += ' WHERE category = $1';
            params.push(category);
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch facts' });
    }
});

// POST new fact to database
app.post('/api/facts', async (req, res) => {
    const { text, category } = req.body;
    
    if (!text || !category) {
        return res.status(400).json({ error: 'Text and category are required' });
    }

    try {
        const query = 'INSERT INTO facts (text, category) VALUES ($1, $2) RETURNING *';
        const result = await db.query(query, [text, category]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to save fact' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});