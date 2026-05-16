# 🧪 Laboratorio Next.js: Estrategias de Renderizado (CSR vs SSR)

Este proyecto es un laboratorio práctico desarrollado en **Next.js (App Router)** enfocado en comprender, implementar y visualizar las diferencias críticas entre **Client-Side Rendering (CSR)** y **Server-Side Rendering (SSR)**.

---

## 🚀 Comenzando

### Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### Instalación de Dependencias

Clona el proyecto, navega a la carpeta raíz e instala los paquetes necesarios:

```bash
npm install

# o bien:
yarn install
pnpm install
bun install
```

### Ejecutar el Servidor de Desarrollo

Inicia el entorno local:

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador para interactuar con el panel principal del laboratorio.

---

## 📂 Estructura de Ejercicios Desarrollados

El proyecto está organizado en tres grandes bloques prácticos dentro del directorio `app/`.

---

## 🎮 Ejercicio 1.1: Pokémon (CSR vs SSR)

Se crearon dos páginas visualmente idénticas para aislar y analizar el comportamiento del flujo de red.

### `/pokemon-csr`

Consume la PokéAPI desde el navegador usando `useEffect` y `useState`.

- Muestra un estado de carga en el cliente.
- Toda la lógica ocurre en el navegador.

### `/pokemon-ssr`

Renderiza de forma asíncrona en el servidor.

- El HTML llega al navegador con la información del Pokémon ya incrustada.
- Mejora la carga inicial y el SEO.

---

## ☁️ Ejercicio 2.1: Dashboard del Clima Híbrido

Ubicado en `/weather`, este módulo demuestra cómo orquestar componentes de servidor y cliente en una sola interfaz utilizando la API de Open-Meteo.

### Lima (Card SSR)

Información estática ultra rápida y óptima para SEO cargada desde el servidor.

### Mundo (Card CSR)

Widget interactivo (`'use client'`) con un menú desplegable para alternar entre:

- Tokio
- Nueva York
- Londres
- Sídney

Todo en tiempo real y sin recargar la página.

---

## 🎬 Actividad Integradora: CineHub Híbrido (Galería de OMDb)

Ubicado en `/movies`, combina de forma avanzada ambas estrategias consumiendo la API de OMDb.

### Tendencias (SSR)

El servidor precarga una lista fija de películas populares para maximizar el SEO.

### Buscador (CSR)

Input reactivo con `debounce` de `500ms` que realiza búsquedas asíncronas en tiempo real.

### Detalle Técnico (Modal CSR)

Escucha dinámicamente los parámetros de la URL (`?movieId=...`) para abrir una ventana modal y traer la ficha técnica bajo demanda.

---

## 📊 Matriz de Decisión Arquitectónica

A modo de documentación técnica para la evaluación, aquí se detalla el criterio de uso para cada estrategia dentro de la aplicación.

| Característica / Módulo         | Estrategia | Ventaja Principal |
| -------------------------------- | ---------- | ----------------- |
| Sección de Tendencias de Cine | SSR | SEO excelente: los motores de búsqueda indexan los títulos de inmediato. |
| Ficha Inicial del Clima (Lima) | SSR | Carga inicial inmediata: cero parpadeos o estados de carga para el usuario. |
| Buscador de Películas | CSR | Interactividad fluida: manejo de estados dinámicos en el cliente. |
| Modal de Detalles e Inyecciones | CSR | Eficiencia por demanda: las peticiones pesadas solo se realizan si el usuario interactúa. |

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js (App Router)
- **Estilos:** Tailwind CSS
- **Cliente HTTP:** Axios

### APIs Externas

- OMDb API
- Open-Meteo API
- PokéAPI