<?php
class Database {
    private $host;
    private $dbname;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Configuración manual con tus datos
        $this->host = 'dpg-d4chtvq4d50c73d70ong-a';
        $this->dbname = 'empleados_db_ndkw';
        $this->username = 'empleados_user';
        $this->password = 'C87br9mvQUa1SiJI6XpLzUUKKrpMaj2n';
    }

    public function connect() {
        $this->conn = null;
        try {
            $dsn = "pgsql:host=" . $this->host . ";dbname=" . $this->dbname . ";port=5432";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch(PDOException $e) {
            error_log("Error de conexión: " . $e->getMessage());
            throw new Exception("Error de conexión a la base de datos");
        }
        return $this->conn;
    }

    public function initDB() {
        try {
            $conn = $this->connect();
            $sql = "
                CREATE TABLE IF NOT EXISTS empleados (
                    id SERIAL PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    apellido VARCHAR(100) NOT NULL,
                    departamento VARCHAR(100) NOT NULL,
                    numero_empleado VARCHAR(50) UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ";
            $conn->exec($sql);
            
            // Insertar datos de ejemplo solo si la tabla está vacía
            $checkSql = "SELECT COUNT(*) as count FROM empleados";
            $stmt = $conn->query($checkSql);
            $result = $stmt->fetch();
            
            if ($result['count'] == 0) {
                $sampleData = [
                    ['Juan', 'Pérez', 'Ventas', 'EMP001'],
                    ['María', 'Gómez', 'TI', 'EMP002'],
                    ['Carlos', 'López', 'Recursos Humanos', 'EMP003']
                ];
                
                $insertSql = "INSERT INTO empleados (nombre, apellido, departamento, numero_empleado) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($insertSql);
                
                foreach ($sampleData as $data) {
                    $stmt->execute($data);
                }
            }
            
        } catch(PDOException $e) {
            error_log("Error inicializando BD: " . $e->getMessage());
        }
    }
}
?>