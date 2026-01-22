/* ============================================
   HTMLCAD - UI Module
   ============================================ */

const UI = {
    elements: {},
    activeButton: null,
    commandHistory: [],
    historyIndex: -1,
    lastCommand: null,
    maxHistorySize: 50,

    // ==========================================
    // INITIALIZATION
    // ==========================================

    init() {
        // Cache DOM elements
        this.elements = {
            cmdInput: document.getElementById('cmdInput'),
            cmdHistory: document.getElementById('cmdHistory'),
            coordDisplay: document.getElementById('coordDisplay'),
            layerSelect: document.getElementById('layerSelect'),
            layerColor: document.getElementById('layerColor'),
            statusSnap: document.getElementById('statusSnap'),
            statusGrid: document.getElementById('statusGrid'),
            statusOrtho: document.getElementById('statusOrtho'),
            statusPolar: document.getElementById('statusPolar'),
            propertiesPanel: document.getElementById('propertiesPanel')
        };

        // Setup event listeners
        this.setupEventListeners();
        this.updateLayerUI();
        this.updateStatusBar();

        // Focus command line
        this.focusCommandLine();

        return this;
    },

    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    setupEventListeners() {
        // Command input handling
        if (this.elements.cmdInput) {
            this.elements.cmdInput.addEventListener('keydown', (e) => {
                this.handleCommandInput(e);
            });
        }

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Prevent text selection during CAD operations, but allow in command history
        document.addEventListener('selectstart', (e) => {
            // Allow selection in INPUT elements and command history
            if (e.target.tagName === 'INPUT' ||
                e.target.closest('.command-history') ||
                e.target.closest('.properties-panel')) {
                return; // Allow selection
            }
            e.preventDefault();
        });
    },

    handleCommandInput(e) {
        const input = this.elements.cmdInput;
        const currentValue = input.value;

        // For LISP expressions (starting with '('), don't treat space as Enter
        // This allows typing multi-word LISP code like (command "circle" '(0 0) 50)
        if (e.key === ' ' && currentValue.startsWith('(')) {
            // Allow space in LISP expressions - don't intercept
            return;
        }

        // Handle Enter and Space keys (Space acts like Enter in AutoCAD)
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const value = currentValue.trim();

            // Space or Enter with empty input - repeat last command or act as Enter
            if (!value) {
                if (CAD.activeCmd) {
                    // During active command, space/enter confirms or finishes
                    Commands.handleInput('');
                } else if (this.lastCommand) {
                    // No active command - repeat last command
                    this.log(`Command: ${this.lastCommand}`, 'input');
                    Commands.execute(this.lastCommand);
                }
                input.value = '';
                return;
            }

            // Check for LISP expression
            if (value.startsWith('(')) {
                this.log(`LISP: ${value}`, 'input');
                this.addToHistory(value);
                AutoLISP.execute(value).then(result => {
                    if (result !== null && result !== undefined) {
                        this.log(AutoLISP.toString(result), 'success');
                    }
                });
                input.value = '';
                return;
            }

            this.log(`Command: ${value}`, 'input');
            this.addToHistory(value);

            // Try to handle as coordinate/input first
            if (Commands.handleInput(value)) {
                input.value = '';
                return;
            }

            // Store as last command for repeat
            this.lastCommand = value;

            // Otherwise treat as command
            Commands.execute(value);
            input.value = '';
            this.historyIndex = -1;

        } else if (e.key === 'Escape') {
            e.preventDefault();
            Commands.cancelCommand();
            input.value = '';
            this.historyIndex = -1;

        } else if (e.key === 'ArrowUp') {
            // Navigate command history (up)
            e.preventDefault();
            if (this.commandHistory.length > 0) {
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                }
                input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            }

        } else if (e.key === 'ArrowDown') {
            // Navigate command history (down)
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            } else {
                this.historyIndex = -1;
                input.value = '';
            }

        } else if (e.key === 'Tab') {
            // Tab completion for commands
            e.preventDefault();
            this.autoCompleteCommand(input);
        }
    },

    addToHistory(command) {
        // Don't add duplicates consecutively
        if (this.commandHistory.length > 0 &&
            this.commandHistory[this.commandHistory.length - 1] === command) {
            return;
        }

        this.commandHistory.push(command);

        // Limit history size
        if (this.commandHistory.length > this.maxHistorySize) {
            this.commandHistory.shift();
        }
    },

    autoCompleteCommand(input) {
        const value = input.value.toLowerCase().trim();
        if (!value) return;

        // Find matching commands
        const commands = Object.keys(Commands.aliases);
        const matches = commands.filter(cmd => cmd.startsWith(value));

        if (matches.length === 1) {
            input.value = matches[0].toUpperCase();
        } else if (matches.length > 1) {
            // Show available completions
            this.log(`Completions: ${matches.slice(0, 10).join(', ')}${matches.length > 10 ? '...' : ''}`);
        }
    },

    handleKeyboard(e) {
        // Don't handle if typing in input (except specific keys)
        if (e.target.tagName === 'INPUT') {
            // Allow F-keys even in input
            if (!e.key.startsWith('F')) return;
        }

        // Escape - cancel current operation
        if (e.key === 'Escape') {
            e.preventDefault();
            Commands.cancelCommand();
            return;
        }

        // Space or Enter - repeat last command or act as Enter for active command
        if ((e.key === ' ' || e.key === 'Enter') && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (CAD.activeCmd) {
                // Active command - act as Enter to confirm/finish
                Commands.handleInput('');
                Renderer.draw();
            } else if (this.lastCommand) {
                // No active command - repeat last command
                this.log(`Command: ${this.lastCommand}`, 'input');
                Commands.execute(this.lastCommand);
            }
            this.focusCommandLine();
            return;
        }

        // Delete - erase selected
        if (e.key === 'Delete' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (CAD.selectedIds.length > 0) {
                Commands.startCommand('erase');
            }
            return;
        }

        // Ctrl+Z - Undo
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            Commands.undo();
            return;
        }

        // Ctrl+Y or Ctrl+Shift+Z - Redo
        if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
            e.preventDefault();
            Commands.redo();
            return;
        }

        // Ctrl+A - Select all
        if (e.ctrlKey && e.key === 'a' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            CAD.selectAll();
            this.log(`${CAD.selectedIds.length} objects selected.`);
            Renderer.draw();
            return;
        }

        // Ctrl+C - Copy
        if (e.ctrlKey && e.key === 'c' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            const count = CAD.copyToClipboard();
            if (count > 0) {
                this.log(`${count} objects copied to clipboard.`);
            }
            return;
        }

        // Ctrl+V - Paste
        if (e.ctrlKey && e.key === 'v' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            const pasted = CAD.paste();
            if (pasted.length > 0) {
                this.log(`${pasted.length} objects pasted.`);
                Renderer.draw();
            }
            return;
        }

        // Ctrl+S - Save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            Storage.saveToLocalStorage();
            return;
        }

        // Ctrl+O - Open
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            Storage.loadFromLocalStorage();
            return;
        }

        // F1 - Help
        if (e.key === 'F1') {
            e.preventDefault();
            this.showHelp();
            return;
        }

        // F2 - Toggle grid
        if (e.key === 'F2') {
            e.preventDefault();
            CAD.showGrid = !CAD.showGrid;
            this.log(`Grid: ${CAD.showGrid ? 'ON' : 'OFF'}`);
            this.updateStatusBar();
            Renderer.draw();
            return;
        }

        // F3 - Toggle snap
        if (e.key === 'F3') {
            e.preventDefault();
            CAD.snapEnabled = !CAD.snapEnabled;
            this.log(`Snap: ${CAD.snapEnabled ? 'ON' : 'OFF'}`);
            this.updateStatusBar();
            return;
        }

        // F7 - Toggle grid display
        if (e.key === 'F7') {
            e.preventDefault();
            CAD.showGrid = !CAD.showGrid;
            this.log(`Grid display: ${CAD.showGrid ? 'ON' : 'OFF'}`);
            this.updateStatusBar();
            Renderer.draw();
            return;
        }

        // F8 - Toggle ortho
        if (e.key === 'F8') {
            e.preventDefault();
            CAD.orthoEnabled = !CAD.orthoEnabled;
            this.log(`Ortho: ${CAD.orthoEnabled ? 'ON' : 'OFF'}`);
            this.updateStatusBar();
            return;
        }

        // F9 - Toggle snap
        if (e.key === 'F9') {
            e.preventDefault();
            CAD.snapModes.grid = !CAD.snapModes.grid;
            this.log(`Snap to grid: ${CAD.snapModes.grid ? 'ON' : 'OFF'}`);
            return;
        }

        // F10 - Toggle polar
        if (e.key === 'F10') {
            e.preventDefault();
            CAD.polarEnabled = !CAD.polarEnabled;
            this.log(`Polar: ${CAD.polarEnabled ? 'ON' : 'OFF'}`);
            this.updateStatusBar();
            return;
        }

        // Letter keys - focus command line
        if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1 && e.target.tagName !== 'INPUT') {
            this.focusCommandLine();
        }
    },

    // ==========================================
    // HELP
    // ==========================================

    showHelp() {
        const helpText = `
HTMLCAD Quick Reference:

DRAWING COMMANDS:
  L, LINE       - Draw lines
  PL, PLINE     - Draw polylines
  C, CIRCLE     - Draw circles
  A, ARC        - Draw arcs
  REC, RECT     - Draw rectangles
  EL, ELLIPSE   - Draw ellipses
  T, TEXT       - Add text
  POL, POLYGON  - Draw regular polygons
  DO, DONUT     - Draw donuts
  RAY           - Draw rays
  XL, XLINE     - Draw construction lines
  SPL, SPLINE   - Draw splines
  H, HATCH      - Hatch closed areas

MODIFY COMMANDS:
  M, MOVE       - Move objects
  CO, COPY      - Copy objects
  RO, ROTATE    - Rotate objects
  SC, SCALE     - Scale objects
  MI, MIRROR    - Mirror objects
  O, OFFSET     - Offset objects
  TR, TRIM      - Trim objects
  E, ERASE      - Erase objects
  X, EXPLODE    - Explode objects
  AR, ARRAY     - Rectangular array
  ARRAYPOLAR    - Polar array
  F, FILLET     - Fillet corners (R for radius)
  CHA, CHAMFER  - Chamfer corners (D for distance)
  BR, BREAK     - Break objects

DIMENSION COMMANDS:
  DIM, DIMLIN   - Linear dimension
  DIMALIGNED    - Aligned dimension
  DIMRAD        - Radius dimension
  DIMDIA        - Diameter dimension

UTILITY COMMANDS:
  U, UNDO       - Undo last action
  REDO          - Redo last undo
  Z, ZOOM       - Zoom view (E=extents)
  P, PAN        - Pan view
  DIST, DI      - Measure distance
  AREA, AA      - Measure area
  LIST, LI      - List object properties

KEYBOARD SHORTCUTS:
  Space/Enter   - Execute command / Repeat last
  Escape        - Cancel command
  Delete        - Erase selected
  Ctrl+Z        - Undo
  Ctrl+Y        - Redo
  Ctrl+C/V      - Copy/Paste
  Ctrl+A        - Select all
  F2            - Toggle grid
  F3            - Toggle object snap
  F8            - Toggle ortho mode
  Arrow Up/Down - Command history

AUTOLISP:
  Type (expression) to execute AutoLISP code
  Example: (+ 1 2 3) => 6
  Example: (command "circle" '(0 0) 50)
  Example: (setq x 10)
        `;
        this.log(helpText);
    },

    // ==========================================
    // COMMAND LINE LOGGING
    // ==========================================

    log(message, type = 'default') {
        if (!this.elements.cmdHistory) return;

        const line = document.createElement('div');
        line.className = `line ${type}`;
        line.textContent = message;

        this.elements.cmdHistory.appendChild(line);
        this.elements.cmdHistory.scrollTop = this.elements.cmdHistory.scrollHeight;
    },

    clearHistory() {
        if (this.elements.cmdHistory) {
            this.elements.cmdHistory.innerHTML = '';
        }
    },

    focusCommandLine() {
        if (this.elements.cmdInput) {
            this.elements.cmdInput.focus();
        }
    },

    // ==========================================
    // TOOLBAR MANAGEMENT
    // ==========================================

    setActiveButton(cmdName) {
        // Remove active class from all buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        this.activeButton = cmdName;

        // Store as last command
        if (cmdName) {
            this.lastCommand = cmdName;
        }

        // Add active class to matching button
        if (cmdName) {
            const btn = document.querySelector(`[data-cmd="${cmdName}"]`);
            if (btn) {
                btn.classList.add('active');
            }
        }
    },

    // ==========================================
    // COORDINATE DISPLAY
    // ==========================================

    updateCoordinates(x, y) {
        if (this.elements.coordDisplay) {
            this.elements.coordDisplay.textContent =
                `${x.toFixed(4)}, ${y.toFixed(4)}, 0.0000`;
        }
    },

    // ==========================================
    // STATUS BAR
    // ==========================================

    updateStatusBar() {
        if (this.elements.statusSnap) {
            this.elements.statusSnap.classList.toggle('active', CAD.snapEnabled);
        }
        if (this.elements.statusGrid) {
            this.elements.statusGrid.classList.toggle('active', CAD.showGrid);
        }
        if (this.elements.statusOrtho) {
            this.elements.statusOrtho.classList.toggle('active', CAD.orthoEnabled);
        }
        if (this.elements.statusPolar) {
            this.elements.statusPolar.classList.toggle('active', CAD.polarEnabled);
        }
    },

    toggleSnap() {
        CAD.snapEnabled = !CAD.snapEnabled;
        this.log(`Snap: ${CAD.snapEnabled ? 'ON' : 'OFF'}`);
        this.updateStatusBar();
    },

    toggleGrid() {
        CAD.showGrid = !CAD.showGrid;
        this.log(`Grid: ${CAD.showGrid ? 'ON' : 'OFF'}`);
        this.updateStatusBar();
        Renderer.draw();
    },

    toggleOrtho() {
        CAD.orthoEnabled = !CAD.orthoEnabled;
        this.log(`Ortho: ${CAD.orthoEnabled ? 'ON' : 'OFF'}`);
        this.updateStatusBar();
    },

    togglePolar() {
        CAD.polarEnabled = !CAD.polarEnabled;
        this.log(`Polar: ${CAD.polarEnabled ? 'ON' : 'OFF'}`);
        this.updateStatusBar();
    },

    // ==========================================
    // LAYER MANAGEMENT
    // ==========================================

    updateLayerUI() {
        const select = this.elements.layerSelect;
        if (!select) return;

        select.innerHTML = '';

        CAD.layers.forEach(layer => {
            const option = document.createElement('option');
            option.value = layer.name;
            option.textContent = layer.name;
            option.style.color = layer.color;
            select.appendChild(option);
        });

        select.value = CAD.currentLayer;

        // Update color picker
        if (this.elements.layerColor) {
            const currentLayer = CAD.getLayer(CAD.currentLayer);
            if (currentLayer) {
                this.elements.layerColor.value = currentLayer.color;
            }
        }
    },

    onLayerChange() {
        const select = this.elements.layerSelect;
        if (select) {
            CAD.setCurrentLayer(select.value);
            this.updateLayerUI();
            this.log(`Current layer: ${CAD.currentLayer}`);
        }
    },

    onLayerColorChange() {
        const colorInput = this.elements.layerColor;
        if (colorInput) {
            CAD.updateLayerColor(CAD.currentLayer, colorInput.value);
            Renderer.draw();
        }
    },

    addNewLayer() {
        const name = prompt('Enter layer name:', `Layer${CAD.layers.length}`);
        if (name) {
            if (CAD.addLayer(name)) {
                CAD.setCurrentLayer(name);
                this.updateLayerUI();
                this.log(`Layer "${name}" created and set current.`);
            } else {
                this.log(`Layer "${name}" already exists.`, 'error');
            }
        }
    },

    // ==========================================
    // PROPERTIES PANEL
    // ==========================================

    togglePropertiesPanel() {
        const panel = document.getElementById('panelLeft');
        const toggle = document.getElementById('panelToggle');
        if (panel) {
            panel.classList.toggle('collapsed');
        }
    },

    // ==========================================
    // SELECTION RIBBON
    // ==========================================

    updateSelectionRibbon() {
        const ribbon = document.getElementById('selectionRibbon');
        const countEl = document.getElementById('selectionCount');
        if (!ribbon) return;

        const selectedCount = CAD.selectedIds ? CAD.selectedIds.length : 0;

        if (selectedCount > 0) {
            ribbon.style.display = 'flex';
            if (countEl) countEl.textContent = selectedCount;
        } else {
            ribbon.style.display = 'none';
        }
    },

    updatePropertiesPanel() {
        const panel = this.elements.propertiesPanel;
        if (!panel) return;

        // Also update selection ribbon
        this.updateSelectionRibbon();

        const selected = CAD.getSelectedEntities();

        if (selected.length === 0) {
            panel.innerHTML = '<div class="property-group"><p style="color: var(--text-muted);">No selection</p></div>';
            return;
        }

        if (selected.length === 1) {
            const entity = selected[0];
            panel.innerHTML = this.getEntityProperties(entity);
        } else {
            panel.innerHTML = `
                <div class="property-group">
                    <div class="property-group-title">Selection</div>
                    <div class="property-row">
                        <span class="property-label">Objects</span>
                        <span class="property-value">${selected.length}</span>
                    </div>
                </div>
            `;
        }
    },

    getEntityProperties(entity) {
        let html = `
            <div class="property-group">
                <div class="property-group-title">General</div>
                <div class="property-row">
                    <span class="property-label">Type</span>
                    <span class="property-value">${entity.type.toUpperCase()}</span>
                </div>
                <div class="property-row">
                    <span class="property-label">Layer</span>
                    <span class="property-value">${entity.layer}</span>
                </div>
            </div>
        `;

        switch (entity.type) {
            case 'line':
                html += `
                    <div class="property-group">
                        <div class="property-group-title">Geometry</div>
                        <div class="property-row">
                            <span class="property-label">Start X</span>
                            <span class="property-value">${entity.p1.x.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Start Y</span>
                            <span class="property-value">${entity.p1.y.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">End X</span>
                            <span class="property-value">${entity.p2.x.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">End Y</span>
                            <span class="property-value">${entity.p2.y.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Length</span>
                            <span class="property-value">${Utils.dist(entity.p1, entity.p2).toFixed(4)}</span>
                        </div>
                    </div>
                `;
                break;

            case 'circle':
                html += `
                    <div class="property-group">
                        <div class="property-group-title">Geometry</div>
                        <div class="property-row">
                            <span class="property-label">Center X</span>
                            <span class="property-value">${entity.center.x.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Center Y</span>
                            <span class="property-value">${entity.center.y.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Radius</span>
                            <span class="property-value">${entity.r.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Diameter</span>
                            <span class="property-value">${(entity.r * 2).toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Circumference</span>
                            <span class="property-value">${(2 * Math.PI * entity.r).toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Area</span>
                            <span class="property-value">${(Math.PI * entity.r * entity.r).toFixed(4)}</span>
                        </div>
                    </div>
                `;
                break;

            case 'arc':
                html += `
                    <div class="property-group">
                        <div class="property-group-title">Geometry</div>
                        <div class="property-row">
                            <span class="property-label">Center X</span>
                            <span class="property-value">${entity.center.x.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Center Y</span>
                            <span class="property-value">${entity.center.y.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Radius</span>
                            <span class="property-value">${entity.r.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Start Angle</span>
                            <span class="property-value">${(entity.start * 180 / Math.PI).toFixed(2)}°</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">End Angle</span>
                            <span class="property-value">${(entity.end * 180 / Math.PI).toFixed(2)}°</span>
                        </div>
                    </div>
                `;
                break;

            case 'rect':
                const width = Math.abs(entity.p2.x - entity.p1.x);
                const height = Math.abs(entity.p2.y - entity.p1.y);
                html += `
                    <div class="property-group">
                        <div class="property-group-title">Geometry</div>
                        <div class="property-row">
                            <span class="property-label">Corner 1 X</span>
                            <span class="property-value">${entity.p1.x.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Corner 1 Y</span>
                            <span class="property-value">${entity.p1.y.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Width</span>
                            <span class="property-value">${width.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Height</span>
                            <span class="property-value">${height.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Area</span>
                            <span class="property-value">${(width * height).toFixed(4)}</span>
                        </div>
                    </div>
                `;
                break;

            case 'polyline':
                html += `
                    <div class="property-group">
                        <div class="property-group-title">Geometry</div>
                        <div class="property-row">
                            <span class="property-label">Vertices</span>
                            <span class="property-value">${entity.points.length}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Closed</span>
                            <span class="property-value">${Utils.isPolygonClosed(entity.points) ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                `;
                break;

            case 'ellipse':
                html += `
                    <div class="property-group">
                        <div class="property-group-title">Geometry</div>
                        <div class="property-row">
                            <span class="property-label">Center X</span>
                            <span class="property-value">${entity.center.x.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Center Y</span>
                            <span class="property-value">${entity.center.y.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Major Radius</span>
                            <span class="property-value">${entity.rx.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Minor Radius</span>
                            <span class="property-value">${entity.ry.toFixed(4)}</span>
                        </div>
                    </div>
                `;
                break;

            case 'text':
                html += `
                    <div class="property-group">
                        <div class="property-group-title">Text</div>
                        <div class="property-row">
                            <span class="property-label">Content</span>
                            <span class="property-value">${entity.text}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Height</span>
                            <span class="property-value">${entity.height.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Position X</span>
                            <span class="property-value">${entity.position.x.toFixed(4)}</span>
                        </div>
                        <div class="property-row">
                            <span class="property-label">Position Y</span>
                            <span class="property-value">${entity.position.y.toFixed(4)}</span>
                        </div>
                    </div>
                `;
                break;
        }

        return html;
    },

    // ==========================================
    // CONTEXT MENU
    // ==========================================

    showContextMenu(x, y) {
        const menu = document.getElementById('contextMenu');
        if (!menu) return;

        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.classList.add('visible');

        // Update menu items based on selection
        this.updateContextMenuItems();

        // Close on click outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.classList.remove('visible');
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    },

    hideContextMenu() {
        const menu = document.getElementById('contextMenu');
        if (menu) {
            menu.classList.remove('visible');
        }
    },

    updateContextMenuItems() {
        const hasSelection = CAD.selectedIds.length > 0;

        document.querySelectorAll('.context-menu-item[data-requires-selection]').forEach(item => {
            item.style.display = hasSelection ? 'flex' : 'none';
        });
    },

    // ==========================================
    // MODAL DIALOGS
    // ==========================================

    showModal(title, content, buttons = []) {
        const overlay = document.getElementById('modalOverlay');
        if (!overlay) return;

        const modal = overlay.querySelector('.modal');
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;

        const footer = modal.querySelector('.modal-footer');
        footer.innerHTML = '';

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `btn ${btn.primary ? 'btn-primary' : ''}`;
            button.textContent = btn.label;
            button.onclick = () => {
                if (btn.action) btn.action();
                this.hideModal();
            };
            footer.appendChild(button);
        });

        overlay.classList.add('visible');
    },

    hideModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    },

    // ==========================================
    // RIBBON TAB SWITCHING
    // ==========================================

    switchRibbonTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.ribbon-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.ribbon-content').forEach(content => {
            content.style.display = content.dataset.tab === tabName ? 'flex' : 'none';
        });
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
