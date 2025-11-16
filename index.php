<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Gestión de Empleados</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🏢 Sistema de Gestión de Empleados</h1>
        </header>

        <!-- Formulario para agregar/editar empleados -->
        <div class="form-section">
            <h2 id="form-title">Agregar Nuevo Empleado</h2>
            <form id="empleado-form">
                <input type="hidden" id="empleado-id">
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" required>
                </div>
                <div class="form-group">
                    <label for="apellido">Apellido:</label>
                    <input type="text" id="apellido" required>
                </div>
                <div class="form-group">
                    <label for="departamento">Departamento:</label>
                    <input type="text" id="departamento" required>
                </div>
                <div class="form-group">
                    <label for="numero_empleado">Número de Empleado:</label>
                    <input type="text" id="numero_empleado" required>
                </div>
                <div class="form-buttons">
                    <button type="submit" id="submit-btn">Agregar Empleado</button>
                    <button type="button" id="cancel-btn" style="display: none;">Cancelar</button>
                </div>
            </form>
        </div>

        <!-- Lista de empleados -->
        <div class="list-section">
            <h2>Lista de Empleados</h2>
            <div id="loading">Cargando empleados...</div>
            <div id="empleados-list"></div>
        </div>
    </div>

    <script src="js/script.js"></script>
</body>
</html>