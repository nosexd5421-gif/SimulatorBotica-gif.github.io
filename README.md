# Sistema Web para Botica

Este es un sistema web completo para la gestión de una botica, desarrollado con HTML, CSS, JavaScript y Bootstrap.

## Estructura del Proyecto

sistema-botica/
├── index.html # Página principal
├── styles.css # Estilos personalizados
├── script.js # Lógica de la aplicación
├── data.json # Datos iniciales
└── README.md # Este archivo

## Características

### Módulos del Sistema

1. **Dashboard**: 
   - Gráficas de medicamentos más y menos vendidos
   - Estadísticas generales (ventas del día, stock, alertas)
   - Actualización automática después de cada venta

2. **Ventas**:
   - Registro de ventas con selección de cliente y médico
   - Control de recetas médicas
   - Carrito de compras
   - Control de stock en tiempo real

3. **Inventario**:
   - Lista completa de medicamentos
   - Indicadores visuales de stock bajo y sin stock
   - Gestión de requerimiento de receta
   - Funciones para agregar, editar y eliminar medicamentos

4. **Clientes**:
   - Gestión de base de datos de clientes
   - Agregar, editar y eliminar clientes

5. **Médicos**:
   - Gestión de base de datos de médicos
   - Agregar, editar y eliminar médicos

### Funcionalidades Principales

- **Alertas automáticas**: Al ingresar al sistema, se muestran alertas de medicamentos con stock bajo o sin stock
- **Gráficas dinámicas**: Dos gráficas de barras que muestran los medicamentos más y menos vendidos
- **Actualización automática**: Las gráficas y estadísticas se actualizan después de cada venta
- **Control de recetas**: Validación de medicamentos que requieren receta médica
- **Interfaz moderna**: Diseño responsivo con Bootstrap
- **Gestión completa**: CRUD para medicamentos, clientes y médicos

## Instalación y Uso

1. Descargar todos los archivos en una carpeta
2. Abrir `index.html` en un navegador web
3. El sistema cargará automáticamente los datos iniciales desde `data.json`

## Datos Iniciales

El sistema incluye datos de ejemplo:
- 20 medicamentos con información de stock, precios, ventas y requerimiento de receta
- 10 médicos con diferentes especialidades
- 5 clientes de ejemplo

## Control de Recetas Médicas

- 🔴 Medicamentos que requieren receta
- 🟢 Medicamentos de venta libre
- Validación automática al realizar ventas
- Advertencias cuando se venden medicamentos controlados sin receta

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Chart.js para gráficas

## Notas de Desarrollo

- Los datos se almacenan en memoria durante la sesión (no hay persistencia)
- Para un entorno de producción, se recomienda implementar un backend con base de datos
- El sistema es completamente responsivo y funciona en dispositivos móviles

## Licencia

Este proyecto es de uso libre para fines educativos y comerciales.
