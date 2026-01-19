/* ============================================
   HTMLCAD - State Management Module
   ============================================ */

// Unique ID generator with collision prevention
let entityIdCounter = 0;
function generateId() {
    return `ent_${Date.now()}_${entityIdCounter++}`;
}

// State Manager Class
class StateManager {
    constructor() {
        // Command state
        this.activeCmd = null;
        this.step = 0;
        this.points = [];
        this.tempEnd = null;
        this.lineChainStart = null;
        this.offsetDist = 10;
        this.targetId = null;
        this.cmdOptions = {};

        // Selection state
        this.selectionMode = false;
        this.selectStart = null;
        this.selectedIds = [];

        // View state
        this.pan = { x: 0, y: 0 };
        this.zoom = 1;
        this.cursor = { x: 0, y: 0 };
        this.isPanning = false;
        this.panStart = { x: 0, y: 0 };

        // Snap settings
        this.snapEnabled = true;
        this.snapModes = {
            endpoint: true,
            midpoint: true,
            center: true,
            intersection: true,
            perpendicular: false,
            tangent: false,
            nearest: false,
            grid: true
        };
        this.snapPoint = null;
        this.snapType = null;
        this.gridSize = 10;

        // Ortho mode (constrain to horizontal/vertical)
        this.orthoEnabled = false;

        // Polar tracking
        this.polarEnabled = false;
        this.polarAngle = 45;

        // Drawing settings
        this.lineWeight = 1;
        this.lineType = 'continuous';

        // Layers
        this.layers = [
            { name: '0', color: '#ffffff', visible: true, locked: false, lineWeight: 'Default' }
        ];
        this.currentLayer = '0';

        // Entities
        this.entities = [];

        // Undo/Redo stacks
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoLevels = 100;

        // Drawing info
        this.drawingName = 'Untitled';
        this.modified = false;

        // Clipboard for copy/paste
        this.clipboard = [];

        // Grid display
        this.showGrid = true;
        this.gridSpacing = 100;
        this.gridSubdivisions = 10;

        // Origin/UCS
        this.origin = { x: 0, y: 0 };
        this.ucsAngle = 0;
    }

    // ==========================================
    // ENTITY MANAGEMENT
    // ==========================================

    addEntity(data, skipUndo = false) {
        const entity = {
            id: generateId(),
            layer: this.currentLayer,
            lineWeight: this.lineWeight,
            lineType: this.lineType,
            ...data
        };

        if (!skipUndo) {
            this.saveUndoState('Add Entity');
        }

        this.entities.push(entity);
        this.modified = true;
        return entity;
    }

    removeEntity(id, skipUndo = false) {
        const index = this.entities.findIndex(e => e.id === id);
        if (index === -1) return null;

        if (!skipUndo) {
            this.saveUndoState('Remove Entity');
        }

        const removed = this.entities.splice(index, 1)[0];
        this.modified = true;
        return removed;
    }

    removeEntities(ids, skipUndo = false) {
        if (ids.length === 0) return [];

        if (!skipUndo) {
            this.saveUndoState('Remove Entities');
        }

        const removed = [];
        this.entities = this.entities.filter(e => {
            if (ids.includes(e.id)) {
                removed.push(e);
                return false;
            }
            return true;
        });

        this.modified = true;
        return removed;
    }

    getEntity(id) {
        return this.entities.find(e => e.id === id);
    }

    updateEntity(id, updates, skipUndo = false) {
        const entity = this.getEntity(id);
        if (!entity) return null;

        if (!skipUndo) {
            this.saveUndoState('Update Entity');
        }

        Object.assign(entity, updates);
        this.modified = true;
        return entity;
    }

    getVisibleEntities() {
        return this.entities.filter(e => {
            const layer = this.getLayer(e.layer);
            return layer && layer.visible;
        });
    }

    // ==========================================
    // LAYER MANAGEMENT
    // ==========================================

    addLayer(name, color = '#ffffff') {
        if (this.layers.find(l => l.name === name)) {
            return null; // Layer already exists
        }

        const layer = {
            name,
            color,
            visible: true,
            locked: false,
            lineWeight: 'Default'
        };

        this.layers.push(layer);
        return layer;
    }

    getLayer(name) {
        return this.layers.find(l => l.name === name);
    }

    setCurrentLayer(name) {
        if (this.getLayer(name)) {
            this.currentLayer = name;
            return true;
        }
        return false;
    }

    updateLayerColor(name, color) {
        const layer = this.getLayer(name);
        if (layer) {
            layer.color = color;
            return true;
        }
        return false;
    }

    toggleLayerVisibility(name) {
        const layer = this.getLayer(name);
        if (layer) {
            layer.visible = !layer.visible;
            return layer.visible;
        }
        return null;
    }

    getEntityColor(entity) {
        if (entity.color) return entity.color;
        const layer = this.getLayer(entity.layer);
        return layer ? layer.color : '#ffffff';
    }

    // ==========================================
    // UNDO/REDO SYSTEM
    // ==========================================

    saveUndoState(actionName = 'Action') {
        // Clear redo stack when new action is performed
        this.redoStack = [];

        // Deep clone current entities
        const snapshot = {
            action: actionName,
            entities: JSON.parse(JSON.stringify(this.entities)),
            layers: JSON.parse(JSON.stringify(this.layers)),
            currentLayer: this.currentLayer
        };

        this.undoStack.push(snapshot);

        // Limit undo levels
        if (this.undoStack.length > this.maxUndoLevels) {
            this.undoStack.shift();
        }
    }

    undo() {
        if (this.undoStack.length === 0) return false;

        // Save current state to redo stack
        const currentSnapshot = {
            action: 'Redo',
            entities: JSON.parse(JSON.stringify(this.entities)),
            layers: JSON.parse(JSON.stringify(this.layers)),
            currentLayer: this.currentLayer
        };
        this.redoStack.push(currentSnapshot);

        // Restore previous state
        const snapshot = this.undoStack.pop();
        this.entities = snapshot.entities;
        this.layers = snapshot.layers;
        this.currentLayer = snapshot.currentLayer;
        this.modified = true;

        return snapshot.action;
    }

    redo() {
        if (this.redoStack.length === 0) return false;

        // Save current state to undo stack
        const currentSnapshot = {
            action: 'Undo',
            entities: JSON.parse(JSON.stringify(this.entities)),
            layers: JSON.parse(JSON.stringify(this.layers)),
            currentLayer: this.currentLayer
        };
        this.undoStack.push(currentSnapshot);

        // Restore redo state
        const snapshot = this.redoStack.pop();
        this.entities = snapshot.entities;
        this.layers = snapshot.layers;
        this.currentLayer = snapshot.currentLayer;
        this.modified = true;

        return snapshot.action;
    }

    canUndo() {
        return this.undoStack.length > 0;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }

    // ==========================================
    // SELECTION MANAGEMENT
    // ==========================================

    select(ids) {
        if (!Array.isArray(ids)) ids = [ids];
        this.selectedIds = [...new Set([...this.selectedIds, ...ids])];
    }

    deselect(ids) {
        if (!Array.isArray(ids)) ids = [ids];
        this.selectedIds = this.selectedIds.filter(id => !ids.includes(id));
    }

    clearSelection() {
        this.selectedIds = [];
    }

    isSelected(id) {
        return this.selectedIds.includes(id);
    }

    getSelectedEntities() {
        return this.entities.filter(e => this.selectedIds.includes(e.id));
    }

    selectAll() {
        this.selectedIds = this.getVisibleEntities().map(e => e.id);
    }

    // ==========================================
    // CLIPBOARD OPERATIONS
    // ==========================================

    copyToClipboard() {
        const selected = this.getSelectedEntities();
        if (selected.length === 0) return 0;

        this.clipboard = JSON.parse(JSON.stringify(selected));
        return this.clipboard.length;
    }

    paste(offset = { x: 50, y: 50 }) {
        if (this.clipboard.length === 0) return [];

        this.saveUndoState('Paste');

        const newEntities = [];
        const idMap = {};

        this.clipboard.forEach(entity => {
            const newId = generateId();
            idMap[entity.id] = newId;

            const newEntity = {
                ...JSON.parse(JSON.stringify(entity)),
                id: newId
            };

            // Offset the entity
            this.offsetEntity(newEntity, offset);
            this.entities.push(newEntity);
            newEntities.push(newEntity);
        });

        this.modified = true;
        this.selectedIds = newEntities.map(e => e.id);
        return newEntities;
    }

    offsetEntity(entity, offset) {
        switch (entity.type) {
            case 'line':
                entity.p1.x += offset.x;
                entity.p1.y += offset.y;
                entity.p2.x += offset.x;
                entity.p2.y += offset.y;
                break;
            case 'circle':
            case 'arc':
                entity.center.x += offset.x;
                entity.center.y += offset.y;
                break;
            case 'rect':
                entity.p1.x += offset.x;
                entity.p1.y += offset.y;
                entity.p2.x += offset.x;
                entity.p2.y += offset.y;
                break;
            case 'polyline':
                entity.points.forEach(p => {
                    p.x += offset.x;
                    p.y += offset.y;
                });
                break;
            case 'ellipse':
                entity.center.x += offset.x;
                entity.center.y += offset.y;
                break;
            case 'text':
                entity.position.x += offset.x;
                entity.position.y += offset.y;
                break;
        }
    }

    // ==========================================
    // COMMAND STATE MANAGEMENT
    // ==========================================

    startCommand(name) {
        this.activeCmd = name;
        this.step = 0;
        this.points = [];
        this.targetId = null;
        this.lineChainStart = null;
        this.cmdOptions = {};
        // Clear selection mode when starting a command
        this.selectionMode = false;
        this.selectStart = null;
    }

    finishCommand() {
        this.activeCmd = null;
        this.points = [];
        this.step = 0;
        this.lineChainStart = null;
        this.cmdOptions = {};
        // Clear selection mode when finishing
        this.selectionMode = false;
        this.selectStart = null;
    }

    cancelCommand() {
        this.finishCommand();
    }

    // ==========================================
    // VIEW OPERATIONS
    // ==========================================

    zoomIn(factor = 1.2) {
        this.zoom *= factor;
    }

    zoomOut(factor = 1.2) {
        this.zoom /= factor;
    }

    zoomExtents(canvasWidth, canvasHeight, padding = 50) {
        if (this.entities.length === 0) {
            this.zoom = 1;
            this.pan = { x: canvasWidth / 2, y: canvasHeight / 2 };
            return;
        }

        // Calculate bounding box of all entities
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        this.entities.forEach(entity => {
            const ext = this.getEntityExtents(entity);
            if (ext) {
                minX = Math.min(minX, ext.minX);
                minY = Math.min(minY, ext.minY);
                maxX = Math.max(maxX, ext.maxX);
                maxY = Math.max(maxY, ext.maxY);
            }
        });

        if (minX === Infinity) return;

        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scaleX = (canvasWidth - padding * 2) / width;
        const scaleY = (canvasHeight - padding * 2) / height;
        this.zoom = Math.min(scaleX, scaleY, 10);

        this.pan.x = canvasWidth / 2 - centerX * this.zoom;
        this.pan.y = canvasHeight / 2 - centerY * this.zoom;
    }

    getEntityExtents(entity) {
        switch (entity.type) {
            case 'line':
                return {
                    minX: Math.min(entity.p1.x, entity.p2.x),
                    maxX: Math.max(entity.p1.x, entity.p2.x),
                    minY: Math.min(entity.p1.y, entity.p2.y),
                    maxY: Math.max(entity.p1.y, entity.p2.y)
                };
            case 'circle':
                return {
                    minX: entity.center.x - entity.r,
                    maxX: entity.center.x + entity.r,
                    minY: entity.center.y - entity.r,
                    maxY: entity.center.y + entity.r
                };
            case 'arc':
                // Simplified - use circle bounds
                return {
                    minX: entity.center.x - entity.r,
                    maxX: entity.center.x + entity.r,
                    minY: entity.center.y - entity.r,
                    maxY: entity.center.y + entity.r
                };
            case 'rect':
                return {
                    minX: Math.min(entity.p1.x, entity.p2.x),
                    maxX: Math.max(entity.p1.x, entity.p2.x),
                    minY: Math.min(entity.p1.y, entity.p2.y),
                    maxY: Math.max(entity.p1.y, entity.p2.y)
                };
            case 'polyline':
                const xs = entity.points.map(p => p.x);
                const ys = entity.points.map(p => p.y);
                return {
                    minX: Math.min(...xs),
                    maxX: Math.max(...xs),
                    minY: Math.min(...ys),
                    maxY: Math.max(...ys)
                };
            case 'ellipse':
                return {
                    minX: entity.center.x - entity.rx,
                    maxX: entity.center.x + entity.rx,
                    minY: entity.center.y - entity.ry,
                    maxY: entity.center.y + entity.ry
                };
            case 'text':
                // Approximate text bounds
                const textWidth = entity.text.length * entity.height * 0.6;
                return {
                    minX: entity.position.x,
                    maxX: entity.position.x + textWidth,
                    minY: entity.position.y - entity.height,
                    maxY: entity.position.y
                };
            case 'donut':
                return {
                    minX: entity.center.x - entity.outerRadius,
                    maxX: entity.center.x + entity.outerRadius,
                    minY: entity.center.y - entity.outerRadius,
                    maxY: entity.center.y + entity.outerRadius
                };
            case 'point':
                return {
                    minX: entity.position.x - 1,
                    maxX: entity.position.x + 1,
                    minY: entity.position.y - 1,
                    maxY: entity.position.y + 1
                };
            case 'dimension':
                if (entity.dimType === 'linear' || entity.dimType === 'aligned') {
                    return {
                        minX: Math.min(entity.p1.x, entity.p2.x, entity.dimLinePos.x),
                        maxX: Math.max(entity.p1.x, entity.p2.x, entity.dimLinePos.x),
                        minY: Math.min(entity.p1.y, entity.p2.y, entity.dimLinePos.y),
                        maxY: Math.max(entity.p1.y, entity.p2.y, entity.dimLinePos.y)
                    };
                } else if (entity.dimType === 'radius' || entity.dimType === 'diameter') {
                    return {
                        minX: entity.center.x - entity.radius,
                        maxX: entity.center.x + entity.radius,
                        minY: entity.center.y - entity.radius,
                        maxY: entity.center.y + entity.radius
                    };
                }
                return null;
            default:
                return null;
        }
    }

    // ==========================================
    // SERIALIZATION
    // ==========================================

    toJSON() {
        return {
            version: '1.0',
            name: this.drawingName,
            layers: this.layers,
            currentLayer: this.currentLayer,
            entities: this.entities,
            view: {
                pan: this.pan,
                zoom: this.zoom
            },
            settings: {
                gridSize: this.gridSize,
                gridSpacing: this.gridSpacing,
                snapEnabled: this.snapEnabled,
                snapModes: this.snapModes,
                orthoEnabled: this.orthoEnabled
            }
        };
    }

    fromJSON(data) {
        if (data.version) {
            this.drawingName = data.name || 'Untitled';
            this.layers = data.layers || this.layers;
            this.currentLayer = data.currentLayer || '0';
            this.entities = data.entities || [];

            if (data.view) {
                this.pan = data.view.pan || this.pan;
                this.zoom = data.view.zoom || this.zoom;
            }

            if (data.settings) {
                this.gridSize = data.settings.gridSize || this.gridSize;
                this.gridSpacing = data.settings.gridSpacing || this.gridSpacing;
                this.snapEnabled = data.settings.snapEnabled !== false;
                this.snapModes = { ...this.snapModes, ...data.settings.snapModes };
                this.orthoEnabled = data.settings.orthoEnabled || false;
            }

            // Reset undo stack on load
            this.undoStack = [];
            this.redoStack = [];
            this.modified = false;
        }
    }

    clear() {
        this.saveUndoState('Clear Drawing');
        this.entities = [];
        this.selectedIds = [];
        this.modified = true;
    }

    newDrawing() {
        this.entities = [];
        this.selectedIds = [];
        this.layers = [
            { name: '0', color: '#ffffff', visible: true, locked: false, lineWeight: 'Default' }
        ];
        this.currentLayer = '0';
        this.pan = { x: 0, y: 0 };
        this.zoom = 1;
        this.undoStack = [];
        this.redoStack = [];
        this.drawingName = 'Untitled';
        this.modified = false;
    }
}

// Create global state instance
const CAD = new StateManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CAD, StateManager, generateId };
}
