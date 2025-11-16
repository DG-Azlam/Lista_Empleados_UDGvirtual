<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener empleado específico
            $id = $_GET['id'];
            $sql = "SELECT * FROM empleados WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $empleado = $stmt->fetch();
            
            if ($empleado) {
                echo json_encode($empleado);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Empleado no encontrado']);
            }
        } else {
            // Obtener todos los empleados
            $sql = "SELECT * FROM empleados ORDER BY id DESC";
            $stmt = $db->query($sql);
            $empleados = $stmt->fetchAll();
            echo json_encode($empleados);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['nombre']) || !isset($data['apellido']) || 
            !isset($data['departamento']) || !isset($data['numero_empleado'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan campos requeridos']);
            break;
        }
        
        try {
            $sql = "INSERT INTO empleados (nombre, apellido, departamento, numero_empleado) 
                    VALUES (:nombre, :apellido, :departamento, :numero_empleado) 
                    RETURNING id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':nombre', $data['nombre']);
            $stmt->bindParam(':apellido', $data['apellido']);
            $stmt->bindParam(':departamento', $data['departamento']);
            $stmt->bindParam(':numero_empleado', $data['numero_empleado']);
            $stmt->execute();
            
            $result = $stmt->fetch();
            echo json_encode(['id' => $result['id'], 'message' => 'Empleado creado exitosamente']);
        } catch(PDOException $e) {
            if ($e->getCode() == '23505') {
                http_response_code(400);
                echo json_encode(['error' => 'El número de empleado ya existe']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error del servidor']);
            }
        }
        break;
        
    case 'PUT':
        $id = $_GET['id'];
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['nombre']) || !isset($data['apellido']) || 
            !isset($data['departamento']) || !isset($data['numero_empleado'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan campos requeridos']);
            break;
        }
        
        try {
            $sql = "UPDATE empleados 
                    SET nombre = :nombre, apellido = :apellido, 
                        departamento = :departamento, numero_empleado = :numero_empleado 
                    WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':nombre', $data['nombre']);
            $stmt->bindParam(':apellido', $data['apellido']);
            $stmt->bindParam(':departamento', $data['departamento']);
            $stmt->bindParam(':numero_empleado', $data['numero_empleado']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Empleado actualizado exitosamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Empleado no encontrado']);
            }
        } catch(PDOException $e) {
            if ($e->getCode() == '23505') {
                http_response_code(400);
                echo json_encode(['error' => 'El número de empleado ya existe']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error del servidor']);
            }
        }
        break;
        
    case 'DELETE':
        $id = $_GET['id'];
        
        $sql = "DELETE FROM empleados WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Empleado eliminado exitosamente']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Empleado no encontrado']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>