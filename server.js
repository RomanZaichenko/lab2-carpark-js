const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'carpark',
  password: 'postgres',
  port: 5432,
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Отримати всі авто
app.get('/cars', async (req, res) => {
  const result = await pool.query(`
    SELECT c.car_id, c.model, c.fuel_consumption, c.kilometrage, c.year, c.fuel_capacity,
           m.name AS manufacturer, c.manufacturer_id
    FROM cars c JOIN manufacturers m ON c.manufacturer_id = m.manufacturer_id
  `);
  res.json(result.rows);
});

// Отримати виробників
app.get('/manufacturers', async (req, res) => {
  const result = await pool.query('SELECT * FROM manufacturers');
  res.json(result.rows);
});

// Додати авто
app.post('/cars', async (req, res) => {
  const { manufacturer_id, model, fuel_consumption, kilometrage, year, fuel_capacity } = req.body;
  await pool.query(`
    INSERT INTO cars (manufacturer_id, model, fuel_consumption, kilometrage, year, fuel_capacity)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [manufacturer_id, model, fuel_consumption, kilometrage, year, fuel_capacity]);
  res.status(201).send('Car added');
});

// Оновити авто
app.put('/cars/:id', async (req, res) => {
  const id = req.params.id;
  const { manufacturer_id, model, fuel_consumption, kilometrage, year, fuel_capacity } = req.body;
  await pool.query(`
    UPDATE cars SET manufacturer_id=$1, model=$2, fuel_consumption=$3, kilometrage=$4, year=$5, fuel_capacity=$6
    WHERE car_id=$7
  `, [manufacturer_id, model, fuel_consumption, kilometrage, year, fuel_capacity, id]);
  res.send('Car updated');
});

// Видалити авто
app.delete('/cars/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM cars WHERE car_id=$1', [id]);
  res.send('Car deleted');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
