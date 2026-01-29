/* ============================================
   BrowserCAD - Main Application Module
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
        UI.log('BrowserCAD initialized. Type commands or use toolbar buttons.');
        UI.log('Press F1 for help, F2 for grid, F3 for snap, F8 for ortho.');

        // Check for saved drawing
        if (Storage.hasSavedDrawing()) {
            UI.log('Saved drawing found. Type "open" to load it.');
        }

        // Center the view
        this.centerView();

        console.log('BrowserCAD initialized successfully.');
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
        CAD.cursorWorld = world;
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

        // Update hover highlighting (detect entity under cursor)
        const tolerance = 10 / CAD.zoom;
        const hit = Commands.hitTest(world);
        CAD.hoveredId = hit ? hit.id : null;

        // Update snap point (separate OSNAP and Grid Snap)
        if (CAD.osnapEnabled || CAD.gridSnapEnabled) {
            const entities = CAD.getVisibleEntities();
            const snapTolerance = 15 / CAD.zoom;

            // Build effective snap modes based on current settings
            const effectiveSnapModes = {
                endpoint: CAD.osnapEnabled && CAD.snapModes.endpoint,
                midpoint: CAD.osnapEnabled && CAD.snapModes.midpoint,
                center: CAD.osnapEnabled && CAD.snapModes.center,
                intersection: CAD.osnapEnabled && CAD.snapModes.intersection,
                perpendicular: CAD.osnapEnabled && CAD.snapModes.perpendicular,
                tangent: CAD.osnapEnabled && CAD.snapModes.tangent,
                nearest: CAD.osnapEnabled && CAD.snapModes.nearest,
                grid: CAD.gridSnapEnabled  // Grid snap is separate
            };

            const snap = Geometry.findSnapPoints(world, entities, effectiveSnapModes, snapTolerance, CAD.gridSize);

            if (snap) {
                CAD.snapPoint = snap.point;
                CAD.snapType = snap.type;
            } else {
                CAD.snapPoint = null;
                CAD.snapType = null;
            }
        } else {
            CAD.snapPoint = null;
            CAD.snapType = null;
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
        touches: [],
        startX: 0,
        startY: 0,
        startTime: 0,
        moved: false,
        isPanning: false,
        longPressTimer: null,
        panModeActive: false  // Toggle pan mode on mobile
    },

    isMobile() {
        return window.innerWidth <= 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
    },

    onTouchStart(e) {
        e.preventDefault();

        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = e.target.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            this.touchState.startX = x;
            this.touchState.startY = y;
            this.touchState.startTime = Date.now();
            this.touchState.moved = false;
            this.touchState.isPanning = false;

            // Check for double tap
            const now = Date.now();
            if (now - this.touchState.lastTap < 300) {
                // Double tap — zoom extents
                clearTimeout(this.touchState.longPressTimer);
                Commands.zoomExtents();
                this.touchState.lastTap = 0;
                Renderer.draw();
                return;
            }
            this.touchState.lastTap = now;

            // Long press timer for context menu (500ms)
            this.touchState.longPressTimer = setTimeout(() => {
                if (!this.touchState.moved) {
                    // Long press: show context menu at touch location
                    UI.showContextMenu(touch.clientX, touch.clientY);
                    this.touchState.isPanning = false;
                }
            }, 500);

            // In pan mode or no active command: start panning
            if (this.touchState.panModeActive || (!CAD.activeCmd && !CAD.selectionMode)) {
                this.touchState.isPanning = true;
            }

            const world = Utils.screenToWorld(x, y, CAD.pan, CAD.zoom);
            CAD.cursor = world;
        } else if (e.touches.length === 2) {
            // Cancel long press and single-touch actions
            clearTimeout(this.touchState.longPressTimer);
            this.touchState.isPanning = false;

            // Start pinch zoom
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            this.touchState.lastDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
            this.touchState.pinchCenterX = (t1.clientX + t2.clientX) / 2;
            this.touchState.pinchCenterY = (t1.clientY + t2.clientY) / 2;
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

            const dx = x - this.touchState.startX;
            const dy = y - this.touchState.startY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // If moved more than 8px, cancel long press and mark as moved
            if (dist > 8) {
                this.touchState.moved = true;
                clearTimeout(this.touchState.longPressTimer);
            }

            if (this.touchState.isPanning || (this.touchState.moved && this.touchState.panModeActive)) {
                // Pan the view
                CAD.pan.x += (x - this.touchState.startX);
                CAD.pan.y += (y - this.touchState.startY);
                this.touchState.startX = x;
                this.touchState.startY = y;
                this.touchState.isPanning = true;
            } else {
                // Update cursor and temp line for drawing
                const world = Utils.screenToWorld(x, y, CAD.pan, CAD.zoom);
                CAD.cursor = world;
                CAD.tempEnd = world;
                UI.updateCoordinates(world.x, world.y);
            }
        } else if (e.touches.length === 2) {
            // Pinch zoom + two-finger pan
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
            const newCenterX = (t1.clientX + t2.clientX) / 2;
            const newCenterY = (t1.clientY + t2.clientY) / 2;

            if (this.touchState.lastDistance > 0) {
                const scale = distance / this.touchState.lastDistance;
                const rect = e.target.getBoundingClientRect();
                const x = newCenterX - rect.left;
                const y = newCenterY - rect.top;

                const worldBefore = Utils.screenToWorld(x, y, CAD.pan, CAD.zoom);
                CAD.zoom *= scale;
                CAD.zoom = Utils.clamp(CAD.zoom, 0.01, 100);
                CAD.pan.x = x - worldBefore.x * CAD.zoom;
                CAD.pan.y = y - worldBefore.y * CAD.zoom;
            }

            // Two-finger pan (movement of center point)
            if (this.touchState.pinchCenterX !== undefined) {
                const panDx = newCenterX - this.touchState.pinchCenterX;
                const panDy = newCenterY - this.touchState.pinchCenterY;
                CAD.pan.x += panDx;
                CAD.pan.y += panDy;
            }

            this.touchState.lastDistance = distance;
            this.touchState.pinchCenterX = newCenterX;
            this.touchState.pinchCenterY = newCenterY;
        }

        Renderer.draw();
    },

    onTouchEnd(e) {
        clearTimeout(this.touchState.longPressTimer);

        if (e.touches.length === 0) {
            this.touchState.lastDistance = 0;
            this.touchState.pinchCenterX = undefined;
            this.touchState.pinchCenterY = undefined;

            // If it was a tap (not a pan/long-press), handle as click
            if (!this.touchState.moved && !this.touchState.isPanning) {
                const rect = e.target.getBoundingClientRect();
                const x = this.touchState.startX;
                const y = this.touchState.startY;
                const world = Utils.screenToWorld(x, y, CAD.pan, CAD.zoom);
                CAD.cursor = world;
                Commands.handleClick(world);
                UI.updatePropertiesPanel();
                Renderer.draw();
            }

            this.touchState.isPanning = false;
            this.touchState.moved = false;
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

// ============================================
// MOBILE UI MODULE
// ============================================

const MobileUI = {
    init() {
        // Update mobile snap button states on load
        this.updateSnapButtons();
    },

    switchTab(tabName) {
        // Switch mobile toolbar tabs
        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mtab === tabName);
        });
        document.querySelectorAll('.mobile-tool-row').forEach(row => {
            row.classList.toggle('active', row.dataset.mtab === tabName);
        });
    },

    toggleMenu() {
        const overlay = document.getElementById('mobileMenuOverlay');
        overlay.classList.add('visible');
    },

    closeMenu(event) {
        if (event && event.target !== event.currentTarget) return;
        const overlay = document.getElementById('mobileMenuOverlay');
        overlay.classList.remove('visible');
    },

    menuAction(action) {
        this.closeMenu();
        switch (action) {
            case 'new':
                if (confirm('Start a new drawing? All unsaved changes will be lost.')) {
                    CAD.newDrawing();
                    UI.log('New drawing started.');
                    Renderer.draw();
                    UI.updateLayerUI();
                }
                break;
            case 'open':
                Storage.openFile();
                break;
            case 'save':
                Storage.saveToLocalStorage();
                break;
            case 'exportdxf':
                Storage.exportDXF();
                break;
            case 'exportsvg':
                Storage.exportSVG();
                break;
            case 'exportjson':
                Storage.exportJSON();
                break;
            case 'selectall':
                Commands.execute('selectall');
                break;
            case 'filter':
                Commands.execute('filter');
                break;
            case 'qselect':
                Commands.execute('qselect');
                break;
            case 'block':
                App.executeCommand('block');
                break;
            case 'insert':
                App.executeCommand('insert');
                break;
            case 'matchprop':
                App.executeCommand('matchprop');
                break;
            case 'overkill':
                App.executeCommand('overkill');
                break;
            case 'purge':
                App.executeCommand('purge');
                break;
            case 'find':
                App.executeCommand('find');
                break;
            case 'settings':
                UI.log('Settings: Use command line for GRID, SNAP, ORTHO, OSNAP, POLAR, LTSCALE, DIMSCALE');
                break;
            case 'help':
                App.executeCommand('help');
                break;
        }
    },

    toggleSnap(type) {
        switch (type) {
            case 'osnap':
                UI.toggleOsnap();
                break;
            case 'grid':
                UI.toggleGrid();
                break;
            case 'ortho':
                UI.toggleOrtho();
                break;
            case 'polar':
                UI.togglePolar();
                break;
        }
        this.updateSnapButtons();
    },

    updateSnapButtons() {
        const osnapBtn = document.getElementById('mSnapOsnap');
        const gridBtn = document.getElementById('mSnapGrid');
        const orthoBtn = document.getElementById('mSnapOrtho');
        const polarBtn = document.getElementById('mSnapPolar');

        if (osnapBtn) osnapBtn.classList.toggle('active', CAD.osnapEnabled);
        if (gridBtn) gridBtn.classList.toggle('active', CAD.showGrid);
        if (orthoBtn) orthoBtn.classList.toggle('active', CAD.orthoEnabled);
        if (polarBtn) polarBtn.classList.toggle('active', CAD.polarEnabled);
    },

    togglePanMode() {
        App.touchState.panModeActive = !App.touchState.panModeActive;
        const viewport = document.getElementById('viewport');
        if (App.touchState.panModeActive) {
            viewport.style.cursor = 'grab';
            UI.log('Pan mode: ON (tap to place points disabled)');
        } else {
            viewport.style.cursor = 'crosshair';
            UI.log('Pan mode: OFF (tap to draw/select)');
        }
    },

    // Collapse/expand command panel on mobile
    toggleCommandPanel() {
        const panel = document.querySelector('.command-panel');
        if (panel) {
            panel.classList.toggle('mobile-collapsed');
        }
    }
};
// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    MobileUI.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
