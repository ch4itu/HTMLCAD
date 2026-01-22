/* ============================================
   HTMLCAD - Main Application Module
   ============================================ */

const App = {
    // ==========================================
    // INITIALIZATION
    // ==========================================

    init() {
        // Initialize modules
        Renderer.init('canvas', 'viewport');
        UI.init();

        // Load saved settings
        Storage.loadSettings();

        // Setup viewport event handlers
        this.setupViewportEvents();

        // Initial draw
        Renderer.draw();

        // Welcome message
        UI.log('HTMLCAD initialized. Type commands or use toolbar buttons.');
        UI.log('Press F1 for help, F2 for grid, F3 for snap, F8 for ortho.');

        // Check for saved drawing
        if (Storage.hasSavedDrawing()) {
            UI.log('Saved drawing found. Type "open" to load it.');
        }

        // Center the view
        this.centerView();

        console.log('HTMLCAD initialized successfully.');
    },

    // ==========================================
    // VIEWPORT EVENTS
    // ==========================================

    setupViewportEvents() {
        const viewport = document.getElementById('viewport');
        if (!viewport) return;

        // Mouse events
        viewport.addEventListener('mousedown', (e) => this.onMouseDown(e));
        viewport.addEventListener('mousemove', (e) => this.onMouseMove(e));
        viewport.addEventListener('mouseup', (e) => this.onMouseUp(e));
        viewport.addEventListener('wheel', (e) => this.onWheel(e));
        viewport.addEventListener('contextmenu', (e) => this.onContextMenu(e));

        // Touch events for mobile
        viewport.addEventListener('touchstart', (e) => this.onTouchStart(e));
        viewport.addEventListener('touchmove', (e) => this.onTouchMove(e));
        viewport.addEventListener('touchend', (e) => this.onTouchEnd(e));

        // Double click
        viewport.addEventListener('dblclick', (e) => this.onDoubleClick(e));
    },

    onMouseDown(e) {
        const world = Utils.screenToWorld(e.offsetX, e.offsetY, CAD.pan, CAD.zoom);

        // Middle mouse button - start pan or zoom extents on double-click
        if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
            e.preventDefault();

            // Check for double middle click
            const now = Date.now();
            if (e.button === 1 && now - this.lastMiddleClick < 300) {
                this.onMiddleDoubleClick();
                this.lastMiddleClick = 0;
                return;
            }
            this.lastMiddleClick = e.button === 1 ? now : 0;

            CAD.isPanning = true;
            CAD.panStart = { x: e.offsetX, y: e.offsetY };
            document.getElementById('viewport').style.cursor = 'grabbing';
            return;
        }

        // Left click - handle command or selection
        if (e.button === 0) {
            Commands.handleClick(world);
            UI.updatePropertiesPanel();
        }
    },

    onMouseMove(e) {
        const world = Utils.screenToWorld(e.offsetX, e.offsetY, CAD.pan, CAD.zoom);

        // Update cursor position
        CAD.cursor = world;
        CAD.tempEnd = world;
        UI.updateCoordinates(world.x, world.y);

        // Handle panning
        if (CAD.isPanning) {
            const dx = e.offsetX - CAD.panStart.x;
            const dy = e.offsetY - CAD.panStart.y;
            CAD.pan.x += dx;
            CAD.pan.y += dy;
            CAD.panStart = { x: e.offsetX, y: e.offsetY };
        }

        // Update snap point
        if (CAD.snapEnabled && CAD.activeCmd) {
            const entities = CAD.getVisibleEntities();
            const tolerance = 15 / CAD.zoom;
            const snap = Geometry.findSnapPoints(world, entities, CAD.snapModes, tolerance, CAD.gridSize);

            if (snap) {
                CAD.snapPoint = snap.point;
                CAD.snapType = snap.type;
            } else {
                CAD.snapPoint = null;
                CAD.snapType = null;
            }
        }

        Renderer.draw();
    },

    onMouseUp(e) {
        if (CAD.isPanning) {
            CAD.isPanning = false;
            document.getElementById('viewport').style.cursor = 'crosshair';
        }
        UI.focusCommandLine();
    },

    onWheel(e) {
        e.preventDefault();

        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const worldBefore = Utils.screenToWorld(e.offsetX, e.offsetY, CAD.pan, CAD.zoom);

        CAD.zoom *= zoomFactor;

        // Clamp zoom level
        CAD.zoom = Utils.clamp(CAD.zoom, 0.01, 100);

        // Adjust pan to zoom around cursor
        CAD.pan.x = e.offsetX - worldBefore.x * CAD.zoom;
        CAD.pan.y = e.offsetY - worldBefore.y * CAD.zoom;

        Renderer.draw();
    },

    onContextMenu(e) {
        e.preventDefault();

        if (CAD.activeCmd) {
            // Context menu during command - show options
            UI.showContextMenu(e.clientX, e.clientY);
        } else if (CAD.selectedIds.length > 0) {
            // Context menu with selection
            UI.showContextMenu(e.clientX, e.clientY);
        } else {
            // General context menu
            UI.showContextMenu(e.clientX, e.clientY);
        }
    },

    // Track middle button for double-click zoom
    lastMiddleClick: 0,

    onDoubleClick(e) {
        // Double left click does nothing now
        // Use double middle click for zoom extents
    },

    onMiddleDoubleClick() {
        // Double middle click to zoom extents
        Commands.zoomExtents();
        Renderer.draw();
    },

    // ==========================================
    // TOUCH EVENTS
    // ==========================================

    touchState: {
        lastTap: 0,
        lastDistance: 0,
        touches: []
    },

    onTouchStart(e) {
        e.preventDefault();

        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = e.target.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // Check for double tap
            const now = Date.now();
            if (now - this.touchState.lastTap < 300) {
                Commands.zoomExtents();
            }
            this.touchState.lastTap = now;

            const world = Utils.screenToWorld(x, y, CAD.pan, CAD.zoom);
            CAD.cursor = world;
            Commands.handleClick(world);
        } else if (e.touches.length === 2) {
            // Start pinch zoom
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            this.touchState.lastDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        }

        Renderer.draw();
    },

    onTouchMove(e) {
        e.preventDefault();

        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = e.target.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const world = Utils.screenToWorld(x, y, CAD.pan, CAD.zoom);
            CAD.cursor = world;
            CAD.tempEnd = world;
            UI.updateCoordinates(world.x, world.y);
        } else if (e.touches.length === 2) {
            // Pinch zoom
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

            if (this.touchState.lastDistance > 0) {
                const scale = distance / this.touchState.lastDistance;
                const centerX = (t1.clientX + t2.clientX) / 2;
                const centerY = (t1.clientY + t2.clientY) / 2;

                const rect = e.target.getBoundingClientRect();
                const x = centerX - rect.left;
                const y = centerY - rect.top;

                const worldBefore = Utils.screenToWorld(x, y, CAD.pan, CAD.zoom);
                CAD.zoom *= scale;
                CAD.zoom = Utils.clamp(CAD.zoom, 0.01, 100);
                CAD.pan.x = x - worldBefore.x * CAD.zoom;
                CAD.pan.y = y - worldBefore.y * CAD.zoom;
            }

            this.touchState.lastDistance = distance;
        }

        Renderer.draw();
    },

    onTouchEnd(e) {
        if (e.touches.length === 0) {
            this.touchState.lastDistance = 0;
        }
    },

    // ==========================================
    // VIEW UTILITIES
    // ==========================================

    centerView() {
        const canvas = Renderer.canvas;
        if (!canvas) return;

        CAD.pan.x = canvas.width / 2;
        CAD.pan.y = canvas.height / 2;
        Renderer.draw();
    },

    // ==========================================
    // COMMAND SHORTCUTS
    // ==========================================

    executeCommand(cmdName) {
        Commands.startCommand(cmdName);
        UI.focusCommandLine();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
