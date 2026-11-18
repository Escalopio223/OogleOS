import { ref, onMounted, onUnmounted } from 'vue';
import { useDevice } from '@/composables/useDevice';

export function useWindowBounds(
    initialX = 80,
    initialY = 40,
    initialW = 840,
    initialH = 520,
    minW = 480,
    minH = 320
) {
    const TASKBAR_HEIGHT = 50;
    const { isMobile } = useDevice();

    function computeInitialGeometry() {
        if (typeof window === 'undefined' || window.innerWidth >= 768) {
            return {
                x: initialX,
                y: initialY,
                w: initialW,
                h: initialH,
            };
        }

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // 94vw de ancho y hasta 80dvh de alto en pantallas móviles (< 768px)
        const mobileW = Math.round(vw * 0.94);
        const maxMobileH = Math.max(240, vh - TASKBAR_HEIGHT - 16);
        const mobileH = Math.min(maxMobileH, Math.round(vh * 0.8));
        const mobileX = Math.max(4, Math.round((vw - mobileW) / 2));
        const cascadeOffset = Math.max(8, Math.min(28, Math.round(initialY * 0.35)));
        const mobileY = Math.min(cascadeOffset, Math.max(4, vh - TASKBAR_HEIGHT - mobileH - 4));

        return {
            x: mobileX,
            y: mobileY,
            w: mobileW,
            h: mobileH,
        };
    }

    const init = computeInitialGeometry();
    const x = ref(init.x);
    const y = ref(init.y);
    const width = ref(init.w);
    const height = ref(init.h);

    function clampToViewport() {
        if (typeof window === 'undefined') return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (vw < 768) {
            const maxAllowedW = Math.max(260, Math.round(vw * 0.96));
            const maxAllowedH = Math.max(220, vh - TASKBAR_HEIGHT - 12);
            if (width.value > maxAllowedW) {
                width.value = Math.round(vw * 0.94);
            }
            if (height.value > maxAllowedH) {
                height.value = Math.min(maxAllowedH, Math.round(vh * 0.8));
            }
        }

        const maxX = Math.max(0, vw - width.value);
        const maxY = Math.max(0, vh - TASKBAR_HEIGHT - 44);
        x.value = Math.max(0, Math.min(x.value, maxX));
        y.value = Math.max(0, Math.min(y.value, maxY));
    }

    // --- DRAG (Pointer Events + Mouse Fallback) ---
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    function startDrag(e: PointerEvent | MouseEvent, isMaximized = false) {
        if (isMaximized) return;
        if ('button' in e && e.button !== 0 && e.button !== undefined) return;

        // Evitar iniciar arrastre si se pulsó un botón o input dentro de la cabecera
        const target = e.target as HTMLElement | null;
        if (
            target &&
            target.closest(
                'button, input, select, textarea, a, .window-controls-group, .win-btn'
            )
        ) {
            return;
        }

        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initialLeft = x.value;
        initialTop = y.value;

        window.addEventListener('pointermove', onDragMove, { passive: false });
        window.addEventListener('pointerup', stopDrag);
        window.addEventListener('pointercancel', stopDrag);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', stopDrag);
    }

    function onDragMove(e: PointerEvent | MouseEvent) {
        if (!isDragging) return;
        if (e.cancelable && 'pointerType' in e && e.pointerType === 'touch') {
            e.preventDefault();
        }

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const maxW = Math.max(0, vw - width.value);
        const maxH = Math.max(0, vh - TASKBAR_HEIGHT - 44);

        const nextX = initialLeft + (e.clientX - dragStartX);
        const nextY = initialTop + (e.clientY - dragStartY);

        x.value = Math.max(0, Math.min(nextX, maxW));
        y.value = Math.max(0, Math.min(nextY, maxH));
    }

    function stopDrag() {
        isDragging = false;
        window.removeEventListener('pointermove', onDragMove);
        window.removeEventListener('pointerup', stopDrag);
        window.removeEventListener('pointercancel', stopDrag);
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', stopDrag);
    }

    // --- RESIZE (Pointer Events + Mouse Fallback) ---
    let resizeDir = '';
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;
    let startPosX = 0;
    let startPosY = 0;

    function startResize(e: PointerEvent | MouseEvent, direction = 'se', isMaximized = false) {
        if (isMaximized) return;
        if ('button' in e && e.button !== 0 && e.button !== undefined) return;
        e.preventDefault();
        e.stopPropagation();

        resizeDir = direction;
        startX = e.clientX;
        startY = e.clientY;
        startW = width.value;
        startH = height.value;
        startPosX = x.value;
        startPosY = y.value;

        window.addEventListener('pointermove', onResizeMove, { passive: false });
        window.addEventListener('pointerup', stopResize);
        window.addEventListener('pointercancel', stopResize);
        window.addEventListener('mousemove', onResizeMove);
        window.addEventListener('mouseup', stopResize);
    }

    function onResizeMove(e: PointerEvent | MouseEvent) {
        if (!resizeDir) return;
        if (e.cancelable && 'pointerType' in e && e.pointerType === 'touch') {
            e.preventDefault();
        }

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const maxAvailableH = vh - TASKBAR_HEIGHT;

        const effectiveMinW = isMobile.value
            ? Math.min(minW, Math.max(260, Math.round(vw * 0.7)))
            : minW;
        const effectiveMinH = isMobile.value ? Math.min(minH, 220) : minH;

        // Derecha
        if (resizeDir.includes('e')) {
            const newW = Math.min(vw - x.value, Math.max(effectiveMinW, startW + deltaX));
            width.value = newW;
        }
        // Izquierda
        if (resizeDir.includes('w')) {
            const rawW = startW - deltaX;
            if (rawW >= effectiveMinW) {
                const newX = Math.max(0, startPosX + deltaX);
                width.value = startW + (startPosX - newX);
                x.value = newX;
            }
        }
        // Abajo
        if (resizeDir.includes('s')) {
            const maxH = maxAvailableH - y.value;
            const newH = Math.min(maxH, Math.max(effectiveMinH, startH + deltaY));
            height.value = newH;
        }
        // Arriba
        if (resizeDir.includes('n')) {
            const rawH = startH - deltaY;
            if (rawH >= effectiveMinH) {
                const newY = Math.max(0, startPosY + deltaY);
                height.value = startH + (startPosY - newY);
                y.value = newY;
            }
        }
    }

    function stopResize() {
        resizeDir = '';
        window.removeEventListener('pointermove', onResizeMove);
        window.removeEventListener('pointerup', stopResize);
        window.removeEventListener('pointercancel', stopResize);
        window.removeEventListener('mousemove', onResizeMove);
        window.removeEventListener('mouseup', stopResize);
    }

    onMounted(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', clampToViewport, { passive: true });
        }
    });

    onUnmounted(() => {
        stopDrag();
        stopResize();
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', clampToViewport);
        }
    });

    return {
        x,
        y,
        width,
        height,
        startDrag,
        startResize,
        clampToViewport,
    };
}
