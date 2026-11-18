import { ref, readonly } from 'vue';

const MOBILE_BREAKPOINT = 768;

function detectTouch(): boolean {
    if (typeof window === 'undefined') return false;
    const hasTouchPoints = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
    const hasCoarsePointer =
        typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
    return Boolean(hasTouchPoints || hasCoarsePointer || 'ontouchstart' in window);
}

const viewportWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1280);
const viewportHeight = ref<number>(typeof window !== 'undefined' ? window.innerHeight : 800);
const isMobile = ref<boolean>(viewportWidth.value < MOBILE_BREAKPOINT);
const isTouch = ref<boolean>(detectTouch());

let listenerInitialized = false;

export function updateDeviceMetrics() {
    if (typeof window === 'undefined') return;
    viewportWidth.value = window.innerWidth;
    viewportHeight.value = window.innerHeight;
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
    isTouch.value = detectTouch();
}

export function useDevice() {
    if (typeof window !== 'undefined' && !listenerInitialized) {
        listenerInitialized = true;
        updateDeviceMetrics();
        window.addEventListener('resize', updateDeviceMetrics, { passive: true });
        window.addEventListener('orientationchange', updateDeviceMetrics, { passive: true });
    }

    return {
        isMobile: readonly(isMobile),
        isTouch: readonly(isTouch),
        viewportWidth: readonly(viewportWidth),
        viewportHeight: readonly(viewportHeight),
        updateDeviceMetrics,
    };
}

