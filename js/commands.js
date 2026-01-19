/* ============================================
   HTMLCAD - Commands Module
   ============================================ */

const Commands = {
    // Command aliases (AutoCAD-like shortcuts)
    aliases: {
        // Drawing commands
        'l': 'line',
        'line': 'line',
        'pl': 'polyline',
        'pline': 'polyline',
        'c': 'circle',
        'circle': 'circle',
        'a': 'arc',
        'arc': 'arc',
        'rec': 'rect',
        'rect': 'rect',
        'rectangle': 'rect',
        'el': 'ellipse',
        'ellipse': 'ellipse',
        't': 'text',
        'text': 'text',
        'dt': 'text',
        'dtext': 'text',
        'po': 'point',
        'point': 'point',
        'pol': 'polygon',
        'polygon': 'polygon',
        'ray': 'ray',
        'xl': 'xline',
        'xline': 'xline',
        'spl': 'spline',
        'spline': 'spline',
        'do': 'donut',
        'donut': 'donut',
        'doughnut': 'donut',

        // Modify commands
        'e': 'erase',
        'erase': 'erase',
        'del': 'erase',
        'delete': 'erase',
        'm': 'move',
        'move': 'move',
        'co': 'copy',
        'cp': 'copy',
        'copy': 'copy',
        'ro': 'rotate',
        'rotate': 'rotate',
        'sc': 'scale',
        'scale': 'scale',
        'mi': 'mirror',
        'mirror': 'mirror',
        'o': 'offset',
        'offset': 'offset',
        'tr': 'trim',
        'trim': 'trim',
        'ex': 'extend',
        'extend': 'extend',
        'f': 'fillet',
        'fillet': 'fillet',
        'ch': 'chamfer',
        'chamfer': 'chamfer',
        'x': 'explode',
        'explode': 'explode',
        'j': 'join',
        'join': 'join',
        'h': 'hatch',
        'hatch': 'hatch',
        'bh': 'hatch',
        'ar': 'array',
        'array': 'array',
        'arrayrect': 'arrayrect',
        'arraypolar': 'arraypolar',
        'br': 'break',
        'break': 'break',
        'len': 'lengthen',
        'lengthen': 'lengthen',
        's': 'stretch',
        'stretch': 'stretch',

        // Dimension commands
        'dim': 'dimlinear',
        'dimlin': 'dimlinear',
        'dimlinear': 'dimlinear',
        'dimaligned': 'dimaligned',
        'dimang': 'dimangular',
        'dimangular': 'dimangular',
        'dimrad': 'dimradius',
        'dimradius': 'dimradius',
        'dimdia': 'dimdiameter',
        'dimdiameter': 'dimdiameter',

        // Utility commands
        'u': 'undo',
        'undo': 'undo',
        'redo': 'redo',
        'z': 'zoom',
        'zoom': 'zoom',
        'p': 'pan',
        'pan': 'pan',
        're': 'regen',
        'regen': 'regen',
        'redraw': 'regen',
        'la': 'layer',
        'layer': 'layer',
        'id': 'id',
        'dist': 'distance',
        'di': 'distance',
        'distance': 'distance',
        'area': 'area',
        'aa': 'area',
        'list': 'list',
        'li': 'list',

        // Selection
        'all': 'selectall',
        'selectall': 'selectall',

        // File operations
        'new': 'new',
        'save': 'save',
        'saveas': 'saveas',
        'open': 'open',
        'export': 'export',
        'dxfout': 'export',

        // Settings
        'grid': 'grid',
        'snap': 'snap',
        'ortho': 'ortho',
        'osnap': 'osnap',

        // Close/End options (handled specially in execute() when activeCmd exists)
        'close': 'close'
    },

    // ==========================================
    // COMMAND EXECUTION
    // ==========================================

    execute(input) {
        const parts = input.toLowerCase().trim().split(/\s+/);
        const cmdName = parts[0];
        const args = parts.slice(1);

        // Check for close command during active drawing
        if ((cmdName === 'c' || cmdName === 'close') && CAD.activeCmd) {
            this.closeShape();
            return;
        }

        const command = this.aliases[cmdName];
        if (!command) {
            UI.log(`Unknown command: ${cmdName}`, 'error');
            return;
        }

        // Execute the command
        this.startCommand(command, args);
    },

    startCommand(name, args = []) {
        // Finish any active command first
        if (CAD.activeCmd) {
            this.finishCommand();
        }

        CAD.startCommand(name);
        UI.setActiveButton(name);

        switch (name) {
            // Drawing commands
            case 'line':
                UI.log('LINE: Specify first point:', 'prompt');
                break;

            case 'polyline':
                UI.log('PLINE: Specify start point:', 'prompt');
                break;

            case 'circle':
                UI.log('CIRCLE: Specify center point or [3P/2P/Ttr]:', 'prompt');
                break;

            case 'arc':
                UI.log('ARC: Specify center point:', 'prompt');
                break;

            case 'rect':
                UI.log('RECTANGLE: Specify first corner point:', 'prompt');
                break;

            case 'ellipse':
                UI.log('ELLIPSE: Specify axis endpoint 1:', 'prompt');
                break;

            case 'text':
                UI.log('TEXT: Specify start point of text:', 'prompt');
                break;

            case 'point':
                UI.log('POINT: Specify a point:', 'prompt');
                break;

            case 'polygon':
                UI.log('POLYGON: Enter number of sides <4>:', 'prompt');
                CAD.cmdOptions.sides = 4;
                break;

            case 'ray':
                UI.log('RAY: Specify start point:', 'prompt');
                break;

            case 'xline':
                UI.log('XLINE: Specify a point or [Hor/Ver/Ang]:', 'prompt');
                break;

            case 'spline':
                UI.log('SPLINE: Specify first point:', 'prompt');
                break;

            case 'donut':
                UI.log(`DONUT: Specify inside diameter <${CAD.cmdOptions.donutInner || 10}>:`, 'prompt');
                CAD.cmdOptions.donutInner = CAD.cmdOptions.donutInner || 10;
                CAD.cmdOptions.donutOuter = CAD.cmdOptions.donutOuter || 20;
                break;

            // Dimension commands
            case 'dimlinear':
                UI.log('DIMLINEAR: Specify first extension line origin:', 'prompt');
                break;

            case 'dimaligned':
                UI.log('DIMALIGNED: Specify first extension line origin:', 'prompt');
                break;

            case 'dimangular':
                UI.log('DIMANGULAR: Select arc, circle, line, or specify vertex:', 'prompt');
                break;

            case 'dimradius':
                UI.log('DIMRADIUS: Select arc or circle:', 'prompt');
                break;

            case 'dimdiameter':
                UI.log('DIMDIAMETER: Select arc or circle:', 'prompt');
                break;

            // Modify commands
            case 'erase':
                if (CAD.selectedIds.length > 0) {
                    this.deleteSelected();
                } else {
                    UI.log('ERASE: Select objects to erase:', 'prompt');
                    CAD.selectionMode = true;
                }
                break;

            case 'move':
                if (CAD.selectedIds.length === 0) {
                    UI.log('MOVE: Select objects to move:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('MOVE: Specify base point:', 'prompt');
                }
                break;

            case 'copy':
                if (CAD.selectedIds.length === 0) {
                    UI.log('COPY: Select objects to copy:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('COPY: Specify base point:', 'prompt');
                }
                break;

            case 'rotate':
                if (CAD.selectedIds.length === 0) {
                    UI.log('ROTATE: Select objects to rotate:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('ROTATE: Specify base point:', 'prompt');
                }
                break;

            case 'scale':
                if (CAD.selectedIds.length === 0) {
                    UI.log('SCALE: Select objects to scale:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('SCALE: Specify base point:', 'prompt');
                }
                break;

            case 'mirror':
                if (CAD.selectedIds.length === 0) {
                    UI.log('MIRROR: Select objects to mirror:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('MIRROR: Specify first point of mirror line:', 'prompt');
                }
                break;

            case 'offset':
                UI.log(`OFFSET: Specify offset distance <${CAD.offsetDist}>:`, 'prompt');
                break;

            case 'trim':
                UI.log('TRIM: Select cutting edges... (Press Enter when done)', 'prompt');
                CAD.cmdOptions.cuttingEdges = [];
                CAD.cmdOptions.selectingEdges = true;
                break;

            case 'extend':
                UI.log('EXTEND: Select boundary edges... (Press Enter when done)', 'prompt');
                CAD.cmdOptions.boundaryEdges = [];
                CAD.cmdOptions.selectingEdges = true;
                break;

            case 'hatch':
                UI.log('HATCH: Select closed object to hatch:', 'prompt');
                break;

            case 'explode':
                if (CAD.selectedIds.length > 0) {
                    this.explodeSelected();
                } else {
                    UI.log('EXPLODE: Select objects to explode:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                }
                break;

            case 'array':
            case 'arrayrect':
                if (CAD.selectedIds.length === 0) {
                    UI.log('ARRAY: Select objects to array:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('ARRAY: Enter number of rows <1>:', 'prompt');
                    CAD.cmdOptions.arrayRows = 1;
                    CAD.cmdOptions.arrayCols = 1;
                    CAD.cmdOptions.arrayType = 'rectangular';
                }
                break;

            case 'arraypolar':
                if (CAD.selectedIds.length === 0) {
                    UI.log('ARRAYPOLAR: Select objects to array:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('ARRAYPOLAR: Specify center point of array:', 'prompt');
                    CAD.cmdOptions.arrayType = 'polar';
                }
                break;

            case 'fillet':
                UI.log(`FILLET: Current radius = ${CAD.filletRadius || 0}. Select first object or [Radius]:`, 'prompt');
                CAD.filletRadius = CAD.filletRadius || 0;
                break;

            case 'chamfer':
                UI.log(`CHAMFER: Distances = ${CAD.chamferDist1 || 0}, ${CAD.chamferDist2 || 0}. Select first line or [Distance]:`, 'prompt');
                CAD.chamferDist1 = CAD.chamferDist1 || 0;
                CAD.chamferDist2 = CAD.chamferDist2 || 0;
                break;

            case 'break':
                UI.log('BREAK: Select object:', 'prompt');
                break;

            case 'lengthen':
                UI.log('LENGTHEN: Select an object or [DElta/Percent/Total/DYnamic]:', 'prompt');
                CAD.cmdOptions.lengthenMode = 'dynamic';
                break;

            case 'stretch':
                UI.log('STRETCH: Select objects to stretch by crossing-window:', 'prompt');
                CAD.cmdOptions.needSelection = true;
                CAD.selectionMode = true;
                break;

            case 'join':
                if (CAD.selectedIds.length === 0) {
                    UI.log('JOIN: Select source object:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('JOIN: Select objects to join to source:', 'prompt');
                }
                break;

            // Utility commands
            case 'undo':
                this.undo();
                break;

            case 'redo':
                this.redo();
                break;

            case 'zoom':
                if (args[0] === 'e' || args[0] === 'extents') {
                    this.zoomExtents();
                } else if (args[0] === 'a' || args[0] === 'all') {
                    this.zoomExtents();
                } else {
                    UI.log('ZOOM: [All/Center/Extents/Window] <realtime>:', 'prompt');
                }
                break;

            case 'pan':
                UI.log('PAN: Use middle mouse button or Shift+Left click to pan', 'prompt');
                this.finishCommand();
                break;

            case 'regen':
                Renderer.draw();
                UI.log('Regenerating model.');
                this.finishCommand();
                break;

            case 'selectall':
                CAD.selectAll();
                UI.log(`${CAD.selectedIds.length} objects selected.`);
                Renderer.draw();
                this.finishCommand();
                break;

            case 'distance':
                UI.log('DIST: Specify first point:', 'prompt');
                break;

            case 'area':
                UI.log('AREA: Specify first corner point or [Object]:', 'prompt');
                break;

            case 'id':
                UI.log('ID: Specify point:', 'prompt');
                break;

            case 'list':
                this.listSelected();
                this.finishCommand();
                break;

            case 'grid':
                CAD.showGrid = !CAD.showGrid;
                UI.log(`Grid: ${CAD.showGrid ? 'ON' : 'OFF'}`);
                UI.updateStatusBar();
                Renderer.draw();
                this.finishCommand();
                break;

            case 'snap':
                CAD.snapEnabled = !CAD.snapEnabled;
                UI.log(`Snap: ${CAD.snapEnabled ? 'ON' : 'OFF'}`);
                UI.updateStatusBar();
                this.finishCommand();
                break;

            case 'ortho':
                CAD.orthoEnabled = !CAD.orthoEnabled;
                UI.log(`Ortho: ${CAD.orthoEnabled ? 'ON' : 'OFF'}`);
                UI.updateStatusBar();
                this.finishCommand();
                break;

            case 'new':
                if (confirm('Start a new drawing? All unsaved changes will be lost.')) {
                    CAD.newDrawing();
                    UI.log('New drawing started.');
                    Renderer.draw();
                    UI.updateLayerUI();
                }
                this.finishCommand();
                break;

            case 'save':
                Storage.saveToLocalStorage();
                this.finishCommand();
                break;

            case 'open':
                Storage.openFile();
                this.finishCommand();
                break;

            case 'export':
                Storage.exportDXF();
                this.finishCommand();
                break;

            default:
                UI.log(`Command "${name}" not yet implemented.`, 'error');
                this.finishCommand();
        }
    },

    // ==========================================
    // CLICK HANDLING
    // ==========================================

    handleClick(point) {
        const state = CAD;

        // Handle coordinate input from snap
        if (state.snapEnabled && state.snapPoint) {
            point = { ...state.snapPoint };
        }

        // Apply ortho mode
        if (state.orthoEnabled && state.points.length > 0) {
            point = Utils.applyOrtho(state.points[state.points.length - 1], point);
        }

        // Check if we need selection first
        if (state.cmdOptions.needSelection) {
            const hit = this.hitTest(point);
            if (hit) {
                state.select(hit.id);
                UI.log(`1 found, 1 total`);
            } else if (!state.selectionMode) {
                state.selectionMode = true;
                state.selectStart = point;
                UI.log('Specify opposite corner:');
                return;
            }

            if (state.selectedIds.length > 0) {
                state.cmdOptions.needSelection = false;
                this.continueCommand(state.activeCmd);
            }
            Renderer.draw();
            return;
        }

        // Handle selection mode
        if (state.selectionMode) {
            this.finishSelection(point);
            Renderer.draw();
            return;
        }

        // Handle active commands
        switch (state.activeCmd) {
            case 'line':
                this.handleLineClick(point);
                break;

            case 'polyline':
                this.handlePolylineClick(point);
                break;

            case 'circle':
                this.handleCircleClick(point);
                break;

            case 'arc':
                this.handleArcClick(point);
                break;

            case 'rect':
                this.handleRectClick(point);
                break;

            case 'ellipse':
                this.handleEllipseClick(point);
                break;

            case 'text':
                this.handleTextClick(point);
                break;

            case 'point':
                this.handlePointClick(point);
                break;

            case 'move':
                this.handleMoveClick(point);
                break;

            case 'copy':
                this.handleCopyClick(point);
                break;

            case 'rotate':
                this.handleRotateClick(point);
                break;

            case 'scale':
                this.handleScaleClick(point);
                break;

            case 'mirror':
                this.handleMirrorClick(point);
                break;

            case 'offset':
                this.handleOffsetClick(point);
                break;

            case 'trim':
                this.handleTrimClick(point);
                break;

            case 'hatch':
                this.handleHatchClick(point);
                break;

            case 'distance':
                this.handleDistanceClick(point);
                break;

            case 'area':
                this.handleAreaClick(point);
                break;

            case 'id':
                UI.log(`X = ${point.x.toFixed(4)}, Y = ${point.y.toFixed(4)}, Z = 0.0000`);
                this.finishCommand();
                break;

            case 'polygon':
                this.handlePolygonClick(point);
                break;

            case 'ray':
                this.handleRayClick(point);
                break;

            case 'xline':
                this.handleXLineClick(point);
                break;

            case 'spline':
                this.handleSplineClick(point);
                break;

            case 'donut':
                this.handleDonutClick(point);
                break;

            case 'array':
            case 'arrayrect':
                this.handleArrayClick(point);
                break;

            case 'arraypolar':
                this.handlePolarArrayClick(point);
                break;

            case 'fillet':
                this.handleFilletClick(point);
                break;

            case 'chamfer':
                this.handleChamferClick(point);
                break;

            case 'break':
                this.handleBreakClick(point);
                break;

            case 'dimlinear':
            case 'dimaligned':
                this.handleDimLinearClick(point);
                break;

            case 'dimradius':
            case 'dimdiameter':
                this.handleDimRadiusClick(point);
                break;

            default:
                // No active command - try to select
                this.handleSelectionClick(point);
        }

        Renderer.draw();
    },

    // ==========================================
    // DRAWING COMMAND HANDLERS
    // ==========================================

    handleLineClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.points.length === 1 && !state.lineChainStart) {
            state.lineChainStart = point;
        }

        if (state.points.length === 2) {
            CAD.addEntity({
                type: 'line',
                p1: { ...state.points[0] },
                p2: { ...state.points[1] }
            });
            state.points = [state.points[1]];
            UI.log('LINE: Specify next point or [Close/Undo]:', 'prompt');
        } else {
            UI.log('LINE: Specify next point:', 'prompt');
        }
    },

    handlePolylineClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.points.length === 1) {
            UI.log('PLINE: Specify next point or [Arc/Close/Undo]:', 'prompt');
        } else {
            UI.log('PLINE: Specify next point or [Arc/Close/Undo]:', 'prompt');
        }
    },

    handleCircleClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.points.length === 1) {
            UI.log('CIRCLE: Specify radius or [Diameter]:', 'prompt');
        } else if (state.points.length === 2) {
            const radius = Utils.dist(state.points[0], state.points[1]);
            CAD.addEntity({
                type: 'circle',
                center: { ...state.points[0] },
                r: radius
            });
            UI.log(`Circle created with radius ${radius.toFixed(4)}`);
            this.finishCommand();
        }
    },

    handleArcClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('ARC: Specify start point of arc:', 'prompt');
        } else if (state.step === 2) {
            UI.log('ARC: Specify end point of arc:', 'prompt');
        } else if (state.step === 3) {
            const center = state.points[0];
            const r = Utils.dist(center, state.points[1]);
            const startAngle = Utils.angle(center, state.points[1]);
            const endAngle = Utils.angle(center, state.points[2]);

            CAD.addEntity({
                type: 'arc',
                center: { ...center },
                r: r,
                start: startAngle,
                end: endAngle
            });
            UI.log('Arc created.');
            this.finishCommand();
        }
    },

    handleRectClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.points.length === 1) {
            UI.log('RECTANGLE: Specify other corner point:', 'prompt');
        } else if (state.points.length === 2) {
            CAD.addEntity({
                type: 'rect',
                p1: { ...state.points[0] },
                p2: { ...state.points[1] }
            });
            UI.log('Rectangle created.');
            this.finishCommand();
        }
    },

    handleEllipseClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('ELLIPSE: Specify axis endpoint 2:', 'prompt');
        } else if (state.step === 2) {
            UI.log('ELLIPSE: Specify distance to other axis:', 'prompt');
        } else if (state.step === 3) {
            const center = Utils.midpoint(state.points[0], state.points[1]);
            const rx = Utils.dist(state.points[0], state.points[1]) / 2;
            const ry = Utils.dist(center, state.points[2]);
            const rotation = Utils.angle(state.points[0], state.points[1]);

            CAD.addEntity({
                type: 'ellipse',
                center: { ...center },
                rx: rx,
                ry: ry,
                rotation: rotation
            });
            UI.log('Ellipse created.');
            this.finishCommand();
        }
    },

    handleTextClick(point) {
        const state = CAD;
        state.points.push(point);

        const text = prompt('Enter text:', '');
        if (text) {
            const height = parseFloat(prompt('Enter text height:', '10')) || 10;
            CAD.addEntity({
                type: 'text',
                position: { ...point },
                text: text,
                height: height,
                rotation: 0
            });
            UI.log('Text created.');
        }
        this.finishCommand();
    },

    handlePointClick(point) {
        CAD.addEntity({
            type: 'point',
            position: { ...point }
        });
        UI.log(`Point: X=${point.x.toFixed(4)}, Y=${point.y.toFixed(4)}`);
    },

    // ==========================================
    // MODIFY COMMAND HANDLERS
    // ==========================================

    handleMoveClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('MOVE: Specify second point or <use first point as displacement>:', 'prompt');
        } else if (state.step === 2) {
            const delta = {
                x: state.points[1].x - state.points[0].x,
                y: state.points[1].y - state.points[0].y
            };

            CAD.saveUndoState('Move');
            state.getSelectedEntities().forEach(entity => {
                const moved = Geometry.moveEntity(entity, delta);
                CAD.updateEntity(entity.id, moved, true);
            });

            UI.log(`${state.selectedIds.length} objects moved.`);
            state.clearSelection();
            this.finishCommand();
        }
    },

    handleCopyClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('COPY: Specify second point or <use first point as displacement>:', 'prompt');
        } else if (state.step === 2) {
            const delta = {
                x: state.points[1].x - state.points[0].x,
                y: state.points[1].y - state.points[0].y
            };

            CAD.saveUndoState('Copy');
            state.getSelectedEntities().forEach(entity => {
                const copied = Geometry.moveEntity(entity, delta);
                delete copied.id;
                CAD.addEntity(copied, true);
            });

            UI.log(`${state.selectedIds.length} objects copied.`);
            state.points = [state.points[1]]; // Allow multiple copies
            state.step = 1;
            UI.log('COPY: Specify second point or [Exit]:', 'prompt');
        }
    },

    handleRotateClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('ROTATE: Specify rotation angle or [Reference]:', 'prompt');
        } else if (state.step === 2) {
            const angle = Utils.angle(state.points[0], state.points[1]);

            CAD.saveUndoState('Rotate');
            state.getSelectedEntities().forEach(entity => {
                const rotated = Geometry.rotateEntity(entity, state.points[0], angle);
                CAD.updateEntity(entity.id, rotated, true);
            });

            UI.log(`${state.selectedIds.length} objects rotated ${Utils.radToDeg(angle).toFixed(2)}°`);
            state.clearSelection();
            this.finishCommand();
        }
    },

    handleScaleClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('SCALE: Specify scale factor or [Reference]:', 'prompt');
        } else if (state.step === 2) {
            UI.log('SCALE: Specify second point:', 'prompt');
        } else if (state.step === 3) {
            const baseDist = Utils.dist(state.points[0], state.points[1]);
            const newDist = Utils.dist(state.points[0], state.points[2]);
            const scale = newDist / baseDist;

            CAD.saveUndoState('Scale');
            state.getSelectedEntities().forEach(entity => {
                const scaled = Geometry.scaleEntity(entity, state.points[0], scale);
                CAD.updateEntity(entity.id, scaled, true);
            });

            UI.log(`${state.selectedIds.length} objects scaled by factor ${scale.toFixed(4)}`);
            state.clearSelection();
            this.finishCommand();
        }
    },

    handleMirrorClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('MIRROR: Specify second point of mirror line:', 'prompt');
        } else if (state.step === 2) {
            CAD.saveUndoState('Mirror');

            state.getSelectedEntities().forEach(entity => {
                const mirrored = Geometry.mirrorEntity(entity, state.points[0], state.points[1]);
                delete mirrored.id;
                CAD.addEntity(mirrored, true);
            });

            UI.log(`${state.selectedIds.length} objects mirrored.`);

            // Ask to delete source objects
            const deleteSource = confirm('Delete source objects?');
            if (deleteSource) {
                CAD.removeEntities(state.selectedIds, true);
            }

            state.clearSelection();
            this.finishCommand();
        }
    },

    handleOffsetClick(point) {
        const state = CAD;

        if (state.step === 0) {
            // Waiting for distance - check if a number was entered
            return;
        }

        if (state.step === 1) {
            // Select object to offset
            const hit = this.hitTest(point);
            if (hit) {
                state.targetId = hit.id;
                state.step = 2;
                UI.log('OFFSET: Specify point on side to offset:', 'prompt');
            } else {
                UI.log('No object found.', 'error');
            }
        } else if (state.step === 2) {
            // Perform offset
            this.performOffset(state.targetId, point);
            state.step = 1;
            state.targetId = null;
            UI.log('OFFSET: Select object to offset or [Exit]:', 'prompt');
        }
    },

    handleTrimClick(point) {
        const state = CAD;

        if (state.cmdOptions.selectingEdges) {
            // Use all entities as cutting edges (AutoCAD behavior when Enter is pressed without selection)
            return;
        }

        const hit = this.hitTest(point);
        if (hit) {
            const allEntities = CAD.getVisibleEntities().filter(e => e.id !== hit.id);
            const result = Geometry.trimLine(hit, point, allEntities);

            if (result && result.length > 0) {
                CAD.saveUndoState('Trim');
                CAD.removeEntity(hit.id, true);
                result.forEach(e => CAD.addEntity(e, true));
                UI.log('Object trimmed. Select next object to trim or [Exit]:');
            } else {
                UI.log('Cannot trim this object at this location.', 'error');
            }
        } else {
            UI.log('No object found to trim.', 'error');
        }
    },

    handleHatchClick(point) {
        const hit = this.hitTest(point);
        if (hit) {
            if (hit.type === 'circle' || hit.type === 'rect' ||
                (hit.type === 'polyline' && Utils.isPolygonClosed(hit.points))) {
                CAD.updateEntity(hit.id, { hatch: true });
                UI.log('Hatch applied.');
            } else {
                UI.log('Object is not closed. Cannot hatch.', 'error');
            }
        }
        this.finishCommand();
    },

    handleDistanceClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('DIST: Specify second point:', 'prompt');
        } else if (state.step === 2) {
            const d = Utils.dist(state.points[0], state.points[1]);
            const angle = Utils.angleDeg(state.points[0], state.points[1]);
            const dx = state.points[1].x - state.points[0].x;
            const dy = state.points[1].y - state.points[0].y;

            UI.log(`Distance = ${d.toFixed(4)}, Angle = ${angle.toFixed(2)}°`);
            UI.log(`Delta X = ${dx.toFixed(4)}, Delta Y = ${dy.toFixed(4)}`);
            this.finishCommand();
        }
    },

    handleAreaClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        UI.log(`AREA: Point ${state.step}, specify next point or [Enter to calculate]:`, 'prompt');
    },

    // ==========================================
    // SELECTION HANDLING
    // ==========================================

    handleSelectionClick(point) {
        const state = CAD;
        const hit = this.hitTest(point);

        if (hit) {
            state.selectedIds = [hit.id];
            UI.log('1 found.');
        } else {
            // Start window selection
            state.selectionMode = true;
            state.selectStart = point;
            UI.log('Specify opposite corner:');
        }
    },

    finishSelection(endPoint) {
        const state = CAD;
        const start = state.selectStart;

        const box = {
            x: Math.min(start.x, endPoint.x),
            y: Math.min(start.y, endPoint.y),
            w: Math.abs(endPoint.x - start.x),
            h: Math.abs(endPoint.y - start.y)
        };

        const isCrossing = endPoint.x < start.x;
        state.selectedIds = [];

        CAD.getVisibleEntities().forEach(entity => {
            const ext = CAD.getEntityExtents(entity);
            if (!ext) return;

            if (isCrossing) {
                // Crossing selection - any intersection
                if (ext.minX < box.x + box.w && ext.maxX > box.x &&
                    ext.minY < box.y + box.h && ext.maxY > box.y) {
                    state.selectedIds.push(entity.id);
                }
            } else {
                // Window selection - fully inside
                if (ext.minX >= box.x && ext.maxX <= box.x + box.w &&
                    ext.minY >= box.y && ext.maxY <= box.y + box.h) {
                    state.selectedIds.push(entity.id);
                }
            }
        });

        UI.log(`${state.selectedIds.length} found.`);
        state.selectionMode = false;
        state.selectStart = null;

        // Continue command if waiting for selection
        if (state.cmdOptions.needSelection && state.selectedIds.length > 0) {
            state.cmdOptions.needSelection = false;
            this.continueCommand(state.activeCmd);
        }
    },

    continueCommand(name) {
        switch (name) {
            case 'move':
                UI.log('MOVE: Specify base point:', 'prompt');
                break;
            case 'copy':
                UI.log('COPY: Specify base point:', 'prompt');
                break;
            case 'rotate':
                UI.log('ROTATE: Specify base point:', 'prompt');
                break;
            case 'scale':
                UI.log('SCALE: Specify base point:', 'prompt');
                break;
            case 'mirror':
                UI.log('MIRROR: Specify first point of mirror line:', 'prompt');
                break;
        }
    },

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    hitTest(point) {
        const tolerance = 10 / CAD.zoom;
        const entities = CAD.getVisibleEntities();

        for (let i = entities.length - 1; i >= 0; i--) {
            if (Geometry.hitTest(point, entities[i], tolerance)) {
                return entities[i];
            }
        }
        return null;
    },

    closeShape() {
        const state = CAD;

        if (state.activeCmd === 'polyline' && state.points.length >= 2) {
            state.points.push({ ...state.points[0] });
            CAD.addEntity({
                type: 'polyline',
                points: [...state.points]
            });
            UI.log('Polyline closed.');
            this.finishCommand();
        } else if (state.activeCmd === 'line' && state.lineChainStart && state.points.length >= 1) {
            CAD.addEntity({
                type: 'line',
                p1: { ...state.points[0] },
                p2: { ...state.lineChainStart }
            });
            UI.log('Line chain closed.');
            this.finishCommand();
        } else {
            UI.log('Cannot close. Need at least 2 points.', 'error');
        }
    },

    performOffset(entityId, clickPoint) {
        const entity = CAD.getEntity(entityId);
        if (!entity) return;

        let newData = null;

        switch (entity.type) {
            case 'line':
                const side = Geometry.getOffsetSide(entity.p1, entity.p2, clickPoint);
                const offsetLine = Geometry.offsetLine(entity.p1, entity.p2, CAD.offsetDist, side);
                if (offsetLine) {
                    newData = { type: 'line', ...offsetLine };
                }
                break;

            case 'circle':
                const offsetCircle = Geometry.offsetCircle(entity.center, entity.r, CAD.offsetDist, clickPoint);
                if (offsetCircle) {
                    newData = { type: 'circle', ...offsetCircle };
                }
                break;

            case 'rect':
                const offsetRect = Geometry.offsetRect(entity.p1, entity.p2, CAD.offsetDist, clickPoint);
                if (offsetRect) {
                    newData = { type: 'rect', ...offsetRect };
                }
                break;

            case 'polyline':
                const offsetPoly = Geometry.offsetPolyline(entity, CAD.offsetDist, clickPoint);
                if (offsetPoly) {
                    newData = { type: 'polyline', ...offsetPoly };
                }
                break;
        }

        if (newData) {
            CAD.addEntity(newData);
            UI.log('Object offset.');
        } else {
            UI.log('Could not offset object.', 'error');
        }
    },

    deleteSelected() {
        if (CAD.selectedIds.length === 0) {
            UI.log('No objects selected.', 'error');
            return;
        }

        CAD.removeEntities(CAD.selectedIds);
        UI.log(`${CAD.selectedIds.length} objects erased.`);
        CAD.clearSelection();
        this.finishCommand();
        Renderer.draw();
    },

    explodeSelected() {
        const state = CAD;
        let explodedCount = 0;

        CAD.saveUndoState('Explode');

        state.getSelectedEntities().forEach(entity => {
            if (entity.type === 'rect') {
                // Explode rectangle to 4 lines
                const p1 = entity.p1, p2 = entity.p2;
                CAD.addEntity({ type: 'line', p1: { x: p1.x, y: p1.y }, p2: { x: p2.x, y: p1.y } }, true);
                CAD.addEntity({ type: 'line', p1: { x: p2.x, y: p1.y }, p2: { x: p2.x, y: p2.y } }, true);
                CAD.addEntity({ type: 'line', p1: { x: p2.x, y: p2.y }, p2: { x: p1.x, y: p2.y } }, true);
                CAD.addEntity({ type: 'line', p1: { x: p1.x, y: p2.y }, p2: { x: p1.x, y: p1.y } }, true);
                CAD.removeEntity(entity.id, true);
                explodedCount++;
            } else if (entity.type === 'polyline' && entity.points.length > 1) {
                // Explode polyline to lines
                for (let i = 0; i < entity.points.length - 1; i++) {
                    CAD.addEntity({
                        type: 'line',
                        p1: { ...entity.points[i] },
                        p2: { ...entity.points[i + 1] }
                    }, true);
                }
                CAD.removeEntity(entity.id, true);
                explodedCount++;
            }
        });

        UI.log(`${explodedCount} objects exploded.`);
        state.clearSelection();
        this.finishCommand();
        Renderer.draw();
    },

    listSelected() {
        const selected = CAD.getSelectedEntities();
        if (selected.length === 0) {
            UI.log('No objects selected.');
            return;
        }

        selected.forEach(entity => {
            UI.log(`--- ${entity.type.toUpperCase()} ---`);
            UI.log(`  Layer: ${entity.layer}`);
            UI.log(`  ID: ${entity.id}`);

            switch (entity.type) {
                case 'line':
                    UI.log(`  Start: ${Utils.formatPoint(entity.p1)}`);
                    UI.log(`  End: ${Utils.formatPoint(entity.p2)}`);
                    UI.log(`  Length: ${Utils.dist(entity.p1, entity.p2).toFixed(4)}`);
                    break;
                case 'circle':
                    UI.log(`  Center: ${Utils.formatPoint(entity.center)}`);
                    UI.log(`  Radius: ${entity.r.toFixed(4)}`);
                    break;
                case 'arc':
                    UI.log(`  Center: ${Utils.formatPoint(entity.center)}`);
                    UI.log(`  Radius: ${entity.r.toFixed(4)}`);
                    UI.log(`  Start Angle: ${Utils.radToDeg(entity.start).toFixed(2)}°`);
                    UI.log(`  End Angle: ${Utils.radToDeg(entity.end).toFixed(2)}°`);
                    break;
                case 'rect':
                    UI.log(`  Corner 1: ${Utils.formatPoint(entity.p1)}`);
                    UI.log(`  Corner 2: ${Utils.formatPoint(entity.p2)}`);
                    break;
                case 'polyline':
                    UI.log(`  Vertices: ${entity.points.length}`);
                    UI.log(`  Closed: ${Utils.isPolygonClosed(entity.points)}`);
                    break;
            }
        });
    },

    undo() {
        const action = CAD.undo();
        if (action) {
            UI.log(`Undo: ${action}`);
            Renderer.draw();
        } else {
            UI.log('Nothing to undo.');
        }
        this.finishCommand();
    },

    redo() {
        const action = CAD.redo();
        if (action) {
            UI.log(`Redo: ${action}`);
            Renderer.draw();
        } else {
            UI.log('Nothing to redo.');
        }
        this.finishCommand();
    },

    zoomExtents() {
        const size = Renderer.getCanvasSize();
        CAD.zoomExtents(size.width, size.height);
        UI.log('Zoom extents.');
        Renderer.draw();
        this.finishCommand();
    },

    finishCommand() {
        CAD.finishCommand();
        UI.setActiveButton(null);
        Renderer.draw();
    },

    cancelCommand() {
        CAD.cancelCommand();
        CAD.clearSelection();
        CAD.selectionMode = false;
        CAD.selectStart = null;
        UI.setActiveButton(null);
        UI.log('*Cancel*');
        Renderer.draw();
    },

    // ==========================================
    // NEW DRAWING COMMAND HANDLERS
    // ==========================================

    handlePolygonClick(point) {
        const state = CAD;
        state.points.push(point);

        if (state.points.length === 1) {
            // First click - center point
            UI.log('POLYGON: Specify radius (edge point):', 'prompt');
        } else if (state.points.length === 2) {
            // Second click - edge point, create polygon
            const center = state.points[0];
            const edgePoint = state.points[1];
            const radius = Utils.dist(center, edgePoint);
            const startAngle = Utils.angle(center, edgePoint);
            const sides = state.cmdOptions.sides || 4;

            // Create polygon as a closed polyline
            const points = [];
            for (let i = 0; i < sides; i++) {
                const angle = startAngle + (i * 2 * Math.PI / sides);
                points.push({
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle)
                });
            }
            // Close the polygon
            points.push({ ...points[0] });

            CAD.addEntity({
                type: 'polyline',
                points: points,
                closed: true
            });

            UI.log(`Polygon with ${sides} sides created.`);
            this.finishCommand();
        }
    },

    handleRayClick(point) {
        const state = CAD;
        state.points.push(point);

        if (state.points.length === 1) {
            UI.log('RAY: Specify through point:', 'prompt');
        } else if (state.points.length === 2) {
            // Create a very long line in the direction specified
            const direction = Utils.angle(state.points[0], state.points[1]);
            const length = 10000; // Large number for "infinite" line

            CAD.addEntity({
                type: 'line',
                p1: { ...state.points[0] },
                p2: {
                    x: state.points[0].x + length * Math.cos(direction),
                    y: state.points[0].y + length * Math.sin(direction)
                },
                isRay: true
            });

            UI.log('Ray created.');
            // Keep start point for more rays from same origin
            state.points = [state.points[0]];
            UI.log('RAY: Specify through point:', 'prompt');
        }
    },

    handleXLineClick(point) {
        const state = CAD;
        state.points.push(point);

        if (state.points.length === 1) {
            UI.log('XLINE: Specify through point:', 'prompt');
        } else if (state.points.length === 2) {
            // Create a construction line (infinite in both directions)
            const direction = Utils.angle(state.points[0], state.points[1]);
            const length = 10000;

            CAD.addEntity({
                type: 'line',
                p1: {
                    x: state.points[0].x - length * Math.cos(direction),
                    y: state.points[0].y - length * Math.sin(direction)
                },
                p2: {
                    x: state.points[0].x + length * Math.cos(direction),
                    y: state.points[0].y + length * Math.sin(direction)
                },
                isXLine: true
            });

            UI.log('Construction line created.');
            // Keep origin point for more construction lines
            state.points = [state.points[0]];
            UI.log('XLINE: Specify through point:', 'prompt');
        }
    },

    handleSplineClick(point) {
        const state = CAD;
        state.points.push(point);

        UI.log(`SPLINE: Specify point ${state.points.length + 1} or press Enter to finish:`, 'prompt');
    },

    handleDonutClick(point) {
        const state = CAD;

        // Create donut (two concentric circles represented as filled shape)
        const inner = state.cmdOptions.donutInner || 10;
        const outer = state.cmdOptions.donutOuter || 20;

        CAD.addEntity({
            type: 'donut',
            center: { ...point },
            innerRadius: inner / 2,
            outerRadius: outer / 2
        });

        UI.log('Donut created. Specify center of next donut or press Enter to finish:', 'prompt');
    },

    // ==========================================
    // NEW MODIFY COMMAND HANDLERS
    // ==========================================

    handleArrayClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            // Point for row/column offset reference
            UI.log('ARRAY: Specify second point for row/column spacing:', 'prompt');
        } else if (state.step === 2) {
            const rows = state.cmdOptions.arrayRows || 1;
            const cols = state.cmdOptions.arrayCols || 1;
            const rowOffset = state.points[1].y - state.points[0].y;
            const colOffset = state.points[1].x - state.points[0].x;

            CAD.saveUndoState('Array');

            const selectedEntities = state.getSelectedEntities();
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (r === 0 && c === 0) continue; // Skip original

                    const dx = c * colOffset;
                    const dy = r * rowOffset;

                    selectedEntities.forEach(entity => {
                        const copied = Geometry.moveEntity(entity, { x: dx, y: dy });
                        delete copied.id;
                        CAD.addEntity(copied, true);
                    });
                }
            }

            UI.log(`Array created: ${rows} rows x ${cols} columns.`);
            state.clearSelection();
            this.finishCommand();
        }
    },

    handlePolarArrayClick(point) {
        const state = CAD;
        state.points.push(point);

        if (state.points.length === 1) {
            // Center point specified, now ask for number of items
            UI.log('ARRAYPOLAR: Enter number of items <4>:', 'prompt');
            state.cmdOptions.arrayItems = state.cmdOptions.arrayItems || 4;
            state.cmdOptions.arrayAngle = 360;
            state.cmdOptions.waitingForItems = true;
        }
    },

    completePolarArray() {
        const state = CAD;
        const center = state.points[0];
        const items = state.cmdOptions.arrayItems || 4;
        const totalAngle = Utils.degToRad(state.cmdOptions.arrayAngle || 360);
        const angleStep = totalAngle / items;

        CAD.saveUndoState('Polar Array');

        const selectedEntities = state.getSelectedEntities();
        for (let i = 1; i < items; i++) {
            const angle = angleStep * i;

            selectedEntities.forEach(entity => {
                // Rotate entity around center point
                const rotated = Geometry.rotateEntity(entity, center, angle);
                delete rotated.id;
                CAD.addEntity(rotated, true);
            });
        }

        UI.log(`Polar array created: ${items} items.`);
        state.clearSelection();
        this.finishCommand();
    },

    handleFilletClick(point) {
        const state = CAD;
        const hit = this.hitTest(point);

        if (!hit) {
            UI.log('No object selected.', 'error');
            return;
        }

        if (state.step === 0) {
            state.targetId = hit.id;
            state.step = 1;
            UI.log('FILLET: Select second object:', 'prompt');
        } else if (state.step === 1) {
            // Perform fillet between two lines
            const entity1 = CAD.getEntity(state.targetId);
            const entity2 = hit;

            if (entity1.type === 'line' && entity2.type === 'line') {
                const result = Geometry.filletLines(entity1, entity2, CAD.filletRadius);
                if (result) {
                    CAD.saveUndoState('Fillet');
                    CAD.updateEntity(entity1.id, result.line1, true);
                    CAD.updateEntity(entity2.id, result.line2, true);
                    if (result.arc) {
                        CAD.addEntity(result.arc, true);
                    }
                    UI.log(`Fillet created with radius ${CAD.filletRadius}.`);
                } else {
                    UI.log('Cannot fillet these objects.', 'error');
                }
            } else {
                UI.log('Fillet currently supports only lines.', 'error');
            }

            this.finishCommand();
        }
    },

    handleChamferClick(point) {
        const state = CAD;
        const hit = this.hitTest(point);

        if (!hit) {
            UI.log('No object selected.', 'error');
            return;
        }

        if (state.step === 0) {
            state.targetId = hit.id;
            state.step = 1;
            UI.log('CHAMFER: Select second line:', 'prompt');
        } else if (state.step === 1) {
            const entity1 = CAD.getEntity(state.targetId);
            const entity2 = hit;

            if (entity1.type === 'line' && entity2.type === 'line') {
                const result = Geometry.chamferLines(entity1, entity2, CAD.chamferDist1, CAD.chamferDist2);
                if (result) {
                    CAD.saveUndoState('Chamfer');
                    CAD.updateEntity(entity1.id, result.line1, true);
                    CAD.updateEntity(entity2.id, result.line2, true);
                    CAD.addEntity(result.chamferLine, true);
                    UI.log(`Chamfer created with distances ${CAD.chamferDist1}, ${CAD.chamferDist2}.`);
                } else {
                    UI.log('Cannot chamfer these lines.', 'error');
                }
            } else {
                UI.log('Chamfer currently supports only lines.', 'error');
            }

            this.finishCommand();
        }
    },

    handleBreakClick(point) {
        const state = CAD;
        const hit = this.hitTest(point);

        if (!hit) {
            UI.log('No object selected.', 'error');
            return;
        }

        if (state.step === 0) {
            state.targetId = hit.id;
            state.points.push(point);
            state.step = 1;
            UI.log('BREAK: Specify second break point or [First point]:', 'prompt');
        } else if (state.step === 1) {
            state.points.push(point);

            const entity = CAD.getEntity(state.targetId);
            if (entity && entity.type === 'line') {
                const result = Geometry.breakLine(entity, state.points[0], state.points[1]);
                if (result && result.length > 0) {
                    CAD.saveUndoState('Break');
                    CAD.removeEntity(state.targetId, true);
                    result.forEach(e => CAD.addEntity(e, true));
                    UI.log('Object broken.');
                } else {
                    UI.log('Cannot break object at specified points.', 'error');
                }
            }

            this.finishCommand();
        }
    },

    // ==========================================
    // DIMENSION COMMAND HANDLERS
    // ==========================================

    handleDimLinearClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('DIMLINEAR: Specify second extension line origin:', 'prompt');
        } else if (state.step === 2) {
            UI.log('DIMLINEAR: Specify dimension line location:', 'prompt');
        } else if (state.step === 3) {
            const p1 = state.points[0];
            const p2 = state.points[1];
            const dimLine = state.points[2];

            // Calculate dimension value
            const distance = state.activeCmd === 'dimaligned' ?
                Utils.dist(p1, p2) :
                Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y) ?
                    Math.abs(p2.x - p1.x) : Math.abs(p2.y - p1.y);

            // Create dimension entity
            CAD.addEntity({
                type: 'dimension',
                dimType: state.activeCmd === 'dimaligned' ? 'aligned' : 'linear',
                p1: { ...p1 },
                p2: { ...p2 },
                dimLinePos: { ...dimLine },
                value: distance,
                text: distance.toFixed(2)
            });

            UI.log(`Dimension: ${distance.toFixed(4)}`);
            this.finishCommand();
        }
    },

    handleDimRadiusClick(point) {
        const state = CAD;
        const hit = this.hitTest(point);

        if (hit && (hit.type === 'circle' || hit.type === 'arc')) {
            state.targetId = hit.id;
            state.points.push(point);
            state.step = 1;
            UI.log('DIMRADIUS: Specify dimension line location:', 'prompt');
        } else if (state.step === 1) {
            const entity = CAD.getEntity(state.targetId);
            if (entity) {
                const value = state.activeCmd === 'dimdiameter' ? entity.r * 2 : entity.r;
                const prefix = state.activeCmd === 'dimdiameter' ? 'Ø' : 'R';

                CAD.addEntity({
                    type: 'dimension',
                    dimType: state.activeCmd === 'dimdiameter' ? 'diameter' : 'radius',
                    center: { ...entity.center },
                    radius: entity.r,
                    dimLinePos: { ...point },
                    value: value,
                    text: `${prefix}${value.toFixed(2)}`
                });

                UI.log(`${state.activeCmd === 'dimdiameter' ? 'Diameter' : 'Radius'}: ${value.toFixed(4)}`);
            }
            this.finishCommand();
        } else {
            UI.log('Please select a circle or arc.', 'error');
        }
    },

    // ==========================================
    // INPUT HANDLING
    // ==========================================

    handleInput(input) {
        const state = CAD;
        input = input.trim();

        if (!input) {
            // Enter pressed with empty input
            if (state.activeCmd === 'polyline' && state.points.length >= 2) {
                // Finish polyline
                CAD.addEntity({
                    type: 'polyline',
                    points: [...state.points]
                });
                UI.log('Polyline created.');
                this.finishCommand();
                Renderer.draw();
                return true;
            }

            if (state.activeCmd === 'spline' && state.points.length >= 2) {
                // Finish spline (create as smooth polyline for now)
                CAD.addEntity({
                    type: 'polyline',
                    points: [...state.points],
                    isSpline: true
                });
                UI.log('Spline created.');
                this.finishCommand();
                Renderer.draw();
                return true;
            }

            if (state.activeCmd === 'trim' && state.cmdOptions.selectingEdges) {
                state.cmdOptions.selectingEdges = false;
                UI.log('TRIM: Select object to trim:', 'prompt');
                return true;
            }

            if (state.activeCmd === 'area' && state.points.length >= 3) {
                const area = Math.abs(Utils.polygonArea(state.points));
                const perimeter = state.points.reduce((sum, p, i) => {
                    const next = state.points[(i + 1) % state.points.length];
                    return sum + Utils.dist(p, next);
                }, 0);
                UI.log(`Area = ${area.toFixed(4)}, Perimeter = ${perimeter.toFixed(4)}`);
                this.finishCommand();
                Renderer.draw();
                return true;
            }

            // Polar array - accept default angle with Enter
            if (state.activeCmd === 'arraypolar' && state.cmdOptions.waitingForAngle) {
                this.completePolarArray();
                Renderer.draw();
                return true;
            }

            // Polar array - accept default items with Enter
            if (state.activeCmd === 'arraypolar' && state.cmdOptions.waitingForItems) {
                state.cmdOptions.waitingForItems = false;
                state.cmdOptions.waitingForAngle = true;
                UI.log('ARRAYPOLAR: Specify angle to fill <360>:', 'prompt');
                return true;
            }

            if (state.activeCmd) {
                this.finishCommand();
                Renderer.draw();
                return true;
            }

            return false;
        }

        // Check for coordinate input
        const lastPoint = state.points.length > 0 ? state.points[state.points.length - 1] : null;
        const coord = Utils.parseCoordInput(input, lastPoint);

        if (coord && state.activeCmd) {
            this.handleClick(coord);
            return true;
        }

        // Check for numeric input (for offset distance, scale factor, etc.)
        const num = parseFloat(input);
        if (!isNaN(num)) {
            if (state.activeCmd === 'offset' && state.step === 0) {
                CAD.offsetDist = Math.abs(num);
                state.step = 1;
                UI.log('OFFSET: Select object to offset:', 'prompt');
                return true;
            }

            if (state.activeCmd === 'scale' && state.step === 1) {
                // Direct scale factor input
                CAD.saveUndoState('Scale');
                state.getSelectedEntities().forEach(entity => {
                    const scaled = Geometry.scaleEntity(entity, state.points[0], num);
                    CAD.updateEntity(entity.id, scaled, true);
                });
                UI.log(`${state.selectedIds.length} objects scaled by factor ${num.toFixed(4)}`);
                state.clearSelection();
                this.finishCommand();
                Renderer.draw();
                return true;
            }

            if (state.activeCmd === 'rotate' && state.step === 1) {
                // Direct angle input
                const angle = Utils.degToRad(num);
                CAD.saveUndoState('Rotate');
                state.getSelectedEntities().forEach(entity => {
                    const rotated = Geometry.rotateEntity(entity, state.points[0], angle);
                    CAD.updateEntity(entity.id, rotated, true);
                });
                UI.log(`${state.selectedIds.length} objects rotated ${num.toFixed(2)}°`);
                state.clearSelection();
                this.finishCommand();
                Renderer.draw();
                return true;
            }

            if (state.activeCmd === 'circle' && state.step === 1) {
                // Radius input for circle
                CAD.addEntity({
                    type: 'circle',
                    center: { ...state.points[0] },
                    r: num
                });
                UI.log(`Circle created with radius ${num.toFixed(4)}`);
                this.finishCommand();
                Renderer.draw();
                return true;
            }

            // Polygon - number of sides
            if (state.activeCmd === 'polygon' && state.step === 0) {
                state.cmdOptions.sides = Math.max(3, Math.round(num));
                state.step = 1;
                UI.log(`POLYGON: ${state.cmdOptions.sides} sides. Specify center of polygon:`, 'prompt');
                return true;
            }

            // Array - number of rows
            if ((state.activeCmd === 'array' || state.activeCmd === 'arrayrect') && state.step === 0) {
                state.cmdOptions.arrayRows = Math.max(1, Math.round(num));
                UI.log(`ARRAY: Enter number of columns <1>:`, 'prompt');
                return true;
            }

            // Array - number of columns
            if ((state.activeCmd === 'array' || state.activeCmd === 'arrayrect') &&
                state.cmdOptions.arrayRows && !state.cmdOptions.arrayCols) {
                state.cmdOptions.arrayCols = Math.max(1, Math.round(num));
                UI.log('ARRAY: Specify first corner of array:', 'prompt');
                return true;
            }

            // Polar array - number of items
            if (state.activeCmd === 'arraypolar' && state.cmdOptions.waitingForItems) {
                state.cmdOptions.arrayItems = Math.max(2, Math.round(num));
                state.cmdOptions.waitingForItems = false;
                state.cmdOptions.waitingForAngle = true;
                UI.log('ARRAYPOLAR: Specify angle to fill <360>:', 'prompt');
                return true;
            }

            // Polar array - angle to fill
            if (state.activeCmd === 'arraypolar' && state.cmdOptions.waitingForAngle) {
                state.cmdOptions.arrayAngle = num;
                state.cmdOptions.waitingForAngle = false;
                this.completePolarArray();
                Renderer.draw();
                return true;
            }

            // Donut - inner diameter
            if (state.activeCmd === 'donut' && !state.cmdOptions.innerSet) {
                state.cmdOptions.donutInner = Math.abs(num);
                state.cmdOptions.innerSet = true;
                UI.log(`DONUT: Specify outside diameter <${state.cmdOptions.donutOuter}>:`, 'prompt');
                return true;
            }

            // Donut - outer diameter
            if (state.activeCmd === 'donut' && state.cmdOptions.innerSet && !state.cmdOptions.outerSet) {
                state.cmdOptions.donutOuter = Math.abs(num);
                state.cmdOptions.outerSet = true;
                UI.log('DONUT: Specify center of donut:', 'prompt');
                return true;
            }
        }

        // Check for special command options
        if (state.activeCmd === 'fillet' && input.toLowerCase() === 'r') {
            const radius = prompt('Enter fillet radius:', CAD.filletRadius || '0');
            if (radius !== null) {
                CAD.filletRadius = Math.abs(parseFloat(radius)) || 0;
                UI.log(`FILLET: Radius = ${CAD.filletRadius}. Select first object:`, 'prompt');
            }
            return true;
        }

        if (state.activeCmd === 'chamfer' && input.toLowerCase() === 'd') {
            const d1 = prompt('Enter first chamfer distance:', CAD.chamferDist1 || '0');
            if (d1 !== null) {
                CAD.chamferDist1 = Math.abs(parseFloat(d1)) || 0;
                const d2 = prompt('Enter second chamfer distance:', CAD.chamferDist1);
                CAD.chamferDist2 = d2 !== null ? Math.abs(parseFloat(d2)) || CAD.chamferDist1 : CAD.chamferDist1;
                UI.log(`CHAMFER: Distances = ${CAD.chamferDist1}, ${CAD.chamferDist2}. Select first line:`, 'prompt');
            }
            return true;
        }

        // Not a coordinate - treat as command
        return false;
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Commands;
}
