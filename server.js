const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const imagePath = 'imgdatabase';
const sqlInitPath = path.join(__dirname, 'init.sql');

let db;
(async () => {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            multipleStatements: true
        });

        // Read and execute the SQL initialization file
        const initSql = fs.readFileSync(sqlInitPath, 'utf-8');
        await db.query(initSql);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
})();

app.post('/insert_image', async (req, res) => {
    const { id, price, color, imageFile, name, des } = req.body;
    const imagePathWithFilename = path.join(imagePath, imageFile);
    const imageBuffer = fs.readFileSync(imagePathWithFilename);

    const sql = 'INSERT INTO shop.shoping (id, image, price, color, name, des) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        await db.execute(sql, [id, imageBuffer, price, color, name, des]);
        res.status(201).send({ message: 'Item inserted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/delete_image', async (req, res) => {
    const { id } = req.body;

    const sql = 'SELECT image FROM shop.shoping WHERE id = ?';
    try {
        const [rows] = await db.execute(sql, [id]);
        if (rows.length === 0) {
            res.status(404).send({ message: 'No matching record found' });
            return;
        }

        const deleteSql = 'DELETE FROM shop.shoping WHERE id = ?';
        await db.execute(deleteSql, [id]);
        res.status(200).send({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/shoping', async (req, res) => {
    const sql = 'SELECT * FROM shop.shoping';
    try {
        const [rows] = await db.execute(sql);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Endpoint to serve images
app.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT image FROM shop.shoping WHERE id = ?';
    try {
        const [rows] = await db.execute(sql, [id]);
        if (rows.length === 0) {
            res.status(404).send({ message: 'Image not found' });
            return;
        }
        const image = rows[0].image;
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(image, 'binary');
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
