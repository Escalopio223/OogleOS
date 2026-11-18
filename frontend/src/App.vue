<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useCustomizationStore } from '@/stores/customizationStore';
import LoginModal from '@/components/desktop/LoginModal.vue';
import DesktopWorkspace from '@/components/desktop/DesktopWorkspace.vue';
import Taskbar from '@/components/desktop/Taskbar.vue';

const authStore = useAuthStore();
const customStore = useCustomizationStore();
</script>

<template>
  <div class="os-root" :class="[customStore.themeClass]" :style="customStore.rootStyle">
    <!-- Pantalla de login (incluye el Post-it y se destruye al autenticar) -->
    <LoginModal v-if="!authStore.isAuthenticated" />

    <!-- Escritorio (solo aparece tras el login) -->
    <template v-else>
      <DesktopWorkspace />
      <Taskbar />
    </template>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px; 
}

html,
body,
#app {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  user-select: none;
  font-family: var(--os-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Control de gestos táctiles en barras de título y tiradores de redimensionado */
.window-header,
.window-titlebar,
.glass-header,
.resize-handle,
.window-resize-handle {
  touch-action: none;
}

/* =========================================================
   ADAPTACIÓN RESPONSIVE Y MÓVIL (< 768px)
   ========================================================= */
@media (max-width: 767px) {
  /* Evitar desbordamiento horizontal en todas las ventanas */
  .glass-window,
  .onotes-window,
  .osheets-window,
  .opdf-window,
  .opics-window,
  .opaint-window,
  .omonitor-window,
  .oplanner-window,
  .customization-window {
    max-width: 100vw !important;
    overflow-x: hidden !important;
  }

  /* Oxplorer: barra de herramientas adaptable en múltiples filas limpias */
  .glass-toolbar {
    flex-wrap: wrap !important;
    gap: 8px !important;
    padding: 8px 10px !important;
  }

  .glass-toolbar .action-buttons {
    flex-wrap: wrap !important;
    width: 100%;
    overflow-x: auto;
  }

  .glass-toolbar .address-bar,
  .glass-toolbar .search-wrapper {
    width: 100% !important;
    flex: 1 1 100% !important;
  }

  .window-statusbar {
    flex-wrap: wrap !important;
    height: auto !important;
    min-height: 28px;
    padding: 4px 10px !important;
    gap: 4px;
  }

  /* Onotes y Osheets: barras de herramientas flexibles */
  .editor-toolbar,
  .sheets-toolbar {
    flex-wrap: wrap !important;
    height: auto !important;
    gap: 6px !important;
    padding: 8px 10px !important;
  }

  /* Opdf y Personalización: paneles laterales colapsados en barra superior scrollable */
  .opdf-body,
  .customization-body,
  .docs-container {
    flex-direction: column !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
  }

  .opdf-form-panel,
  .customization-sidebar,
  .docs-sidebar {
    width: 100% !important;
    max-width: 100% !important;
    max-height: 36vh;
    border-right: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0 !important;
  }

  .customization-sidebar {
    flex-direction: row !important;
    overflow-x: auto !important;
    max-height: none !important;
    padding: 8px !important;
    gap: 6px !important;
  }

  /* Oplanner: cabecera, barra de vistas y drawer adaptados a pantalla estrecha */
  .oplanner-toolbar {
    flex-wrap: wrap !important;
    height: auto !important;
    padding: 8px 10px !important;
    gap: 8px !important;
  }

  .oplanner-toolbar .toolbar-filters {
    flex-wrap: wrap !important;
    width: 100% !important;
  }

  /* Omonitor: pestañas y gráficas en una sola columna sin desbordamiento */
  .omonitor-nav-tabs {
    overflow-x: auto !important;
    flex-wrap: nowrap !important;
  }

  .charts-grid,
  .metrics-cards-grid,
  .telemetry-split-grid {
    grid-template-columns: 1fr !important;
  }
}

/* =========================================================
   TEMA CLARO (Light Mode) - Reglas globales de contraste
   ========================================================= */
.os-root.theme-light {
  color-scheme: light;
}

/* Texto de accesos directos en el escritorio: texto oscuro con halo blanco para máxima legibilidad */
.os-root.theme-light .shortcut-label {
  color: #0f172a !important;
  text-shadow: 0 1px 2px #ffffff, 0 0 6px rgba(255, 255, 255, 0.85) !important;
  font-weight: 600 !important;
}

.os-root.theme-light .shortcut-item:hover {
  background: rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
}

/* Menús contextuales en modo claro */
.os-root.theme-light .context-menu,
.os-root.theme-light .taskbar-context-menu {
  background: rgba(255, 255, 255, 0.94) !important;
  border: 1px solid rgba(0, 0, 0, 0.14) !important;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.2) !important;
}

.os-root.theme-light .context-item,
.os-root.theme-light .menu-action-item {
  color: #1e293b !important;
}

.os-root.theme-light .context-item:hover,
.os-root.theme-light .menu-action-item:hover {
  background: rgba(2, 132, 199, 0.12) !important;
  color: #0284c7 !important;
}

.os-root.theme-light .menu-divider,
.os-root.theme-light .menu-separator {
  background: rgba(0, 0, 0, 0.08) !important;
}

/* Barra de tareas en modo claro */
.os-root.theme-light .taskbar {
  border-top-color: rgba(0, 0, 0, 0.12) !important;
  color: #334155 !important;
}

.os-root.theme-light .taskbar-item {
  background: rgba(0, 0, 0, 0.05) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  color: #1e293b !important;
}

.os-root.theme-light .taskbar-item:hover {
  background: rgba(0, 0, 0, 0.1) !important;
}

.os-root.theme-light .taskbar-item.active {
  background: rgba(0, 0, 0, 0.14) !important;
  border-color: #0284c7 !important;
  color: #0284c7 !important;
}

.os-root.theme-light .taskbar-clock {
  background: rgba(255, 255, 255, 0.6) !important;
  color: #0f172a !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.os-root.theme-light .tray-btn {
  background: rgba(0, 0, 0, 0.06) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  color: #1e293b !important;
}

.os-root.theme-light .tray-btn:hover {
  background: rgba(0, 0, 0, 0.12) !important;
}

/* Menú de inicio en modo claro */
.os-root.theme-light .start-menu-container {
  background: rgba(255, 255, 255, 0.94) !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25) !important;
}

.os-root.theme-light .search-input {
  background: rgba(0, 0, 0, 0.04) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  color: #0f172a !important;
}

.os-root.theme-light .search-input:focus {
  border-color: #0284c7 !important;
  background: rgba(2, 132, 199, 0.04) !important;
}

.os-root.theme-light .app-card {
  background: rgba(0, 0, 0, 0.02) !important;
  border-color: rgba(0, 0, 0, 0.06) !important;
}

.os-root.theme-light .app-card:hover {
  background: rgba(0, 0, 0, 0.06) !important;
  border-color: rgba(2, 132, 199, 0.35) !important;
}

.os-root.theme-light .app-title {
  color: #0f172a !important;
}

.os-root.theme-light .start-footer {
  background: rgba(241, 245, 249, 0.95) !important;
  border-top-color: rgba(0, 0, 0, 0.08) !important;
}

.os-root.theme-light .user-name {
  color: #0f172a !important;
}
</style>

<style scoped>
.os-root {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background-color: #0b0f19;
  font-family: var(--os-font-family, inherit);
}
</style>