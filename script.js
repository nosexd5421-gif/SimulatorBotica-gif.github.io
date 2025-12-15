// Variables globales
let data = {
    medicamentos: [],
    boticarios: [],
    clientes: [],
    ventas: [],
    compras: [],
    tarjetasGuardadas: []
};

let carritoVenta = [];
let carritoCompras = [];
let graficaMasVendidos, graficaMenosVendidos, graficaTopClientes, graficaTopBoticarios;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando sistema...');
    cargarDatos();
    inicializarEventos();
});

// CARGAR DATOS CON PERSISTENCIA
async function cargarDatos() {
    try {
        console.log('📦 Intentando cargar datos persistentes...');
        
        // PRIMERO: Intentar cargar desde localStorage (datos guardados)
        const datosGuardados = localStorage.getItem('boticaData');
        
        if (datosGuardados) {
            console.log('✅ Cargando datos desde localStorage...');
            const parsedData = JSON.parse(datosGuardados);
            data = {
                ...parsedData,
                tarjetasGuardadas: parsedData.tarjetasGuardadas || []
            };
        } else {
            // SEGUNDO: Si no hay datos guardados, cargar datos de ejemplo
            console.log('📋 Cargando datos de ejemplo...');
            cargarDatosEjemplo();
        }
        
        console.log('✅ Datos cargados correctamente:');
        console.log(`- Medicamentos: ${data.medicamentos.length}`);
        console.log(`- Boticarios: ${data.boticarios.length}`);
        console.log(`- Clientes: ${data.clientes.length}`);
        console.log(`- Ventas: ${data.ventas.length}`);
        console.log(`- Compras: ${data.compras.length}`);
        console.log(`- Tarjetas guardadas: ${data.tarjetasGuardadas.length}`);
        
        inicializarInterfaz();
        
        // ✅ ALERTA AL CARGAR
        setTimeout(() => {
            verificarStockBajo();
        }, 500);
        
        actualizarDashboard();
        
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        cargarDatosEjemplo();
        inicializarInterfaz();
        actualizarDashboard();
    }
}

// GUARDAR DATOS EN LOCALSTORAGE
function guardarDatos() {
    try {
        localStorage.setItem('boticaData', JSON.stringify(data));
        console.log('💾 Datos guardados en localStorage');
    } catch (error) {
        console.error('❌ Error al guardar datos:', error);
    }
}

// Función de respaldo si data.json falla
function cargarDatosEjemplo() {
    console.log('🔄 Cargando datos de ejemplo...');
    
    data.medicamentos = [
        {"id": 1, "nombre": "Paracetamol 500mg", "precio": 5.50, "stock": 25, "stockMinimo": 10, "ventas": 120, "requiereReceta": false},
        {"id": 2, "nombre": "Ibuprofeno 400mg", "precio": 7.80, "stock": 18, "stockMinimo": 15, "ventas": 95, "requiereReceta": false},
        {"id": 3, "nombre": "Amoxicilina 500mg", "precio": 12.50, "stock": 8, "stockMinimo": 10, "ventas": 65, "requiereReceta": true},
        {"id": 4, "nombre": "Omeprazol 20mg", "precio": 15.20, "stock": 22, "stockMinimo": 12, "ventas": 78, "requiereReceta": false},
        {"id": 5, "nombre": "Loratadina 10mg", "precio": 8.90, "stock": 30, "stockMinimo": 15, "ventas": 110, "requiereReceta": false},
        {"id": 6, "nombre": "Metformina 850mg", "precio": 18.75, "stock": 14, "stockMinimo": 10, "ventas": 45, "requiereReceta": true},
        {"id": 7, "nombre": "Atorvastatina 20mg", "precio": 22.40, "stock": 9, "stockMinimo": 8, "ventas": 38, "requiereReceta": true},
        {"id": 8, "nombre": "Losartán 50mg", "precio": 16.80, "stock": 16, "stockMinimo": 12, "ventas": 52, "requiereReceta": true},
        {"id": 9, "nombre": "Salbutamol Inhalador", "precio": 28.50, "stock": 5, "stockMinimo": 6, "ventas": 29, "requiereReceta": true},
        {"id": 10, "nombre": "Aspirina 100mg", "precio": 6.20, "stock": 35, "stockMinimo": 20, "ventas": 135, "requiereReceta": false}
    ];
    
    data.boticarios = [
        {"id": 1, "nombre": "Carlos Mendoza", "especialidad": "Jefe de Botica", "telefono": "987654321"},
        {"id": 2, "nombre": "Ana López", "especialidad": "Boticaria Senior", "telefono": "987654322"},
        {"id": 3, "nombre": "Roberto Silva", "especialidad": "Auxiliar de Farmacia", "telefono": "987654323"}
    ];
    
    data.clientes = [
        {"id": 1, "nombre": "Juan Pérez", "email": "juan@email.com", "telefono": "912345678"},
        {"id": 2, "nombre": "María González", "email": "maria@email.com", "telefono": "912345679"},
        {"id": 3, "nombre": "Carlos Rodríguez", "email": "carlos@email.com", "telefono": "912345680"}
    ];
    
    data.ventas = [];
    data.compras = [];
    data.tarjetasGuardadas = [];
    
    // Guardar datos de ejemplo en localStorage
    guardarDatos();
    
    console.log('✅ Datos de ejemplo cargados y guardados:');
    console.log(`- ${data.medicamentos.length} medicamentos`);
    console.log(`- ${data.boticarios.length} boticarios`);
    console.log(`- ${data.clientes.length} clientes`);
}

// Inicializar eventos
function inicializarEventos() {
    // Navegación entre módulos
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            cambiarModulo(this.getAttribute('data-module'));
        });
    });
    
    // Eventos del módulo de ventas
    document.getElementById('medicamentoVenta').addEventListener('change', mostrarInfoMedicamento);
    document.getElementById('agregarProducto').addEventListener('click', agregarProductoCarrito);
    document.getElementById('finalizarVenta').addEventListener('click', finalizarVenta);
    
    // EVENTOS NUEVOS: Método de pago
    document.getElementById('efectivo').addEventListener('change', toggleDatosTarjeta);
    document.getElementById('tarjeta').addEventListener('change', toggleDatosTarjeta);
    
    // EVENTO NUEVO: Formatear número de tarjeta
    document.getElementById('numeroTarjeta').addEventListener('input', formatearNumeroTarjeta);
    
    // Eventos del módulo de compras
    document.getElementById('medicamentoCompra').addEventListener('change', mostrarInfoMedicamentoCompra);
    document.getElementById('agregarCompra').addEventListener('click', agregarProductoCompra);
    document.getElementById('finalizarCompra').addEventListener('click', finalizarCompra);
    
    // Eventos de modales
    document.getElementById('guardarMedicamento').addEventListener('click', guardarMedicamento);
    document.getElementById('guardarCliente').addEventListener('click', guardarCliente);
    document.getElementById('guardarBoticario').addEventListener('click', guardarBoticario);
}

// ==============================================
// FUNCIONES NUEVAS: MÉTODO DE PAGO
// ==============================================

// Mostrar/ocultar datos de tarjeta según método de pago seleccionado
function toggleDatosTarjeta() {
    const datosTarjeta = document.getElementById('datosTarjeta');
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
    
    if (metodoPago === 'tarjeta') {
        datosTarjeta.classList.remove('d-none');
    } else {
        datosTarjeta.classList.add('d-none');
        // Limpiar campos de tarjeta cuando se cambia a efectivo
        document.getElementById('bancoTarjeta').value = '';
        document.getElementById('numeroTarjeta').value = '';
        document.getElementById('guardarTarjeta').checked = false;
    }
}

// Formatear número de tarjeta (XXXX-XXXX-XXXX-XXXX)
function formatearNumeroTarjeta() {
    const input = document.getElementById('numeroTarjeta');
    let valor = input.value.replace(/\D/g, ''); // Eliminar todo excepto números
    
    // Tomar solo los últimos 4 dígitos si hay más
    if (valor.length > 4) {
        valor = valor.slice(-4);
    }
    
    // Formatear con guiones
    let formateado = '';
    for (let i = 0; i < valor.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formateado += '-';
        }
        formateado += valor[i];
    }
    
    input.value = formateado;
}

// Validar datos de tarjeta
function validarDatosTarjeta() {
    const banco = document.getElementById('bancoTarjeta').value;
    const numero = document.getElementById('numeroTarjeta').value.replace(/\D/g, '');
    
    if (!banco) {
        alert('Por favor, selecciona un banco');
        return false;
    }
    
    if (numero.length !== 4) {
        alert('Por favor, ingresa los últimos 4 dígitos de la tarjeta');
        return false;
    }
    
    return true;
}

// Obtener método de pago seleccionado
function obtenerMetodoPago() {
    const metodoSeleccionado = document.querySelector('input[name="metodoPago"]:checked');
    return metodoSeleccionado ? metodoSeleccionado.value : 'efectivo';
}

// Obtener datos de tarjeta si aplica
function obtenerDatosTarjeta() {
    const metodoPago = obtenerMetodoPago();
    
    if (metodoPago === 'efectivo') {
        return null;
    }
    
    // Validar que los datos de tarjeta sean correctos
    if (!validarDatosTarjeta()) {
        return null;
    }
    
    const banco = document.getElementById('bancoTarjeta').value;
    const numero = document.getElementById('numeroTarjeta').value;
    const guardar = document.getElementById('guardarTarjeta').checked;
    
    return {
        banco,
        numero,
        guardar
    };
}

// Cambiar entre módulos
function cambiarModulo(modulo) {
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-module="${modulo}"]`).classList.add('active');
    
    // Mostrar módulo seleccionado
    document.querySelectorAll('.module-content').forEach(content => {
        content.classList.add('d-none');
    });
    document.getElementById(modulo).classList.remove('d-none');
    
    // Actualizar datos específicos del módulo
    switch(modulo) {
        case 'inventario':
            actualizarTablaInventario();
            break;
        case 'clientes':
            actualizarTablaClientes();
            break;
        case 'boticarios':
            actualizarTablaBoticarios();
            break;
        case 'ventas':
            actualizarSelectsVenta();
            break;
        case 'compras':
            actualizarSelectsCompra();
            actualizarListaStockBajo();
            break;
        case 'dashboard':
            actualizarDashboard();
            verificarStockBajo();
            break;
    }
}

// Inicializar interfaz
function inicializarInterfaz() {
    console.log('🎨 Inicializando interfaz...');
    actualizarSelectsVenta();
    actualizarTablaInventario();
    actualizarTablaClientes();
    actualizarTablaBoticarios();
}

// ==============================================
// FUNCIÓN DE ALERTAS DE STOCK - VERSIÓN CORREGIDA
// ==============================================

// Verificar stock bajo y mostrar alerta
function verificarStockBajo() {
    console.log('🔍 Ejecutando verificarStockBajo()...');
    
    const medicamentosBajos = data.medicamentos.filter(m => m.stock < m.stockMinimo && m.stock > 0);
    const medicamentosSinStock = data.medicamentos.filter(m => m.stock === 0);
    
    console.log('📊 Resultados:');
    console.log('- Medicamentos con stock bajo:', medicamentosBajos.length);
    console.log('- Medicamentos sin stock:', medicamentosSinStock.length);
    
    if (medicamentosBajos.length > 0 || medicamentosSinStock.length > 0) {
        let mensaje = '';
        
        if (medicamentosBajos.length > 0) {
            mensaje += '⚠️ MEDICAMENTOS CON STOCK BAJO:\n\n';
            medicamentosBajos.forEach(m => {
                mensaje += `• ${m.nombre}\n  Stock: ${m.stock} | Mínimo: ${m.stockMinimo}\n\n`;
            });
        }
        
        if (medicamentosSinStock.length > 0) {
            mensaje += '🚨 MEDICAMENTOS SIN STOCK:\n\n';
            medicamentosSinStock.forEach(m => {
                mensaje += `• ${m.nombre}\n  Stock: ${m.stock} | Mínimo: ${m.stockMinimo}\n\n`;
            });
        }
        
        console.log('📢 Mostrando alerta...');
        alert('ALERTA DE INVENTARIO\n\n' + mensaje);
        
    } else {
        console.log('✅ Todo el stock está bien');
    }
}

// Actualizar dashboard
function actualizarDashboard() {
    console.log('📊 Actualizando dashboard completo...');
    
    // Actualizar estadísticas
    const totalVentasHoy = data.ventas
        .filter(v => esFechaHoy(v.fecha))
        .reduce((total, venta) => total + venta.total, 0);
    
    const totalMedicamentos = data.medicamentos.length;
    const stockBajo = data.medicamentos.filter(m => m.stock < m.stockMinimo && m.stock > 0).length;
    const sinStock = data.medicamentos.filter(m => m.stock === 0).length;
    
    document.getElementById('totalVentasHoy').textContent = `S/ ${totalVentasHoy.toFixed(2)}`;
    document.getElementById('totalMedicamentos').textContent = totalMedicamentos;
    document.getElementById('stockBajo').textContent = stockBajo;
    document.getElementById('sinStock').textContent = sinStock;
    
    // Actualizar gráficas
    actualizarGraficas();
}

// ==============================================
// FUNCIONES PARA GRÁFICOS - VERSIÓN MEJORADA
// ==============================================

// Actualizar todas las gráficas
function actualizarGraficas() {
    console.log('📊 Actualizando gráficas...');
    
    // Destruir gráficos existentes antes de crear nuevos
    if (graficaMasVendidos) {
        graficaMasVendidos.destroy();
    }
    if (graficaMenosVendidos) {
        graficaMenosVendidos.destroy();
    }
    if (graficaTopClientes) {
        graficaTopClientes.destroy();
    }
    if (graficaTopBoticarios) {
        graficaTopBoticarios.destroy();
    }
    
    // Gráficas existentes
    actualizarGraficasMedicamentos();
    
    // Nuevas gráficas
    actualizarGraficaTopClientes();
    actualizarGraficaTopBoticarios();
    
    console.log('✅ Todas las gráficas actualizadas');
}

// Gráficas de medicamentos (existente)
function actualizarGraficasMedicamentos() {
    // Ordenar medicamentos por ventas
    const medicamentosOrdenados = [...data.medicamentos].sort((a, b) => b.ventas - a.ventas);
    
    // Medicamentos más vendidos (top 5)
    const masVendidos = medicamentosOrdenados.slice(0, 5);
    const menosVendidos = medicamentosOrdenados.slice(-5).reverse();
    
    console.log('Más vendidos:', masVendidos.map(m => m.nombre));
    console.log('Menos vendidos:', menosVendidos.map(m => m.nombre));
    
    // Configuración de gráfica de más vendidos
    const ctxMasVendidos = document.getElementById('graficaMasVendidos').getContext('2d');
    
    graficaMasVendidos = new Chart(ctxMasVendidos, {
        type: 'bar',
        data: {
            labels: masVendidos.map(m => m.nombre),
            datasets: [{
                label: 'Unidades Vendidas',
                data: masVendidos.map(m => m.ventas),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Configuración de gráfica de menos vendidos
    const ctxMenosVendidos = document.getElementById('graficaMenosVendidos').getContext('2d');
    
    graficaMenosVendidos = new Chart(ctxMenosVendidos, {
        type: 'bar',
        data: {
            labels: menosVendidos.map(m => m.nombre),
            datasets: [{
                label: 'Unidades Vendidas',
                data: menosVendidos.map(m => m.ventas),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Gráfica de clientes que más compran
function actualizarGraficaTopClientes() {
    console.log('📈 Actualizando gráfica de top clientes...');
    
    // Calcular compras por cliente
    const comprasPorCliente = {};
    
    data.ventas.forEach(venta => {
        const clienteId = venta.clienteId;
        if (!comprasPorCliente[clienteId]) {
            comprasPorCliente[clienteId] = {
                totalCompras: 0,
                cantidadVentas: 0
            };
        }
        comprasPorCliente[clienteId].totalCompras += venta.total;
        comprasPorCliente[clienteId].cantidadVentas += 1;
    });
    
    // Crear array de clientes con sus compras
    const clientesConCompras = data.clientes.map(cliente => {
        const compras = comprasPorCliente[cliente.id] || { totalCompras: 0, cantidadVentas: 0 };
        return {
            ...cliente,
            totalCompras: compras.totalCompras,
            cantidadVentas: compras.cantidadVentas
        };
    });
    
    // Ordenar por total de compras (descendente) y tomar top 5
    const topClientes = clientesConCompras
        .sort((a, b) => b.totalCompras - a.totalCompras)
        .slice(0, 5);
    
    console.log('Top clientes:', topClientes);
    
    const ctxTopClientes = document.getElementById('graficaTopClientes');
    
    // Verificar si el canvas existe
    if (!ctxTopClientes) {
        console.error('❌ No se encontró el canvas para gráfica de clientes');
        return;
    }
    
    const context = ctxTopClientes.getContext('2d');
    
    // Verificar si hay datos para mostrar
    const tieneDatos = topClientes.some(cliente => cliente.totalCompras > 0);
    
    if (!tieneDatos) {
        console.log('📊 No hay datos de compras para clientes aún');
        // Mostrar mensaje de "no hay datos"
        context.clearRect(0, 0, ctxTopClientes.width, ctxTopClientes.height);
        context.font = '16px Arial';
        context.fillStyle = '#6c757d';
        context.textAlign = 'center';
        context.fillText('No hay datos de compras aún', ctxTopClientes.width / 2, ctxTopClientes.height / 2);
        return;
    }
    
    graficaTopClientes = new Chart(context, {
        type: 'bar',
        data: {
            labels: topClientes.map(c => {
                // Acortar nombres largos para mejor visualización
                const nombre = c.nombre.split(' ')[0];
                return nombre.length > 10 ? nombre.substring(0, 10) + '...' : nombre;
            }),
            datasets: [{
                label: 'Total en Compras (S/)',
                data: topClientes.map(c => c.totalCompras),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto en Soles (S/)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Clientes'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const cliente = topClientes[context.dataIndex];
                            return [
                                `Total: S/ ${context.parsed.y.toFixed(2)}`,
                                `Compras: ${cliente.cantidadVentas}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Gráfica de boticarios que más venden
function actualizarGraficaTopBoticarios() {
    console.log('📈 Actualizando gráfica de top boticarios...');
    
    // Calcular ventas por boticario
    const ventasPorBoticario = {};
    
    data.ventas.forEach(venta => {
        const boticarioId = venta.boticarioId;
        if (boticarioId) { // Solo contar ventas con boticario asignado
            if (!ventasPorBoticario[boticarioId]) {
                ventasPorBoticario[boticarioId] = {
                    totalVentas: 0,
                    cantidadVentas: 0,
                    cantidadMedicamentos: 0
                };
            }
            ventasPorBoticario[boticarioId].totalVentas += venta.total;
            ventasPorBoticario[boticarioId].cantidadVentas += 1;
            ventasPorBoticario[boticarioId].cantidadMedicamentos += venta.productos.reduce((sum, p) => sum + p.cantidad, 0);
        }
    });
    
    // Crear array de boticarios con sus ventas
    const boticariosConVentas = data.boticarios.map(boticario => {
        const ventas = ventasPorBoticario[boticario.id] || { 
            totalVentas: 0, 
            cantidadVentas: 0, 
            cantidadMedicamentos: 0 
        };
        return {
            ...boticario,
            totalVentas: ventas.totalVentas,
            cantidadVentas: ventas.cantidadVentas,
            cantidadMedicamentos: ventas.cantidadMedicamentos
        };
    });
    
    // Ordenar por cantidad de medicamentos vendidos (descendente) y tomar top 5
    const topBoticarios = boticariosConVentas
        .sort((a, b) => b.cantidadMedicamentos - a.cantidadMedicamentos)
        .slice(0, 5);
    
    console.log('Top boticarios:', topBoticarios);
    
    const ctxTopBoticarios = document.getElementById('graficaTopBoticarios');
    
    // Verificar si el canvas existe
    if (!ctxTopBoticarios) {
        console.error('❌ No se encontró el canvas para gráfica de boticarios');
        return;
    }
    
    const context = ctxTopBoticarios.getContext('2d');
    
    // Verificar si hay datos para mostrar
    const tieneDatos = topBoticarios.some(boticario => boticario.cantidadMedicamentos > 0);
    
    if (!tieneDatos) {
        console.log('📊 No hay datos de ventas para boticarios aún');
        // Mostrar mensaje de "no hay datos"
        context.clearRect(0, 0, ctxTopBoticarios.width, ctxTopBoticarios.height);
        context.font = '16px Arial';
        context.fillStyle = '#6c757d';
        context.textAlign = 'center';
        context.fillText('No hay datos de ventas aún', ctxTopBoticarios.width / 2, ctxTopBoticarios.height / 2);
        return;
    }
    
    graficaTopBoticarios = new Chart(context, {
        type: 'bar',
        data: {
            labels: topBoticarios.map(b => {
                // Simplificar nombres de boticarios
                const nombre = b.nombre.split(' ')[0];
                return nombre.length > 10 ? nombre.substring(0, 10) + '...' : nombre;
            }),
            datasets: [{
                label: 'Medicamentos Vendidos',
                data: topBoticarios.map(b => b.cantidadMedicamentos),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de Medicamentos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Boticarios'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const boticario = topBoticarios[context.dataIndex];
                            return [
                                `Medicamentos: ${context.parsed.y}`,
                                `Ventas: S/ ${boticario.totalVentas.toFixed(2)}`,
                                `Atenciones: ${boticario.cantidadVentas}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// ==============================================
// FUNCIONES PARA EL MÓDULO DE VENTAS
// ==============================================

// Actualizar selects en módulo de ventas
function actualizarSelectsVenta() {
    const selectMedicamentos = document.getElementById('medicamentoVenta');
    const selectClientes = document.getElementById('clienteVenta');
    const selectBoticarios = document.getElementById('boticarioVenta');
    
    // Limpiar selects
    selectMedicamentos.innerHTML = '<option value="">Seleccionar medicamento</option>';
    selectClientes.innerHTML = '<option value="">Seleccionar cliente</option>';
    selectBoticarios.innerHTML = '<option value="">Seleccionar boticario</option>';
    
    // Llenar medicamentos con stock
    data.medicamentos.filter(m => m.stock > 0).forEach(medicamento => {
        const option = document.createElement('option');
        option.value = medicamento.id;
        const recetaIndicator = medicamento.requiereReceta ? ' 🔴' : ' 🟢';
        option.textContent = `${medicamento.nombre}${recetaIndicator} - S/ ${medicamento.precio.toFixed(2)} (Stock: ${medicamento.stock})`;
        selectMedicamentos.appendChild(option);
    });
    
    // Llenar clientes
    data.clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nombre;
        selectClientes.appendChild(option);
    });
    
    // Llenar boticarios
    data.boticarios.forEach(boticario => {
        const option = document.createElement('option');
        option.value = boticario.id;
        option.textContent = `${boticario.nombre} - ${boticario.especialidad}`;
        selectBoticarios.appendChild(option);
    });
}

// Mostrar información del medicamento seleccionado
function mostrarInfoMedicamento() {
    const medicamentoId = document.getElementById('medicamentoVenta').value;
    const infoProducto = document.getElementById('infoProducto');
    
    if (!medicamentoId) {
        infoProducto.innerHTML = '<p class="text-muted">Selecciona un medicamento para ver información detallada</p>';
        return;
    }
    
    const medicamento = data.medicamentos.find(m => m.id == medicamentoId);
    
    if (medicamento) {
        const requiereReceta = medicamento.requiereReceta ? 'Sí' : 'No';
        const recetaClass = medicamento.requiereReceta ? 'text-danger' : 'text-success';
        
        infoProducto.innerHTML = `
            <div class="medicamento-info">
                <h6>${medicamento.nombre}</h6>
                <p><strong>Precio:</strong> S/ ${medicamento.precio.toFixed(2)}</p>
                <p><strong>Stock disponible:</strong> ${medicamento.stock} unidades</p>
                <p><strong>Stock mínimo:</strong> ${medicamento.stockMinimo} unidades</p>
                <p><strong>Ventas totales:</strong> ${medicamento.ventas} unidades</p>
                <p><strong>Requiere receta:</strong> <span class="${recetaClass} fw-bold">${requiereReceta}</span></p>
            </div>
        `;
    }
}

// Agregar producto al carrito
function agregarProductoCarrito() {
    const medicamentoId = document.getElementById('medicamentoVenta').value;
    const cantidad = parseInt(document.getElementById('cantidadVenta').value);
    
    if (!medicamentoId) {
        alert('Por favor, selecciona un medicamento');
        return;
    }
    
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingresa una cantidad válida');
        return;
    }
    
    const medicamento = data.medicamentos.find(m => m.id == medicamentoId);
    
    if (cantidad > medicamento.stock) {
        alert(`No hay suficiente stock. Stock disponible: ${medicamento.stock}`);
        return;
    }
    
    // Verificar si el medicamento ya está en el carrito
    const itemExistente = carritoVenta.find(item => item.medicamentoId == medicamentoId);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carritoVenta.push({
            medicamentoId: medicamentoId,
            nombre: medicamento.nombre,
            precio: medicamento.precio,
            cantidad: cantidad,
            subtotal: medicamento.precio * cantidad
        });
    }
    
    actualizarDetalleVenta();
    document.getElementById('medicamentoVenta').value = '';
    document.getElementById('cantidadVenta').value = 1;
    document.getElementById('infoProducto').innerHTML = '<p class="text-muted">Selecciona un medicamento para ver información detallada</p>';
}

// Actualizar detalle de venta
function actualizarDetalleVenta() {
    const detalleVenta = document.getElementById('detalleVenta');
    const totalVenta = document.getElementById('totalVenta');
    
    detalleVenta.innerHTML = '';
    
    let total = 0;
    let hayMedicamentosConReceta = false;
    
    carritoVenta.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const medicamento = data.medicamentos.find(m => m.id == item.medicamentoId);
        const requiereReceta = medicamento && medicamento.requiereReceta;
        
        if (requiereReceta) {
            hayMedicamentosConReceta = true;
        }
        
        const recetaIcon = requiereReceta ? ' 🔴' : '';
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.nombre}${recetaIcon}</td>
            <td>${item.cantidad}</td>
            <td>S/ ${item.precio.toFixed(2)}</td>
            <td>S/ ${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="eliminarProductoCarrito(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        detalleVenta.appendChild(fila);
    });
    
    // Mostrar advertencia si hay medicamentos que requieren receta
    const conRecetaCheckbox = document.getElementById('conReceta');
    if (hayMedicamentosConReceta && !conRecetaCheckbox.checked) {
        const advertencia = document.createElement('tr');
        advertencia.className = 'table-warning';
        advertencia.innerHTML = `
            <td colspan="5" class="text-center">
                <small><i class="bi bi-exclamation-triangle"></i> Algunos medicamentos en el carrito requieren receta médica</small>
            </td>
        `;
        detalleVenta.appendChild(advertencia);
    }
    
    totalVenta.textContent = total.toFixed(2);
}

// Eliminar producto del carrito
function eliminarProductoCarrito(index) {
    carritoVenta.splice(index, 1);
    actualizarDetalleVenta();
}

// ==============================================
// FUNCIÓN PRINCIPAL: FINALIZAR VENTA CON PDF
// ==============================================

// Finalizar venta - VERSIÓN ACTUALIZADA CON PDF
function finalizarVenta() {
    if (carritoVenta.length === 0) {
        alert('No hay productos en el carrito');
        return;
    }

    const clienteId = document.getElementById('clienteVenta').value;
    const boticarioId = document.getElementById('boticarioVenta').value;
    const conReceta = document.getElementById('conReceta').checked;

    if (!clienteId || !boticarioId) {
        alert('Por favor, selecciona un cliente y el boticario que atiende');
        return;
    }

    // Validar medicamentos que requieren receta
    if (!conReceta) {
        const medicamentosConReceta = carritoVenta.filter(item => {
            const medicamento = data.medicamentos.find(m => m.id == item.medicamentoId);
            return medicamento && medicamento.requiereReceta;
        });

        if (medicamentosConReceta.length > 0) {
            const nombresMedicamentos = medicamentosConReceta.map(item => item.nombre).join(', ');
            if (!confirm(`Los siguientes medicamentos requieren receta médica: ${nombresMedicamentos}\n\n¿Deseas continuar sin receta?`)) {
                return;
            }
        }
    }

    // Obtener método de pago
    const metodoPago = obtenerMetodoPago();
    const datosTarjeta = obtenerDatosTarjeta();

    if (metodoPago === 'tarjeta' && !datosTarjeta) {
        return; // La validación ya mostró alerta
    }

    // Calcular total
    const total = carritoVenta.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Crear venta
    const venta = {
        id: generarId(),
        fecha: new Date().toISOString(),
        clienteId: parseInt(clienteId),
        boticarioId: parseInt(boticarioId),
        productos: [...carritoVenta],
        conReceta: conReceta,
        metodoPago: metodoPago,
        datosTarjeta: datosTarjeta,
        total: total
    };

    // Guardar tarjeta si el cliente lo solicitó
    if (datosTarjeta && datosTarjeta.guardar) {
        const cliente = data.clientes.find(c => c.id == clienteId);
        if (cliente) {
            const tarjetaGuardada = {
                id: generarId(),
                clienteId: cliente.id,
                clienteNombre: cliente.nombre,
                banco: datosTarjeta.banco,
                ultimosDigitos: datosTarjeta.numero.replace(/\D/g, '').slice(-4),
                fechaGuardado: new Date().toISOString()
            };

            // Verificar si ya existe esta tarjeta para este cliente
            const existe = data.tarjetasGuardadas.some(t => 
                t.clienteId === cliente.id && 
                t.ultimosDigitos === tarjetaGuardada.ultimosDigitos
            );

            if (!existe) {
                data.tarjetasGuardadas.push(tarjetaGuardada);
                console.log('💳 Tarjeta guardada para cliente:', cliente.nombre);
            }
        }
    }

    // Actualizar stock y ventas de medicamentos
    carritoVenta.forEach(item => {
        const medicamento = data.medicamentos.find(m => m.id == item.medicamentoId);
        if (medicamento) {
            medicamento.stock -= item.cantidad;
            medicamento.ventas += item.cantidad;
        }
    });

    // Agregar venta a los datos
    data.ventas.push(venta);

    // GUARDAR DATOS DESPUÉS DE LA VENTA
    guardarDatos();

    // ✅ ACTUALIZAR DASHBOARD
    actualizarDashboard();

    // ✅ ALERTA DE STOCK
    verificarStockBajo();

    // ✅ GENERAR COMPROBANTE PDF EN NUEVA PESTAÑA
    generarComprobantePDF(venta);

    // Limpiar carrito y formulario
    carritoVenta = [];
    actualizarDetalleVenta();
    document.getElementById('clienteVenta').value = '';
    document.getElementById('boticarioVenta').value = '';
    document.getElementById('conReceta').checked = false;

    // Resetear método de pago a efectivo
    document.getElementById('efectivo').checked = true;
    toggleDatosTarjeta(); // Ocultar datos de tarjeta

    // Actualizar interfaz
    actualizarTablaInventario();
    actualizarSelectsVenta();

    // Mostrar mensaje de confirmación
    let mensaje = `✅ Venta registrada exitosamente\n`;
    mensaje += `💰 Total: S/ ${total.toFixed(2)}\n`;
    mensaje += `💳 Método de pago: ${metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta'}\n`;
    mensaje += `📄 Comprobante PDF generado automáticamente`;

    if (metodoPago === 'tarjeta') {
        mensaje += `\n🏦 Banco: ${datosTarjeta.banco}`;
    }

    alert(mensaje);
}

// ==============================================
// FUNCIÓN PARA GENERAR COMPROBANTE EN PDF
// ==============================================

function generarComprobantePDF(venta) {
    // Obtener información del cliente y boticario
    const cliente = data.clientes.find(c => c.id == venta.clienteId) || { nombre: 'Cliente no especificado' };
    const boticario = data.boticarios.find(b => b.id == venta.boticarioId) || { nombre: 'Boticario no especificado' };
    
    // Crear instancia de jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;
    
    // Encabezado del comprobante
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BOTICA SALUD TOTAL', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('RUC: 12345678901', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('Av. Principal 123, Lima - Perú', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('Teléfono: (01) 456-7890 | Email: info@boticasaludtotal.com', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
    
    // Línea separadora
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // Información de la venta
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPROBANTE DE VENTA', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Columna izquierda
    const fecha = new Date(venta.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-PE');
    const horaFormateada = fecha.toLocaleTimeString('es-PE');
    
    doc.text(`Fecha: ${fechaFormateada}`, margin, yPos);
    doc.text(`Hora: ${horaFormateada}`, margin, yPos + 5);
    doc.text(`N° Comprobante: ${venta.id.toString().padStart(6, '0')}`, margin, yPos + 10);
    
    // Columna derecha
    doc.text(`Cliente: ${cliente.nombre}`, pageWidth - margin, yPos, { align: 'right' });
    doc.text(`Boticario: ${boticario.nombre}`, pageWidth - margin, yPos + 5, { align: 'right' });
    doc.text(`Tipo Venta: ${venta.conReceta ? 'Con receta' : 'Sin receta'}`, pageWidth - margin, yPos + 10, { align: 'right' });
    doc.text(`Método de Pago: ${venta.metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta'}`, pageWidth - margin, yPos + 15, { align: 'right' });
    
    yPos += 25;
    
    // Tabla de productos
    const headers = [['#', 'Descripción', 'Cantidad', 'P. Unitario', 'Subtotal']];
    const rows = [];
    
    venta.productos.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        rows.push([
            index + 1,
            item.nombre,
            item.cantidad.toString(),
            `S/ ${item.precio.toFixed(2)}`,
            `S/ ${subtotal.toFixed(2)}`
        ]);
    });
    
    // Agregar fila del total
    rows.push(['', '', '', 'TOTAL:', `S/ ${venta.total.toFixed(2)}`]);
    
    // Usar autoTable para generar la tabla
    doc.autoTable({
        startY: yPos,
        head: headers,
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [13, 110, 253] }, // Color azul
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 80 },
            2: { cellWidth: 25 },
            3: { cellWidth: 35 },
            4: { cellWidth: 35 }
        },
        margin: { left: margin, right: margin }
    });
    
    // Actualizar posición Y después de la tabla
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Información adicional
    doc.setFontSize(9);
    doc.text('Observaciones:', margin, yPos);
    yPos += 5;
    
    let observaciones = 'Sin observaciones';
    const medicamentosConReceta = venta.productos.filter(item => {
        const medicamento = data.medicamentos.find(m => m.id == item.medicamentoId);
        return medicamento && medicamento.requiereReceta;
    });
    
    if (medicamentosConReceta.length > 0) {
        observaciones = venta.conReceta 
            ? 'Venta con receta médica verificada' 
            : 'ADVERTENCIA: Algunos medicamentos requieren receta médica';
    }
    
    doc.text(observaciones, margin + 5, yPos);
    yPos += 10;
    
    // Pie de página
    doc.setFontSize(8);
    doc.text('¡Gracias por su preferencia!', pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Este documento es un comprobante de venta', pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Conserve este comprobante para cualquier reclamo', pageWidth / 2, yPos, { align: 'center' });
    
    // Generar nombre del archivo
    const nombreArchivo = `comprobante_${venta.id}_${fechaFormateada.replace(/\//g, '-')}.pdf`;
    
    // Abrir PDF en nueva ventana (como Blob)
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Abrir en nueva pestaña
    const nuevaVentana = window.open(pdfUrl, '_blank');
    
    // Intentar forzar la descarga si no se puede abrir en nueva pestaña
    if (!nuevaVentana || nuevaVentana.closed || typeof nuevaVentana.closed === 'undefined') {
        // Si el navegador bloquea la ventana emergente, ofrecer descarga
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = nombreArchivo;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    
    // Limpiar URL después de un tiempo
    setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
    }, 1000);
    
    console.log('✅ Comprobante PDF generado exitosamente');
}

// ==============================================
// FUNCIONES PARA EL MÓDULO DE COMPRAS
// ==============================================

// Actualizar selects en módulo de compras
function actualizarSelectsCompra() {
    const selectMedicamentos = document.getElementById('medicamentoCompra');
    
    // Limpiar select
    selectMedicamentos.innerHTML = '<option value="">Seleccionar medicamento</option>';
    
    // Llenar todos los medicamentos (incluyendo sin stock)
    data.medicamentos.forEach(medicamento => {
        const option = document.createElement('option');
        option.value = medicamento.id;
        const stockInfo = medicamento.stock === 0 ? ' (SIN STOCK)' : 
                         medicamento.stock < medicamento.stockMinimo ? ' (STOCK BAJO)' : '';
        option.textContent = `${medicamento.nombre} - Stock: ${medicamento.stock}${stockInfo}`;
        selectMedicamentos.appendChild(option);
    });
}

// Mostrar información del medicamento seleccionado en compras
function mostrarInfoMedicamentoCompra() {
    const medicamentoId = document.getElementById('medicamentoCompra').value;
    const infoMedicamento = document.getElementById('infoMedicamentoCompra');
    
    if (!medicamentoId) {
        infoMedicamento.innerHTML = '<p class="text-muted">Selecciona un medicamento para ver información</p>';
        return;
    }
    
    const medicamento = data.medicamentos.find(m => m.id == medicamentoId);
    
    if (medicamento) {
        const requiereReceta = medicamento.requiereReceta ? 'Sí' : 'No';
        const recetaClass = medicamento.requiereReceta ? 'text-danger' : 'text-success';
        const stockClass = medicamento.stock === 0 ? 'text-danger' : 
                          medicamento.stock < medicamento.stockMinimo ? 'text-warning' : 'text-success';
        
        infoMedicamento.innerHTML = `
            <div class="medicamento-info">
                <h6>${medicamento.nombre}</h6>
                <p><strong>Stock actual:</strong> <span class="${stockClass}">${medicamento.stock} unidades</span></p>
                <p><strong>Stock mínimo:</strong> ${medicamento.stockMinimo} unidades</p>
                <p><strong>Precio de venta:</strong> S/ ${medicamento.precio.toFixed(2)}</p>
                <p><strong>Requiere receta:</strong> <span class="${recetaClass}">${requiereReceta}</span></p>
                <p><strong>Ventas totales:</strong> ${medicamento.ventas} unidades</p>
            </div>
        `;
    }
}

// Actualizar lista de medicamentos con stock bajo
function actualizarListaStockBajo() {
    const listaStockBajo = document.getElementById('listaStockBajo');
    const medicamentosBajos = data.medicamentos.filter(m => m.stock < m.stockMinimo);
    
    if (medicamentosBajos.length === 0) {
        listaStockBajo.innerHTML = '<p class="text-success">✅ Todos los medicamentos tienen stock suficiente</p>';
        return;
    }
    
    let html = '';
    medicamentosBajos.forEach(medicamento => {
        const alertClass = medicamento.stock === 0 ? 'stock-critical' : 'stock-alert';
        html += `
            <div class="${alertClass}">
                <strong>${medicamento.nombre}</strong><br>
                <small>Stock: ${medicamento.stock} | Mínimo: ${medicamento.stockMinimo}</small>
            </div>
        `;
    });
    
    listaStockBajo.innerHTML = html;
}

// Agregar producto al carrito de compras
function agregarProductoCompra() {
    const medicamentoId = document.getElementById('medicamentoCompra').value;
    const cantidad = parseInt(document.getElementById('cantidadCompra').value);
    const precioCompra = parseFloat(document.getElementById('precioCompra').value);
    const proveedor = document.getElementById('proveedorCompra').value.trim();
    
    if (!medicamentoId) {
        alert('Por favor, selecciona un medicamento');
        return;
    }
    
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingresa una cantidad válida');
        return;
    }
    
    if (isNaN(precioCompra) || precioCompra <= 0) {
        alert('Por favor, ingresa un precio de compra válido');
        return;
    }
    
    if (!proveedor) {
        alert('Por favor, ingresa el nombre del proveedor');
        return;
    }
    
    const medicamento = data.medicamentos.find(m => m.id == medicamentoId);
    
    // Verificar si el medicamento ya está en el carrito de compras
    const itemExistente = carritoCompras.find(item => item.medicamentoId == medicamentoId && item.proveedor === proveedor);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
        itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioCompra;
    } else {
        carritoCompras.push({
            medicamentoId: medicamentoId,
            nombre: medicamento.nombre,
            cantidad: cantidad,
            precioCompra: precioCompra,
            proveedor: proveedor,
            subtotal: precioCompra * cantidad
        });
    }
    
    actualizarDetalleCompra();
    
    // Limpiar formulario (excepto proveedor)
    document.getElementById('medicamentoCompra').value = '';
    document.getElementById('cantidadCompra').value = 1;
    document.getElementById('precioCompra').value = '';
    document.getElementById('infoMedicamentoCompra').innerHTML = '<p class="text-muted">Selecciona un medicamento para ver información</p>';
}

// Actualizar detalle de compra
function actualizarDetalleCompra() {
    const detalleCompra = document.getElementById('detalleCompra');
    const totalCompra = document.getElementById('totalCompra');
    
    detalleCompra.innerHTML = '';
    
    let total = 0;
    
    carritoCompras.forEach((item, index) => {
        total += item.subtotal;
        
        const fila = document.createElement('tr');
        fila.className = 'compra-item';
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>S/ ${item.precioCompra.toFixed(2)}</td>
            <td>S/ ${item.subtotal.toFixed(2)}</td>
            <td><span class="proveedor-info">${item.proveedor}</span></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="eliminarProductoCompra(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        detalleCompra.appendChild(fila);
    });
    
    totalCompra.textContent = total.toFixed(2);
}

// Eliminar producto del carrito de compras
function eliminarProductoCompra(index) {
    carritoCompras.splice(index, 1);
    actualizarDetalleCompra();
}

// Finalizar compra
function finalizarCompra() {
    if (carritoCompras.length === 0) {
        alert('No hay productos en el carrito de compras');
        return;
    }
    
    // Calcular total
    const total = carritoCompras.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Crear compra
    const compra = {
        id: generarId(),
        fecha: new Date().toISOString(),
        productos: [...carritoCompras],
        total: total,
        proveedor: carritoCompras[0].proveedor // Tomar el primer proveedor como principal
    };
    
    // Actualizar stock de medicamentos
    carritoCompras.forEach(item => {
        const medicamento = data.medicamentos.find(m => m.id == item.medicamentoId);
        if (medicamento) {
            medicamento.stock += item.cantidad;
        }
    });
    
    // Agregar compra a los datos
    if (!data.compras) data.compras = [];
    data.compras.push(compra);
    
    // GUARDAR DATOS
    guardarDatos();
    
    // ACTUALIZAR DASHBOARD DESPUÉS DE COMPRA
    actualizarDashboard();
    
    // ALERTA INMEDIATA DESPUÉS DE COMPRA
    verificarStockBajo();
    
    // Limpiar carrito y formulario
    carritoCompras = [];
    actualizarDetalleCompra();
    document.getElementById('proveedorCompra').value = '';
    
    // Actualizar interfaz
    actualizarTablaInventario();
    actualizarSelectsVenta();
    actualizarSelectsCompra();
    actualizarListaStockBajo();
    
    alert(`✅ Compra registrada exitosamente\n💰 Total: S/ ${total.toFixed(2)}\n📦 Stock actualizado correctamente.`);
}

// ==============================================
// FUNCIONES PARA INVENTARIO, CLIENTES Y BOTICARIOS
// ==============================================

// Actualizar tabla de inventario
function actualizarTablaInventario() {
    const tablaInventario = document.getElementById('tablaInventario');
    
    tablaInventario.innerHTML = '';
    
    data.medicamentos.forEach(medicamento => {
        const fila = document.createElement('tr');
        
        // Determinar clase según stock
        let claseFila = '';
        if (medicamento.stock === 0) {
            claseFila = 'sin-stock';
        } else if (medicamento.stock < medicamento.stockMinimo) {
            claseFila = 'stock-bajo';
        }
        
        const recetaIcon = medicamento.requiereReceta ? ' 🔴' : ' 🟢';
        const recetaText = medicamento.requiereReceta ? 'Sí' : 'No';
        const recetaClass = medicamento.requiereReceta ? 'receta-requerida' : 'receta-no-requerida';
        
        fila.className = claseFila;
        fila.innerHTML = `
            <td>${medicamento.id}</td>
            <td>${medicamento.nombre}${recetaIcon}</td>
            <td>S/ ${medicamento.precio.toFixed(2)}</td>
            <td>${medicamento.stock}</td>
            <td>${medicamento.stockMinimo}</td>
            <td>${medicamento.ventas}</td>
            <td><span class="${recetaClass}">${recetaText}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarMedicamento(${medicamento.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarMedicamento(${medicamento.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tablaInventario.appendChild(fila);
    });
}

// Actualizar tabla de clientes
function actualizarTablaClientes() {
    const tablaClientes = document.getElementById('tablaClientes');
    
    tablaClientes.innerHTML = '';
    
    data.clientes.forEach(cliente => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.email || '-'}</td>
            <td>${cliente.telefono || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarCliente(${cliente.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarCliente(${cliente.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tablaClientes.appendChild(fila);
    });
}

// Actualizar tabla de boticarios
function actualizarTablaBoticarios() {
    const tablaBoticarios = document.getElementById('tablaBoticarios');
    
    tablaBoticarios.innerHTML = '';
    
    data.boticarios.forEach(boticario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${boticario.id}</td>
            <td>${boticario.nombre}</td>
            <td>${boticario.especialidad}</td>
            <td>${boticario.telefono || '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarBoticario(${boticario.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarBoticario(${boticario.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tablaBoticarios.appendChild(fila);
    });
}

// Guardar nuevo medicamento
function guardarMedicamento() {
    const nombre = document.getElementById('nombreMedicamento').value;
    const precio = parseFloat(document.getElementById('precioMedicamento').value);
    const stock = parseInt(document.getElementById('stockMedicamento').value);
    const stockMinimo = parseInt(document.getElementById('stockMinimoMedicamento').value);
    const requiereReceta = document.getElementById('requiereRecetaMedicamento').checked;
    
    if (!nombre || isNaN(precio) || isNaN(stock) || isNaN(stockMinimo)) {
        alert('Por favor, completa todos los campos correctamente');
        return;
    }
    
    const nuevoMedicamento = {
        id: generarId(),
        nombre: nombre,
        precio: precio,
        stock: stock,
        stockMinimo: stockMinimo,
        ventas: 0,
        requiereReceta: requiereReceta
    };
    
    data.medicamentos.push(nuevoMedicamento);
    
    // GUARDAR DATOS
    guardarDatos();
    
    // Cerrar modal y limpiar formulario
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarMedicamento'));
    modal.hide();
    document.getElementById('formAgregarMedicamento').reset();
    
    // Actualizar interfaz
    actualizarTablaInventario();
    actualizarSelectsVenta();
    actualizarDashboard();
    
    alert('✅ Medicamento agregado exitosamente');
}

// Guardar nuevo cliente
function guardarCliente() {
    const nombre = document.getElementById('nombreCliente').value;
    const email = document.getElementById('emailCliente').value;
    const telefono = document.getElementById('telefonoCliente').value;
    
    if (!nombre) {
        alert('Por favor, ingresa al menos el nombre del cliente');
        return;
    }
    
    const nuevoCliente = {
        id: generarId(),
        nombre: nombre,
        email: email,
        telefono: telefono
    };
    
    data.clientes.push(nuevoCliente);
    
    // GUARDAR DATOS
    guardarDatos();
    
    // Cerrar modal y limpiar formulario
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarCliente'));
    modal.hide();
    document.getElementById('formAgregarCliente').reset();
    
    // Actualizar interfaz
    actualizarTablaClientes();
    actualizarSelectsVenta();
    
    alert('✅ Cliente agregado exitosamente');
}

// Guardar nuevo boticario
function guardarBoticario() {
    const nombre = document.getElementById('nombreBoticario').value;
    const especialidad = document.getElementById('especialidadBoticario').value;
    const telefono = document.getElementById('telefonoBoticario').value;
    
    if (!nombre || !especialidad) {
        alert('Por favor, completa al menos el nombre y especialidad del boticario');
        return;
    }
    
    const nuevoBoticario = {
        id: generarId(),
        nombre: nombre,
        especialidad: especialidad,
        telefono: telefono
    };
    
    data.boticarios.push(nuevoBoticario);
    
    // GUARDAR DATOS
    guardarDatos();
    
    // Cerrar modal y limpiar formulario
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarBoticario'));
    modal.hide();
    document.getElementById('formAgregarBoticario').reset();
    
    // Actualizar interfaz
    actualizarTablaBoticarios();
    actualizarSelectsVenta();
    
    alert('✅ Boticario agregado exitosamente');
}

// Funciones auxiliares
function generarId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function esFechaHoy(fechaString) {
    const fecha = new Date(fechaString);
    const hoy = new Date();
    
    return fecha.getDate() === hoy.getDate() &&
           fecha.getMonth() === hoy.getMonth() &&
           fecha.getFullYear() === hoy.getFullYear();
}

// Funciones de edición y eliminación
function editarMedicamento(id) {
    alert(`📝 Editar medicamento con ID: ${id} - Funcionalidad en desarrollo`);
}

function eliminarMedicamento(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este medicamento?')) {
        data.medicamentos = data.medicamentos.filter(m => m.id !== id);
        
        // GUARDAR DATOS
        guardarDatos();
        
        actualizarTablaInventario();
        actualizarSelectsVenta();
        actualizarDashboard();
        alert('✅ Medicamento eliminado exitosamente');
    }
}

function editarCliente(id) {
    alert(`📝 Editar cliente con ID: ${id} - Funcionalidad en desarrollo`);
}

function eliminarCliente(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
        data.clientes = data.clientes.filter(c => c.id !== id);
        
        // GUARDAR DATOS
        guardarDatos();
        
        actualizarTablaClientes();
        actualizarSelectsVenta();
        alert('✅ Cliente eliminado exitosamente');
    }
}

function editarBoticario(id) {
    alert(`📝 Editar boticario con ID: ${id} - Funcionalidad en desarrollo`);
}

function eliminarBoticario(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este boticario?')) {
        data.boticarios = data.boticarios.filter(b => b.id !== id);
        
        // GUARDAR DATOS
        guardarDatos();
        
        actualizarTablaBoticarios();
        actualizarSelectsVenta();
        alert('✅ Boticario eliminado exitosamente');
    }
}

// Función de emergencia para verificar carga
function verificarCarga() {
    console.log('🔍 Verificando carga de datos...');
    console.log('Medicamentos:', data.medicamentos.length);
    console.log('Boticarios:', data.boticarios.length);
    console.log('Clientes:', data.clientes.length);
    
    if (data.medicamentos.length === 0) {
        console.log('⚠️ No hay datos, recargando...');
        cargarDatosEjemplo();
        inicializarInterfaz();
        actualizarDashboard();
    }
}

// Verificar después de 3 segundos por si hay problemas
setTimeout(verificarCarga, 3000);