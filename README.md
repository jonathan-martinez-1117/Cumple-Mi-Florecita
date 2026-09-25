# Nuevo Proyecto Web / Dashboard Interactivo (SPA)

Proyecto web independiente y desacoplado, estructurado con una arquitectura moderna de **Single Page Application (SPA)**, soporte para tema claro/oscuro, componentes responsivos y diseño de interfaz premium.

---

## 📁 Estructura del Proyecto

```text
c:\xampp\htdocs\mi-proyecto-web\
├── index.html           # Estructura HTML5 principal con navegación y vistas SPA
├── styles/
│   └── main.css         # Sistema de diseño con variables CSS, animaciones y glassmorphism
├── src/
│   └── app.js           # Enrutamiento de pestañas, cambio de tema, gráficas y notificaciones
└── README.md            # Documentación del proyecto
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Mediante Servidor Local XAMPP (Apache)
1. Inicia **Apache** desde el panel de control de **XAMPP**.
2. Abre tu navegador e ingresa a:
   [http://localhost/mi-proyecto-web/](http://localhost/mi-proyecto-web/)

### Opción 2: Apertura Directa en Navegador / Live Server
- Abre el archivo `index.html` directamente en tu navegador o haz clic derecho -> **Open with Live Server** en VS Code.

---

## 🎨 Características Incluidas

- **Sistema de Temas Dinámico:** Conmutador de modo claro / modo oscuro con persistencia en `localStorage`.
- **Estructura SPA (Single Page Application):** Navegación fluida por pestañas (Dashboard, Analítica, Proyectos, Usuarios, Reportes, Configuración).
- **Visualización de Datos:** Gráficos estadísticos dinámicos en tiempo real con `Chart.js`.
- **Componentes UI Listos:** Tarjetas de métricas, tablas filtrables, badges de estado, timeline de actividad y notificaciones flotantes (Toasts).
- **Diseño Responsivo:** Adaptado a pantallas móviles, tablets y escritorio.
