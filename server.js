const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Configuración de PostgreSQL
const pool = new Pool({
    host: 'dpg-d4chtvq4d50c73d70ong-a',
    database: 'empleados_db_ndkw',
    user: 'empleados_user',
    password: 'C87br9mvQUa1SiJI6XpLzUUKKrpMaj2n',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Inicializar BD
async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS empleados (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                departamento VARCHAR(100) NOT NULL,
                numero_empleado VARCHAR(50) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Datos de ejemplo
        const result = await pool.query('SELECT COUNT(*) as count FROM empleados');
        if (parseInt(result.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO empleados (nombre, apellido, departamento, numero_empleado) VALUES 
                ('Juan', 'Pérez', 'Ventas', 'EMP001'),
                ('María', 'Gómez', 'TI', 'EMP002'),
                ('Carlos', 'López', 'Recursos Humanos', 'EMP003')
            `);
        }
        console.log('Base de datos inicializada correctamente');
    } catch (error) {
        console.error('Error inicializando BD:', error);
    }
}

// API Routes
app.get('/api/empleados', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empleados ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/empleados/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empleados WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/empleados', async (req, res) => {
    try {
        const { nombre, apellido, departamento, numero_empleado } = req.body;
        const result = await pool.query(
            'INSERT INTO empleados (nombre, apellido, departamento, numero_empleado) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, apellido, departamento, numero_empleado]
        );
        res.status(201).json({ id: result.rows[0].id, message: 'Empleado creado exitosamente' });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'El número de empleado ya existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.put('/api/empleados/:id', async (req, res) => {
    try {
        const { nombre, apellido, departamento, numero_empleado } = req.body;
        const result = await pool.query(
            'UPDATE empleados SET nombre = $1, apellido = $2, departamento = $3, numero_empleado = $4 WHERE id = $5 RETURNING *',
            [nombre, apellido, departamento, numero_empleado, req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        
        res.json({ message: 'Empleado actualizado exitosamente' });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'El número de empleado ya existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.delete('/api/empleados/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM empleados WHERE id = $1 RETURNING *', [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        
        res.json({ message: 'Empleado eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicializar
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
        console.log(`📊 Sistema de Empleados listo`);
    });
});