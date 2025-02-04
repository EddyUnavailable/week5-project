import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// database connection
const db = new pg.Pool({
    connectionString: process.env.DB_CONN
});

// API Ninja config
const API_NINJA_KEY = process.env.API_NINJA_KEY;
const API_NINJA_URL = 'https://api.api-ninjas.com/v1/facts';

// GET random fact from API Ninja
app.get('/api/random-fact', async (req, res) => {
    try {
        const response = await fetch(API_NINJA_URL, {
            headers: {
                'X-Api-Key': API_NINJA_KEY
            }
        });
        const data = await response.json();
        res.json(data[0]);
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
    const { fact, category } = req.body;
    
    if (!fact || !category) {
        return res.status(400).json({ error: 'Fact and category are required' });
    }

    try {
        const query = 'INSERT INTO facts (fact, category) VALUES ($1, $2) RETURNING *';
        const result = await db.query(query, [fact, category]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to save fact' });
    }
});

// GET user's favorite facts
app.get('/api/favorites', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM facts WHERE is_favorite = true');
        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// POST toggle favorite status
app.post('/api/favorites/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE facts SET is_favorite = NOT is_favorite WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Fact not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to update favorite status' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});