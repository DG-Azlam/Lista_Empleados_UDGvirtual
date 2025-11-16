const API_BASE = '/api/empleados';  

class EmpleadoManager {
    constructor() {
        this.isEditing = false;
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadEmpleados();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('empleado-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.cancelEdit();
        });
    }

    async loadEmpleados() {
        try {
            const response = await fetch(API_BASE);
            const empleados = await response.json();
            this.displayEmpleados(empleados);
        } catch (error) {
            this.showError('Error al cargar los empleados');
            console.error('Error:', error);
        }
    }

    displayEmpleados(empleados) {
        const listContainer = document.getElementById('empleados-list');
        const loading = document.getElementById('loading');
        
        if (loading) loading.style.display = 'none';

        if (!empleados || empleados.length === 0) {
            listContainer.innerHTML = '<p>No hay empleados registrados.</p>';
            return;
        }

        listContainer.innerHTML = empleados.map(empleado => `
            <div class="empleado-card" data-id="${empleado.id}">
                <div class="empleado-header">
                    <div class="empleado-nombre">${empleado.nombre} ${empleado.apellido}</div>
                    <div class="empleado-numero">${empleado.numero_empleado}</div>
                </div>
                <div class="empleado-departamento">${empleado.departamento}</div>
                <div class="empleado-actions">
                    <button class="btn-edit" onclick="empleadoManager.editEmpleado(${empleado.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn-delete" onclick="empleadoManager.deleteEmpleado(${empleado.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    async handleSubmit() {
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            departamento: document.getElementById('departamento').value,
            numero_empleado: document.getElementById('numero_empleado').value
        };

        try {
            let response;
            if (this.isEditing) {
                response = await fetch(`${API_BASE}/${this.currentEditId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetch(API_BASE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
            }

            const result = await response.json();

            if (response.ok) {
                this.showMessage(this.isEditing ? 'Empleado actualizado exitosamente' : 'Empleado agregado exitosamente', 'success');
                this.resetForm();
                this.loadEmpleados();
            } else {
                this.showError(result.error || 'Error al procesar la solicitud');
            }
        } catch (error) {
            this.showError('Error de conexión');
            console.error('Error:', error);
        }
    }

    async editEmpleado(id) {
        try {
            const response = await fetch(`${API_BASE}/${id}`);
            const empleado = await response.json();

            if (empleado.error) {
                this.showError(empleado.error);
                return;
            }

            document.getElementById('empleado-id').value = empleado.id;
            document.getElementById('nombre').value = empleado.nombre;
            document.getElementById('apellido').value = empleado.apellido;
            document.getElementById('departamento').value = empleado.departamento;
            document.getElementById('numero_empleado').value = empleado.numero_empleado;

            this.isEditing = true;
            this.currentEditId = id;
            document.getElementById('form-title').textContent = 'Editar Empleado';
            document.getElementById('submit-btn').textContent = 'Actualizar Empleado';
            document.getElementById('cancel-btn').style.display = 'inline-block';

            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            this.showError('Error al cargar el empleado');
            console.error('Error:', error);
        }
    }

    async deleteEmpleado(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('Empleado eliminado exitosamente', 'success');
                this.loadEmpleados();
            } else {
                this.showError(result.error || 'Error al eliminar el empleado');
            }
        } catch (error) {
            this.showError('Error de conexión');
            console.error('Error:', error);
        }
    }

    cancelEdit() {
        this.resetForm();
    }

    resetForm() {
        document.getElementById('empleado-form').reset();
        document.getElementById('empleado-id').value = '';
        this.isEditing = false;
        this.currentEditId = null;
        document.getElementById('form-title').textContent = 'Agregar Nuevo Empleado';
        document.getElementById('submit-btn').textContent = 'Agregar Empleado';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    showMessage(message, type) {
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;
        
        document.querySelector('.form-section').insertBefore(messageDiv, document.getElementById('empleado-form'));
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    clearMessages() {
        const messages = document.querySelectorAll('.error, .success');
        messages.forEach(msg => msg.remove());
    }
}

// Inicializar la aplicación
const empleadoManager = new EmpleadoManager();