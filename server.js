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

let db;
(async () => {
    try {
        db = await mysql.createConnection({
            host: '192.168.1.102', 
            user: 'root',
            password: 'root',
            database: 'shop'
        });
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
})();

app.post('/insert_image', async (req, res) => {
    const { id, price, color, imageFile, name, des } = req.body;
    const imagePathWithFilename = path.join(imagePath, imageFile);
    const imageBuffer = fs.readFileSync(imagePathWithFilename);

    const sql = 'INSERT INTO sys.shoping (id, image, price, color, name, des) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        await db.execute(sql, [id, imageBuffer, price, color, name, des]);
        res.status(201).send({ message: 'Item inserted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/delete_image', async (req, res) => {
    const { id } = req.body;

    const sql = 'SELECT image FROM sys.shoping WHERE id = ?';
    try {
        const [rows] = await db.execute(sql, [id]);
        if (rows.length === 0) {
            res.status(404).send({ message: 'No matching record found' });
            return;
        }

        const deleteSql = 'DELETE FROM sys.shoping WHERE id = ?';
        await db.execute(deleteSql, [id]);
        res.status(200).send({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/shoping', async (req, res) => {
    const sql = 'SELECT * FROM shoping';
    try {
        const [rows] = await db.execute(sql);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
