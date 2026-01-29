/* ============================================
   BrowserCAD - Commands Module
   ============================================ */

const Commands = {
    // Commands that should repeat automatically (like AutoCAD)
    repeatableCommands: ['line', 'polyline', 'circle', 'arc', 'rect', 'ellipse', 'text', 'point', 'polygon', 'donut', 'ray', 'xline', 'spline'],

    // Last executed drawing command (for repeat)
    lastDrawingCmd: null,

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
        'mt': 'mtext',
        'mtext': 'mtext',
        'po': 'point',
        'point': 'point',
        'multiple': 'point',
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
        'cha': 'chamfer',
        'ch': 'chamfer',
        'chamfer': 'chamfer',
        'x': 'explode',
        'explode': 'explode',
        'j': 'join',
        'join': 'join',
        'h': 'hatch',
        'hatch': 'hatch',
        'bh': 'hatch',
        'bhatch': 'hatch',
        'leader': 'leader',
        'le': 'leader',
        'ar': 'array',
        'array': 'array',
        'arrayrect': 'arrayrect',
        'arraypolar': 'arraypolar',
        '-array': 'array',
        'br': 'break',
        'break': 'break',
        'len': 'lengthen',
        'lengthen': 'lengthen',
        's': 'stretch',
        'stretch': 'stretch',
        'pe': 'pedit',
        'pedit': 'pedit',

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
        'dimbaseline': 'dimbaseline',
        'dimbase': 'dimbaseline',
        'dimcontinue': 'dimcontinue',
        'dimcont': 'dimcontinue',

        // Utility commands
        'u': 'undo',
        'undo': 'undo',
        'redo': 'redo',
        'mredo': 'redo',
        'z': 'zoom',
        'zoom': 'zoom',
        'ze': 'zoomextents',
        'zoomextents': 'zoomextents',
        'p': 'pan',
        'pan': 'pan',
        're': 'regen',
        'regen': 'regen',
        'redraw': 'regen',
        'redrawall': 'regen',
        'la': 'layer',
        '-la': 'layer',
        'layer': 'layer',
        'layfrz': 'layfrz',
        'laythw': 'laythw',
        'layon': 'layon',
        'layoff': 'layoff',
        'id': 'id',
        'dist': 'distance',
        'di': 'distance',
        'distance': 'distance',
        'measuregeom': 'distance',
        'area': 'area',
        'aa': 'area',
        'list': 'list',
        'li': 'list',
        'properties': 'list',
        'props': 'list',
        'pr': 'list',
        'qselect': 'qselect',
        'selectsimilar': 'selectsimilar',

        // Selection
        'all': 'selectall',
        'selectall': 'selectall',
        'selectwindow': 'selectwindow',
        'selectcrossing': 'selectcrossing',

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
        'polar': 'polar',
        'image': 'imageattach',
        'imageattach': 'imageattach',
        'attach': 'imageattach',
        'offsetgaptype': 'offsetgaptype',
        'pdmode': 'pdmode',
        'pdsize': 'pdsize',
        'textsize': 'textsize',
        'dimtxt': 'dimtxt',
        'dimasz': 'dimasz',
        'dimscale': 'dimscale',
        'dimdec': 'dimdec',
        'linetype': 'linetype',
        'lt': 'linetype',
        'ltscale': 'ltscale',

        // AutoLISP
        'lisp': 'lisp',
        'vlisp': 'lisp',
        'appload': 'appload',
        'load': 'appload',

        // Block commands
        'b': 'block',
        'block': 'block',
        'bmake': 'block',
        'i': 'insert',
        'insert': 'insert',
        'ddinsert': 'insert',

        // Divide/Measure commands
        'div': 'divide',
        'divide': 'divide',
        'me': 'measure',
        'measure': 'measure',

        // Revision cloud
        'revcloud': 'revcloud',
        'rc': 'revcloud',

        // Match properties
        'ma': 'matchprop',
        'matchprop': 'matchprop',
        'painter': 'matchprop',

        // Wipeout
        'wipeout': 'wipeout',

        // Layer lock/unlock
        'laylck': 'laylck',
        'laylock': 'laylck',
        'layulk': 'layulk',
        'layunlock': 'layulk',

        // Named views
        'view': 'view',
        '-view': 'view',

        // Ordinate dimension
        'dimord': 'dimordinate',
        'dimordinate': 'dimordinate',
        'dor': 'dimordinate',

        // Overkill
        'overkill': 'overkill',

        // Close/End options (handled specially in execute() when activeCmd exists)
        'close': 'close'
    },

    // ==========================================
    // COMMAND EXECUTION
    // ==========================================

    execute(input) {
        const trimmedInput = input.trim();

        // Check for AutoLISP expression (starts with parenthesis)
        if (trimmedInput.startsWith('(')) {
            this.executeLisp(trimmedInput);
            return;
        }

        const parts = trimmedInput.toLowerCase().split(/\s+/);
        const cmdName = parts[0];
        const args = parts.slice(1);

        // Check for close command during active drawing
        if ((cmdName === 'c' || cmdName === 'close') && CAD.activeCmd) {
            this.closeShape();
            return;
        }

        // Check for undo command during active line/polyline drawing
        if ((cmdName === 'u') && CAD.activeCmd &&
            (CAD.activeCmd === 'line' || CAD.activeCmd === 'polyline' || CAD.activeCmd === 'spline')) {
            this.handleInput('u');
            return;
        }

        const command = this.aliases[cmdName];
        if (!command) {
            UI.log(`Unknown command: ${cmdName}`, 'error');
            return;
        }

        if (command === 'selectwindow' || command === 'selectcrossing') {
            if (!CAD.activeCmd) {
                UI.setActiveButton(null);
                UI.updateCommandPrompt(null);
            }
            if (command === 'selectwindow') {
                UI.canvasSelectWindow();
            } else {
                UI.canvasSelectCrossing();
            }
            return;
        }

        if (command === 'qselect' && args.length > 0) {
            this.selectByType(args[0]);
            return;
        }

        // Execute the command
        this.startCommand(command, args);
    },

    // Execute AutoLISP code
    async executeLisp(code) {
        if (typeof AutoLISP === 'undefined') {
            UI.log('AutoLISP interpreter not loaded.', 'error');
            return;
        }

        try {
            const result = await AutoLISP.execute(code);
            if (result !== undefined && result !== null) {
                // Format the result for display
                const formatted = this.formatLispResult(result);
                UI.log(`Result: ${formatted}`);
            }
        } catch (err) {
            UI.log(`LISP Error: ${err.message}`, 'error');
        }
        Renderer.draw();
    },

    // Format LISP result for display
    formatLispResult(value) {
        if (value === null) return 'nil';
        if (value === true) return 'T';
        if (value === false) return 'nil';
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'string') return `"${value}"`;
        if (Array.isArray(value)) {
            if (value.length === 0) return 'nil';
            return '(' + value.map(v => this.formatLispResult(v)).join(' ') + ')';
        }
        if (typeof value === 'object' && value.x !== undefined && value.y !== undefined) {
            return `(${value.x} ${value.y}${value.z !== undefined ? ' ' + value.z : ''})`;
        }
        return String(value);
    },

    startCommand(name, args = []) {
        // Finish any active command first (without restarting)
        if (CAD.activeCmd) {
            this.finishCommand(true); // Pass true to prevent auto-restart
        }

        // Track repeatable commands
        if (this.repeatableCommands.includes(name)) {
            this.lastDrawingCmd = name;
        }

        CAD.startCommand(name);
        UI.setActiveButton(name);
        UI.updateCommandPrompt(name);

        // Update selection ribbon (for modify commands that need selection)
        UI.updateSelectionRibbon();

        // Update canvas selection toolbar for modify commands
        UI.updateCanvasSelectionToolbar();

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

            case 'mtext':
                UI.log('MTEXT: Specify first corner:', 'prompt');
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
            case 'dimbaseline':
                if (!CAD.lastLinearDim) {
                    UI.log('DIMBASELINE: No previous linear dimension found.', 'error');
                    this.finishCommand(true);
                    break;
                }
                CAD.cmdOptions.dimBasePoint = { ...CAD.lastLinearDim.p1 };
                UI.log('DIMBASELINE: Specify next extension line origin:', 'prompt');
                break;
            case 'dimcontinue':
                if (!CAD.lastLinearDim) {
                    UI.log('DIMCONTINUE: No previous linear dimension found.', 'error');
                    this.finishCommand(true);
                    break;
                }
                CAD.cmdOptions.dimBasePoint = { ...CAD.lastLinearDim.p2 };
                UI.log('DIMCONTINUE: Specify next extension line origin:', 'prompt');
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
                CAD.cmdOptions.scaleMode = 'factor'; // factor, reference
                CAD.cmdOptions.scaleCopy = false;
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
                UI.log(`OFFSET: Specify offset distance or [Through/Erase] <${CAD.offsetDist}>:`, 'prompt');
                CAD.cmdOptions.offsetMode = 'distance'; // distance, through, picking
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
                UI.log(`HATCH: Click inside a closed area or select a closed object.`, 'prompt');
                UI.log(`HATCH: Pattern [${this.getHatchPatternOptions()}] <${CAD.hatchPattern}>:`, 'prompt');
                break;
            case 'leader':
                UI.log('LEADER: Specify first point:', 'prompt');
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
                UI.log('STRETCH: Select objects to stretch by crossing-window or polygon:', 'prompt');
                CAD.cmdOptions.needSelection = true;
                CAD.cmdOptions.stretchMode = 'selectWindow';
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

            case 'pedit':
                if (CAD.selectedIds.length === 0) {
                    UI.log('PEDIT: Select polyline or [Multiple]:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                    CAD.cmdOptions.peditMode = null;
                } else {
                    const selected = CAD.getSelectedEntities();
                    if (selected.length === 1 && (selected[0].type === 'polyline' || selected[0].type === 'line')) {
                        CAD.cmdOptions.peditTarget = selected[0];
                        UI.log('PEDIT: [Close/Open/Join/Width/Edit vertex/Spline/Decurve]:', 'prompt');
                    } else {
                        UI.log('PEDIT: Select a single polyline.', 'error');
                        this.finishCommand();
                    }
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

            case 'zoomextents':
                this.zoomExtents();
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
            case 'layer':
                UI.log('LAYER: Enter option [New/Set/On/Off/List]:', 'prompt');
                break;
            case 'layfrz':
                UI.log('LAYFRZ: Enter layer name or [Current]:', 'prompt');
                break;
            case 'laythw':
                UI.log('LAYTHW: Enter layer name or [Current]:', 'prompt');
                break;
            case 'layon':
                UI.log('LAYON: Enter layer name or [Current]:', 'prompt');
                break;
            case 'layoff':
                UI.log('LAYOFF: Enter layer name or [Current]:', 'prompt');
                break;
            case 'selectsimilar':
                this.selectSimilar();
                this.finishCommand();
                break;
            case 'qselect':
                if (CAD.getVisibleEntities().length === 0) {
                    UI.log('QSELECT: No entities to select.', 'error');
                    this.finishCommand();
                    break;
                }
                CAD.cmdOptions.waitingForQselectType = true;
                UI.log(`QSELECT: Enter object type or [List]:`, 'prompt');
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
            case 'osnap':
                UI.log('OSNAP: Enter option [On/Off/End/Mid/Cen/Int/Per/Tan/Nea/All/None/List]:', 'prompt');
                break;
            case 'polar':
                UI.log(`POLAR: Enter option [On/Off/Angle] <${CAD.polarAngle}>:`, 'prompt');
                break;

            case 'offsetgaptype':
                UI.log(`OFFSETGAPTYPE: Enter new value <${CAD.offsetGapType}> (0=Extend, 1=Fillet, 2=Chamfer):`, 'prompt');
                break;

            case 'imageattach':
                UI.log('IMAGEATTACH: Select image file to attach.', 'prompt');
                UI.promptImageAttach((imageData) => {
                    if (!imageData) {
                        this.finishCommand(true);
                        return;
                    }
                    CAD.cmdOptions.imageData = imageData;
                    CAD.cmdOptions.imageInsert = null;
                    CAD.cmdOptions.imageScale = CAD.imageAttachScale || 1;
                    CAD.cmdOptions.imageRotation = CAD.imageAttachRotation || 0;
                    CAD.step = 0;
                    UI.log('IMAGEATTACH: Specify insertion point:', 'prompt');
                });
                break;

            case 'pdmode':
                UI.log(`PDMODE: Enter new value <${CAD.pointDisplayMode}> (0=dot, 2=+, 3=X, 32=square, 64=circle):`, 'prompt');
                break;

            case 'pdsize':
                UI.log(`PDSIZE: Enter new value <${CAD.pointDisplaySize}>:`, 'prompt');
                break;

            case 'textsize':
                UI.log(`TEXTSIZE: Enter new value <${CAD.textHeight}>:`, 'prompt');
                break;

            case 'dimtxt':
                UI.log(`DIMTXT: Enter new dimension text height <${CAD.dimTextHeight}>:`, 'prompt');
                break;

            case 'dimasz':
                UI.log(`DIMASZ: Enter new dimension arrow size <${CAD.dimArrowSize}>:`, 'prompt');
                break;

            case 'dimscale':
                UI.log(`DIMSCALE: Enter new dimension scale factor <${CAD.dimScale}>:`, 'prompt');
                break;
            case 'dimdec':
                UI.log(`DIMDEC: Enter new dimension precision <${CAD.dimPrecision}>:`, 'prompt');
                break;

            case 'linetype':
                UI.log(`LINETYPE: Enter name or [List] <${CAD.lineType}>:`, 'prompt');
                break;

            case 'ltscale':
                UI.log(`LTSCALE: Enter new linetype scale <${CAD.lineTypeScale}>:`, 'prompt');
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

            case 'lisp':
                UI.log('AutoLISP Mode. Type (expression) to execute LISP code.');
                UI.log('Examples: (+ 1 2 3), (setq x 10), (command "circle" \'(0 0) 50)');
                UI.log('Type (help) for available functions.');
                this.finishCommand();
                break;

            case 'appload':
                UI.log('APPLOAD: Select a LISP file to load.', 'prompt');
                UI.promptLispAttach(async (lispFile) => {
                    if (!lispFile) {
                        this.finishCommand(true);
                        return;
                    }
                    await AutoLISP.load(lispFile.code);
                    UI.log(`APPLOAD: Loaded ${lispFile.name}.`);
                    this.finishCommand(true);
                });
                break;

            // Block commands
            case 'block':
                if (CAD.selectedIds.length === 0) {
                    UI.log('BLOCK: Select objects for block:', 'prompt');
                    CAD.cmdOptions.needSelection = true;
                } else {
                    UI.log('BLOCK: Enter block name:', 'prompt');
                    CAD.cmdOptions.waitingForName = true;
                }
                break;

            case 'insert':
                // Show available blocks
                const blockList = CAD.getBlockList();
                if (blockList.length === 0) {
                    UI.log('INSERT: No blocks defined. Use BLOCK command to create blocks first.', 'error');
                    this.finishCommand();
                } else {
                    UI.log(`INSERT: Available blocks: ${blockList.join(', ')}`, 'prompt');
                    UI.log('INSERT: Enter block name to insert:', 'prompt');
                    CAD.cmdOptions.waitingForBlockName = true;
                    CAD.cmdOptions.insertScale = { x: 1, y: 1 };
                    CAD.cmdOptions.insertRotation = 0;
                }
                break;

            // ==========================================
            // NEW QUICK-WIN COMMANDS
            // ==========================================

            case 'divide':
                UI.log('DIVIDE: Select object to divide:', 'prompt');
                break;

            case 'measure':
                UI.log('MEASURE: Select object to measure:', 'prompt');
                break;

            case 'revcloud':
                UI.log(`REVCLOUD: Specify arc length <${CAD.cmdOptions.revcloudArcLen || 15}>:`, 'prompt');
                CAD.cmdOptions.revcloudArcLen = CAD.cmdOptions.revcloudArcLen || 15;
                break;

            case 'matchprop':
                UI.log('MATCHPROP: Select source object:', 'prompt');
                break;

            case 'wipeout':
                UI.log('WIPEOUT: Specify first point:', 'prompt');
                break;

            case 'laylck':
                UI.log('LAYLCK: Enter layer name to lock:', 'prompt');
                break;

            case 'layulk':
                UI.log('LAYULK: Enter layer name to unlock:', 'prompt');
                break;

            case 'view':
                UI.log('VIEW: Enter option [Save/Restore/Delete/List]:', 'prompt');
                break;

            case 'dimordinate':
                UI.log('DIMORDINATE: Specify feature location:', 'prompt');
                break;

            case 'overkill':
                this.executeOverkill();
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
        if ((state.osnapEnabled || state.gridSnapEnabled) && state.snapPoint) {
            point = { ...state.snapPoint };
        }

        // Apply ortho mode
        if (state.orthoEnabled && state.points.length > 0) {
            point = Utils.applyOrtho(state.points[state.points.length - 1], point);
        }

        // Handle selection mode FIRST (window/crossing selection in progress)
        // This must come before needSelection check to properly finish selection box
        if (state.selectionMode && state.selectStart) {
            this.finishSelection(point);
            // After window selection during modify commands, update toolbar and stay in selection mode
            if (state.cmdOptions.needSelection) {
                UI.log(`${state.selectedIds.length} selected. Press ENTER to confirm or keep selecting.`, 'prompt');
                UI.updateCanvasSelectionInfo();
            }
            Renderer.draw();
            return;
        }

        // Check if we need selection first (modify commands)
        if (state.cmdOptions.needSelection) {
            const hit = this.hitTest(point);
            if (hit) {
                // Toggle selection on click (like AutoCAD)
                if (state.isSelected(hit.id)) {
                    state.deselect(hit.id);
                    UI.log(`1 removed, ${state.selectedIds.length} total`);
                } else {
                    state.select(hit.id);
                    UI.log(`1 found, ${state.selectedIds.length} total`);
                }
            } else {
                // Start window/crossing selection (first corner)
                state.selectionMode = true;
                state.selectStart = point;
                UI.log('Specify opposite corner:');
                Renderer.draw();
                return;
            }

            // Don't auto-proceed - wait for Enter to confirm selection
            // User can keep selecting more entities
            UI.log(`${state.selectedIds.length} selected. Press ENTER to confirm or keep selecting.`, 'prompt');
            UI.updateCanvasSelectionInfo();
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

            case 'leader':
                this.handleLeaderClick(point);
                break;

            case 'mtext':
                this.handleMTextClick(point);
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

            case 'imageattach':
                this.handleImageAttachClick(point);
                break;

            case 'trim':
                this.handleTrimClick(point);
                break;

            case 'extend':
                this.handleExtendClick(point);
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

            case 'stretch':
                this.handleStretchClick(point);
                break;

            case 'break':
                this.handleBreakClick(point);
                break;

            case 'dimlinear':
            case 'dimaligned':
                this.handleDimLinearClick(point);
                break;
            case 'dimbaseline':
            case 'dimcontinue':
                this.handleDimContinueClick(point);
                break;

            case 'dimradius':
            case 'dimdiameter':
                this.handleDimRadiusClick(point);
                break;

            case 'block':
                this.handleBlockClick(point);
                break;

            case 'insert':
                this.handleInsertClick(point);
                break;

            // New quick-win commands
            case 'divide':
                this.handleDivideClick(point);
                break;

            case 'measure':
                this.handleMeasureClick(point);
                break;

            case 'revcloud':
                this.handleRevcloudClick(point);
                break;

            case 'matchprop':
                this.handleMatchpropClick(point);
                break;

            case 'wipeout':
                this.handleWipeoutClick(point);
                break;

            case 'dimordinate':
                this.handleDimOrdinateClick(point);
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
        state.step++;

        if (state.step === 1) {
            // First click - get text position
            const defaultHeight = CAD.textHeight || 10;
            UI.log(`TEXT: Specify height <${defaultHeight}>:`, 'prompt');
            CAD.cmdOptions.textPosition = point;
        } else if (state.step === 2) {
            // Height entered via handleInput, now get rotation
            UI.log('TEXT: Specify rotation angle <0>:', 'prompt');
        }
    },

    completeTextCommand(text) {
        const height = CAD.cmdOptions.textHeight || CAD.textHeight || 10;
        const rotation = CAD.cmdOptions.textRotation || 0;
        const position = CAD.cmdOptions.textPosition;

        if (text && position) {
            CAD.addEntity({
                type: 'text',
                position: { ...position },
                text: text,
                height: height,
                rotation: rotation
            });
            UI.log('Text created.');
        }
        this.finishCommand();
    },

    handleLeaderClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('LEADER: Specify next point:', 'prompt');
        } else if (state.step === 2) {
            UI.log('LEADER: Enter text:', 'prompt');
        }
    },

    completeLeaderCommand(text) {
        const points = CAD.points;
        if (!text || points.length < 2) {
            UI.log('LEADER: Text required to finish leader.', 'error');
            return;
        }
        const height = CAD.textHeight || 10;
        const anchor = points[points.length - 1];
        CAD.addEntity({
            type: 'leader',
            points: points.map(p => ({ ...p })),
            text: text,
            height: height,
            textPosition: { x: anchor.x, y: anchor.y }
        });
        UI.log('Leader created.');
        this.finishCommand();
    },

    handleMTextClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log('MTEXT: Specify opposite corner or [Height/Justify/Line spacing/Rotation/Style/Width]:', 'prompt');
        } else if (state.step === 2) {
            // Two corners specified - create mtext box
            const p1 = state.points[0];
            const p2 = state.points[1];

            // Calculate width from corners
            const width = Math.abs(p2.x - p1.x);
            const height = CAD.textHeight || 10;

            // Prompt for text content
            const text = prompt('Enter multiline text (use \\n for new lines):', '');
            if (text) {
                CAD.addEntity({
                    type: 'mtext',
                    position: {
                        x: Math.min(p1.x, p2.x),
                        y: Math.max(p1.y, p2.y)
                    },
                    text: text.replace(/\\n/g, '\n'),
                    height: height,
                    width: width,
                    rotation: 0,
                    attachment: 'topLeft' // TL, TC, TR, ML, MC, MR, BL, BC, BR
                });
                UI.log('MText created.');
            }
            this.finishCommand();
        }
    },

    handlePointClick(point) {
        CAD.addEntity({
            type: 'point',
            position: { ...point }
        });
        UI.log(`Point: X=${point.x.toFixed(4)}, Y=${point.y.toFixed(4)}. Specify next point:`);
        // Don't finish - allow multiple points (like AutoCAD)
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
            UI.log(`SCALE: Specify scale factor or [Copy/Reference] <${CAD.lastScaleFactor}>:`, 'prompt');
        } else if (state.step === 2) {
            // Visual scaling by second point (scale factor from distance)
            if (state.cmdOptions.scaleMode === 'reference') {
                UI.log('SCALE: Specify second reference point:', 'prompt');
            } else {
                // Direct visual scale - calculate from first to second point
                const scale = Utils.dist(state.points[0], point);
                this.applyScale(state.points[0], scale, state.cmdOptions.scaleCopy);
            }
        } else if (state.step === 3) {
            // Reference mode - have first two reference points
            if (state.cmdOptions.scaleMode === 'reference') {
                UI.log('SCALE: Specify new length or [Points]:', 'prompt');
            }
        } else if (state.step === 4) {
            // Reference mode with new length from points
            const refDist = Utils.dist(state.points[1], state.points[2]);
            const newDist = Utils.dist(state.points[1], point);
            if (refDist > 0) {
                const scale = newDist / refDist;
                this.applyScale(state.points[0], scale, state.cmdOptions.scaleCopy);
            }
        }
    },

    applyScale(basePoint, scaleFactor, makeCopy = false) {
        const state = CAD;
        CAD.saveUndoState('Scale');
        state.lastScaleFactor = scaleFactor;

        if (makeCopy) {
            // Create scaled copies
            state.getSelectedEntities().forEach(entity => {
                const scaled = Geometry.scaleEntity(entity, basePoint, scaleFactor);
                delete scaled.id;
                CAD.addEntity(scaled, true);
            });
            UI.log(`${state.selectedIds.length} objects scaled (copy) by factor ${scaleFactor.toFixed(4)}`);
        } else {
            // Scale in place
            state.getSelectedEntities().forEach(entity => {
                const scaled = Geometry.scaleEntity(entity, basePoint, scaleFactor);
                CAD.updateEntity(entity.id, scaled, true);
            });
            UI.log(`${state.selectedIds.length} objects scaled by factor ${scaleFactor.toFixed(4)}`);
        }

        state.clearSelection();
        this.finishCommand();
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

    handleStretchClick(point) {
        const state = CAD;
        const mode = state.cmdOptions.stretchMode;

        if (mode === 'basePoint') {
            state.points.push(point);
            state.cmdOptions.stretchMode = 'displacement';
            UI.log('STRETCH: Specify second point or <use first point as displacement>:', 'prompt');
        } else if (mode === 'displacement') {
            const basePoint = state.points[0];
            const displacement = {
                x: point.x - basePoint.x,
                y: point.y - basePoint.y
            };

            CAD.saveUndoState('Stretch');

            // Get selected entities and stretch them
            const selectedEntities = state.getSelectedEntities();
            const stretchWindow = state.cmdOptions.stretchWindow;

            selectedEntities.forEach(entity => {
                const stretched = this.stretchEntity(entity, displacement, stretchWindow);
                if (stretched) {
                    CAD.updateEntity(entity.id, stretched, true);
                }
            });

            UI.log(`${state.selectedIds.length} objects stretched.`);
            state.clearSelection();
            this.finishCommand();
        }
    },

    stretchEntity(entity, displacement, window) {
        // Helper function to check if a point is in the stretch window
        const inWindow = (p) => {
            if (!window) return true;
            return p.x >= window.minX && p.x <= window.maxX &&
                   p.y >= window.minY && p.y <= window.maxY;
        };

        // Helper to move point if in window
        const stretchPoint = (p) => {
            if (inWindow(p)) {
                return { x: p.x + displacement.x, y: p.y + displacement.y };
            }
            return { ...p };
        };

        switch (entity.type) {
            case 'line':
                return {
                    ...entity,
                    p1: stretchPoint(entity.p1),
                    p2: stretchPoint(entity.p2)
                };

            case 'circle':
                // Circles move if center is in window
                if (inWindow(entity.center)) {
                    return {
                        ...entity,
                        center: stretchPoint(entity.center)
                    };
                }
                return entity;

            case 'arc':
                // Arcs move if center is in window
                if (inWindow(entity.center)) {
                    return {
                        ...entity,
                        center: stretchPoint(entity.center)
                    };
                }
                return entity;

            case 'rect':
                return {
                    ...entity,
                    p1: stretchPoint(entity.p1),
                    p2: stretchPoint(entity.p2)
                };

            case 'polyline':
                return {
                    ...entity,
                    points: entity.points.map(p => stretchPoint(p))
                };

            case 'ellipse':
                if (inWindow(entity.center)) {
                    return {
                        ...entity,
                        center: stretchPoint(entity.center)
                    };
                }
                return entity;

            case 'text':
                if (inWindow(entity.position)) {
                    return {
                        ...entity,
                        position: stretchPoint(entity.position)
                    };
                }
                return entity;

            default:
                return entity;
        }
    },

    handleOffsetClick(point) {
        const state = CAD;

        if (state.step === 0) {
            // Step 0: Waiting for distance - user can pick first point for two-point distance
            if (state.cmdOptions.offsetMode === 'picking') {
                // Second point picked - calculate distance
                const firstPoint = state.points[0];
                const distance = Utils.dist(firstPoint, point);
                CAD.offsetDist = distance;
                state.points = [];
                state.step = 1;
                UI.log(`Offset distance: ${distance.toFixed(4)}`);
                UI.log('OFFSET: Select object to offset:', 'prompt');
            } else {
                // First click - start two-point distance picking
                state.points = [point];
                state.cmdOptions.offsetMode = 'picking';
                UI.log(`First point: ${point.x.toFixed(4)}, ${point.y.toFixed(4)}`);
                UI.log('OFFSET: Specify second point:', 'prompt');
            }
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

    handleImageAttachClick(point) {
        const state = CAD;
        const imageData = state.cmdOptions.imageData;

        if (!imageData) {
            UI.log('IMAGEATTACH: No image loaded.', 'error');
            return;
        }

        if (state.step === 0) {
            state.cmdOptions.imageInsert = point;
            state.step = 1;
            UI.log(`IMAGEATTACH: Specify scale factor or corner <${CAD.imageAttachScale}>:`, 'prompt');
            return;
        }

        if (state.step === 1) {
            const scale = this.getImageScaleFromCorner(state.cmdOptions.imageInsert, point);
            state.cmdOptions.imageScale = scale;
            CAD.imageAttachScale = scale;
            state.step = 2;
            UI.log(`IMAGEATTACH: Specify rotation angle <${CAD.imageAttachRotation}>:`, 'prompt');
            return;
        }

        if (state.step === 2) {
            const angle = Utils.radToDeg(Utils.angle(state.cmdOptions.imageInsert, point));
            state.cmdOptions.imageRotation = angle;
            CAD.imageAttachRotation = angle;
            this.createImageEntity(state.cmdOptions.imageInsert, state.cmdOptions.imageScale, angle);
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

    handleExtendClick(point) {
        const state = CAD;

        if (state.cmdOptions.selectingEdges) {
            // Use all entities as boundary edges (AutoCAD behavior when Enter is pressed without selection)
            return;
        }

        const hit = this.hitTest(point);
        if (hit && hit.type === 'line') {
            const allEntities = CAD.getVisibleEntities().filter(e => e.id !== hit.id);
            const result = Geometry.extendLine(hit, point, allEntities);

            if (result) {
                CAD.saveUndoState('Extend');
                CAD.updateEntity(hit.id, result, true);
                UI.log('Object extended. Select next object to extend or [Exit]:');
                Renderer.draw();
            } else {
                UI.log('Cannot extend to any boundary.', 'error');
            }
        } else if (hit && hit.type === 'arc') {
            const allEntities = CAD.getVisibleEntities().filter(e => e.id !== hit.id);
            const result = Geometry.extendArc(hit, point, allEntities);

            if (result) {
                CAD.saveUndoState('Extend');
                CAD.updateEntity(hit.id, result, true);
                UI.log('Arc extended. Select next object to extend or [Exit]:');
                Renderer.draw();
            } else {
                UI.log('Cannot extend arc to any boundary.', 'error');
            }
        } else if (hit) {
            UI.log('Only lines and arcs can be extended.', 'error');
        } else {
            UI.log('No object found to extend.', 'error');
        }
    },

    handleHatchClick(point) {
        const targets = this.findHatchTargets(point);
        if (targets.length === 1) {
            this.applyHatch(targets[0]);
            this.finishCommand();
            return;
        }

        if (targets.length > 1) {
            CAD.addEntity({
                type: 'hatch',
                clipIds: targets.map(entity => entity.id),
                hatch: { pattern: CAD.hatchPattern }
            });
            UI.log('Hatch applied to intersection.');
            this.finishCommand();
            return;
        }

        const hit = this.hitTest(point);
        if (hit) {
            if (this.entitySupportsHatch(hit)) {
                this.applyHatch(hit);
            } else {
                UI.log('Object is not closed. Cannot hatch.', 'error');
            }
            this.finishCommand();
            return;
        }

        const loop = this.findLineLoopContainingPoint(point);
        if (loop) {
            CAD.addEntity({
                type: 'polyline',
                points: loop,
                hatch: { pattern: CAD.hatchPattern },
                noStroke: true
            });
            UI.log('Hatch applied from boundary.');
        } else {
            UI.log('No closed boundary found at that point.', 'error');
        }

        this.finishCommand();
    },

    getHatchPatternOptions() {
        const underline = (text, shortcut) => {
            const index = text.toLowerCase().indexOf(shortcut);
            if (index === -1) return text;
            return `${text.slice(0, index)}${text[index]}\u0332${text.slice(index + 1)}`;
        };
        return [
            underline('solid', 's'),
            underline('diagonal', 'd'),
            underline('cross', 'c'),
            underline('dots', 'o')
        ].join('/');
    },

    setHatchPattern(pattern) {
        CAD.hatchPattern = pattern;
        UI.log(`HATCH: Pattern set to ${pattern.toUpperCase()}.`, 'prompt');
    },

    entitySupportsHatch(entity) {
        if (entity.type === 'circle' || entity.type === 'rect' || entity.type === 'ellipse') {
            return true;
        }
        return entity.type === 'polyline' && Utils.isPolygonClosed(entity.points);
    },

    applyHatch(entity) {
        CAD.updateEntity(entity.id, { hatch: { pattern: CAD.hatchPattern } });
        UI.log('Hatch applied.');
    },

    findHatchTargets(point) {
        const targets = [];
        const entities = CAD.getVisibleEntities();
        for (const entity of entities) {
            if (!this.entitySupportsHatch(entity)) {
                continue;
            }
            if (this.pointInsideEntity(point, entity)) {
                targets.push(entity);
            }
        }
        if (targets.length > 1) {
            targets.sort((a, b) => this.getEntityArea(a) - this.getEntityArea(b));
        }
        return targets;
    },

    getEntityArea(entity) {
        switch (entity.type) {
            case 'circle':
                return Math.PI * entity.r * entity.r;
            case 'ellipse':
                return Math.PI * entity.rx * entity.ry;
            case 'rect':
                return Math.abs((entity.p2.x - entity.p1.x) * (entity.p2.y - entity.p1.y));
            case 'polyline':
                return Math.abs(Utils.polygonArea(entity.points));
            default:
                return Infinity;
        }
    },

    pointInsideEntity(point, entity) {
        switch (entity.type) {
            case 'circle':
                return Utils.dist(point, entity.center) <= entity.r;
            case 'ellipse':
                return Utils.pointInEllipse(point, entity);
            case 'rect':
                return Utils.pointInRect(point, entity.p1, entity.p2);
            case 'polyline': {
                const points = Utils.isPolygonClosed(entity.points)
                    ? entity.points
                    : [...entity.points, entity.points[0]];
                return Utils.pointInPolygon(point, points);
            }
            default:
                return false;
        }
    },

    findLineLoopContainingPoint(point) {
        const segments = [];
        const entities = CAD.getVisibleEntities();

        entities.forEach(entity => {
            if (entity.type === 'line') {
                segments.push({ p1: entity.p1, p2: entity.p2 });
            } else if (entity.type === 'polyline' && entity.points.length > 1) {
                for (let i = 0; i < entity.points.length - 1; i++) {
                    segments.push({ p1: entity.points[i], p2: entity.points[i + 1] });
                }
                if (entity.closed || Utils.isPolygonClosed(entity.points)) {
                    segments.push({ p1: entity.points[entity.points.length - 1], p2: entity.points[0] });
                }
            }
        });

        if (segments.length === 0) {
            return null;
        }

        const loops = this.buildLineLoops(segments);
        for (const loop of loops) {
            if (Utils.pointInPolygon(point, loop)) {
                return loop;
            }
        }

        return null;
    },

    buildLineLoops(segments) {
        const tolerance = 0.001;
        const keyFor = (p) => `${Math.round(p.x / tolerance)}:${Math.round(p.y / tolerance)}`;
        const pointForKey = new Map();
        const adjacency = new Map();

        const addAdjacency = (key, segmentIndex) => {
            if (!adjacency.has(key)) {
                adjacency.set(key, []);
            }
            adjacency.get(key).push(segmentIndex);
        };

        segments.forEach((segment, index) => {
            const key1 = keyFor(segment.p1);
            const key2 = keyFor(segment.p2);
            if (!pointForKey.has(key1)) pointForKey.set(key1, segment.p1);
            if (!pointForKey.has(key2)) pointForKey.set(key2, segment.p2);
            addAdjacency(key1, index);
            addAdjacency(key2, index);
        });

        const used = new Set();
        const loops = [];

        const followLoop = (startIndex) => {
            const startSeg = segments[startIndex];
            const startKey = keyFor(startSeg.p1);
            const nextKey = keyFor(startSeg.p2);
            const loop = [pointForKey.get(startKey)];
            let currentKey = nextKey;
            let prevKey = startKey;

            used.add(startIndex);
            loop.push(pointForKey.get(currentKey));

            let guard = 0;
            while (currentKey !== startKey && guard < segments.length + 5) {
                guard += 1;
                const options = (adjacency.get(currentKey) || []).filter(idx => !used.has(idx));
                if (options.length === 0) {
                    return null;
                }

                let nextIndex = options[0];
                if (options.length > 1) {
                    nextIndex = options.find(idx => {
                        const seg = segments[idx];
                        const keyA = keyFor(seg.p1);
                        const keyB = keyFor(seg.p2);
                        return keyA !== prevKey && keyB !== prevKey;
                    }) ?? options[0];
                }

                used.add(nextIndex);
                const seg = segments[nextIndex];
                const keyA = keyFor(seg.p1);
                const keyB = keyFor(seg.p2);
                const nextKeyCandidate = keyA === currentKey ? keyB : keyA;

                prevKey = currentKey;
                currentKey = nextKeyCandidate;
                loop.push(pointForKey.get(currentKey));
            }

            if (currentKey === startKey && loop.length >= 4) {
                return loop;
            }

            return null;
        };

        segments.forEach((segment, index) => {
            if (used.has(index)) return;
            const loop = followLoop(index);
            if (loop) {
                loops.push(loop);
            }
        });

        return loops;
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

    // Selection click with cycling is defined in QUICK-WIN section
    _oldHandleSelectionClick(point) {
        // Replaced by handleSelectionClick with selection cycling support
        this.handleSelectionClick(point);
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

        // Check for forced window mode from canvas toolbar
        let isCrossing;
        if (state.cmdOptions.forceWindowMode === 'window') {
            isCrossing = false;
            state.cmdOptions.forceWindowMode = null;
        } else if (state.cmdOptions.forceWindowMode === 'crossing') {
            isCrossing = true;
            state.cmdOptions.forceWindowMode = null;
        } else {
            isCrossing = endPoint.x < start.x;
        }

        // Don't clear existing selection - add to it
        const existingSelection = state.cmdOptions.needSelection ? [...state.selectedIds] : [];
        const newSelection = [];

        CAD.getVisibleEntities().forEach(entity => {
            const ext = CAD.getEntityExtents(entity);
            if (!ext) return;

            if (isCrossing) {
                // Crossing selection - any intersection
                if (ext.minX < box.x + box.w && ext.maxX > box.x &&
                    ext.minY < box.y + box.h && ext.maxY > box.y) {
                    newSelection.push(entity.id);
                }
            } else {
                // Window selection - fully inside
                if (ext.minX >= box.x && ext.maxX <= box.x + box.w &&
                    ext.minY >= box.y && ext.maxY <= box.y + box.h) {
                    newSelection.push(entity.id);
                }
            }
        });

        // Merge with existing selection (remove duplicates)
        if (state.cmdOptions.needSelection) {
            const combinedSet = new Set([...existingSelection, ...newSelection]);
            state.selectedIds = Array.from(combinedSet);
            UI.log(`${newSelection.length} found, ${state.selectedIds.length} total.`);
        } else {
            state.selectedIds = newSelection;
            UI.log(`${state.selectedIds.length} found.`);
        }

        state.selectionMode = false;
        state.selectStart = null;

        // Update canvas selection toolbar info
        UI.updateCanvasSelectionInfo();

        // Don't auto-continue if needSelection - wait for user confirmation
        // This allows user to keep adding to selection
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
            case 'stretch':
                CAD.cmdOptions.stretchMode = 'basePoint';
                UI.log('STRETCH: Specify base point:', 'prompt');
                break;
        }
    },

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    getImageScaleFromCorner(insertPoint, cornerPoint) {
        const imageData = CAD.cmdOptions.imageData;
        if (!imageData || !insertPoint || !cornerPoint) return CAD.imageAttachScale || 1;

        const width = Math.abs(cornerPoint.x - insertPoint.x);
        const height = Math.abs(cornerPoint.y - insertPoint.y);
        const scaleX = width / imageData.width;
        const scaleY = height / imageData.height;
        const scale = Math.max(scaleX, scaleY);
        return scale > 0 ? scale : (CAD.imageAttachScale || 1);
    },

    createImageEntity(insertPoint, scaleFactor, rotationAngle) {
        if (!insertPoint || !scaleFactor) {
            this.finishCommand();
            return;
        }

        const imageData = CAD.cmdOptions.imageData;
        if (!imageData) {
            UI.log('IMAGEATTACH: No image loaded.', 'error');
            this.finishCommand();
            return;
        }

        const width = imageData.width * scaleFactor;
        const height = imageData.height * scaleFactor;
        const rotation = rotationAngle ?? CAD.imageAttachRotation ?? 0;

        CAD.addEntity({
            type: 'image',
            p1: { ...insertPoint },
            p2: { x: insertPoint.x + width, y: insertPoint.y + height },
            width,
            height,
            src: imageData.src,
            opacity: 0.6,
            scale: scaleFactor,
            rotation
        });
        UI.log('Image attached.');
        this.finishCommand();
        Renderer.draw();
    },

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
                if (CAD.offsetGapType === 0) {
                    const offsetRect = Geometry.offsetRect(entity.p1, entity.p2, CAD.offsetDist, clickPoint);
                    if (offsetRect) {
                        newData = { type: 'rect', ...offsetRect };
                    }
                } else {
                    const rectPoints = [
                        { x: entity.p1.x, y: entity.p1.y },
                        { x: entity.p2.x, y: entity.p1.y },
                        { x: entity.p2.x, y: entity.p2.y },
                        { x: entity.p1.x, y: entity.p2.y },
                        { x: entity.p1.x, y: entity.p1.y }
                    ];
                    const offsetPoly = Geometry.offsetPolyline({ points: rectPoints }, CAD.offsetDist, clickPoint);
                    if (offsetPoly) {
                        newData = { type: 'polyline', ...offsetPoly };
                    }
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
            } else if (entity.type === 'block') {
                // Explode block reference into individual entities
                const expandedEntities = CAD.getBlockEntities(entity);
                if (expandedEntities.length > 0) {
                    expandedEntities.forEach(expandedEntity => {
                        expandedEntity.layer = entity.layer || expandedEntity.layer;
                        CAD.addEntity(expandedEntity, true);
                    });
                    CAD.removeEntity(entity.id, true);
                    explodedCount++;
                    UI.log(`Block "${entity.blockName}" exploded into ${expandedEntities.length} object(s).`);
                } else {
                    UI.log(`Block "${entity.blockName}" not found or empty.`, 'error');
                }
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
                case 'leader':
                    UI.log(`  Points: ${entity.points.length}`);
                    UI.log(`  Text: ${entity.text}`);
                    break;
                case 'image':
                    UI.log(`  Insertion: ${Utils.formatPoint(entity.p1)}`);
                    UI.log(`  Width: ${(entity.width ?? Math.abs(entity.p2.x - entity.p1.x)).toFixed(4)}`);
                    UI.log(`  Height: ${(entity.height ?? Math.abs(entity.p2.y - entity.p1.y)).toFixed(4)}`);
                    UI.log(`  Scale: ${(entity.scale ?? 1).toFixed(4)}`);
                    UI.log(`  Rotation: ${(entity.rotation ?? 0).toFixed(2)}°`);
                    break;
                case 'block':
                    UI.log(`  Block Name: ${entity.blockName}`);
                    UI.log(`  Insertion Point: ${Utils.formatPoint(entity.insertPoint)}`);
                    UI.log(`  Scale X: ${(entity.scale?.x ?? 1).toFixed(4)}`);
                    UI.log(`  Scale Y: ${(entity.scale?.y ?? 1).toFixed(4)}`);
                    UI.log(`  Rotation: ${Utils.radToDeg(entity.rotation ?? 0).toFixed(2)}°`);
                    const block = CAD.getBlock(entity.blockName);
                    if (block) {
                        UI.log(`  Block Entities: ${block.entities.length}`);
                    }
                    break;
            }
        });
    },

    getSelectableTypes() {
        const types = CAD.getVisibleEntities().map(entity => entity.type);
        return Array.from(new Set(types)).sort();
    },

    selectByType(type) {
        const normalizedType = type.toLowerCase();
        const types = this.getSelectableTypes();
        if (!types.includes(normalizedType)) {
            UI.log(`QSELECT: Unknown type "${type}". Use LIST for options.`, 'error');
            return;
        }
        CAD.selectedIds = CAD.getVisibleEntities()
            .filter(entity => entity.type === normalizedType)
            .map(entity => entity.id);
        UI.log(`${CAD.selectedIds.length} ${normalizedType}(s) selected.`);
        UI.updateCanvasSelectionInfo();
        Renderer.draw();
    },

    selectSimilar() {
        const selected = CAD.getSelectedEntities();
        if (selected.length === 0) {
            UI.log('SELECTSIMILAR: No objects selected.', 'error');
            return;
        }
        this.selectByType(selected[0].type);
    },

    getLinetypeOptions() {
        return ['continuous', 'dashed', 'dotted', 'dashdot'];
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

    finishCommand(preventRestart = false) {
        const lastCmd = CAD.activeCmd;
        CAD.finishCommand();
        UI.setActiveButton(null);
        UI.updateCommandPrompt(null);
        UI.hideCanvasSelectionToolbar();
        UI.updateSelectionRibbon();
        UI.resetPrompt();
        Renderer.draw();

        // Auto-restart repeatable commands (like AutoCAD)
        if (!preventRestart && lastCmd && this.repeatableCommands.includes(lastCmd)) {
            // Small delay to allow UI to update
            setTimeout(() => {
                this.startCommand(lastCmd);
            }, 50);
        }
    },

    cancelCommand() {
        // Clear the last drawing command so it doesn't restart
        this.lastDrawingCmd = null;
        CAD.cancelCommand();
        CAD.clearSelection();
        CAD.selectionMode = false;
        CAD.selectStart = null;
        CAD.cmdOptions.forceWindowMode = null;
        UI.setActiveButton(null);
        UI.updateCommandPrompt(null);
        UI.log('*Cancel*');
        UI.resetPrompt();
        UI.updateSelectionRibbon();
        UI.hideCanvasSelectionToolbar();
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
    // BLOCK COMMAND HANDLERS
    // ==========================================

    handleBlockClick(point) {
        const state = CAD;

        // If we're waiting for base point
        if (state.cmdOptions.waitingForBasePoint) {
            state.cmdOptions.blockBasePoint = { ...point };
            state.cmdOptions.waitingForBasePoint = false;

            // Now create the block
            this.createBlock();
        }
    },

    createBlock() {
        const state = CAD;
        const name = state.cmdOptions.blockName;
        const basePoint = state.cmdOptions.blockBasePoint;
        const selectedEntities = state.getSelectedEntities();

        if (!name || !basePoint || selectedEntities.length === 0) {
            UI.log('BLOCK: Invalid block parameters.', 'error');
            this.finishCommand(true);
            return;
        }

        // Check if block already exists
        if (CAD.getBlock(name)) {
            UI.log(`BLOCK: Block "${name}" already exists. Use a different name.`, 'error');
            this.finishCommand(true);
            return;
        }

        CAD.saveUndoState('Create Block');

        // Create the block definition
        const block = CAD.addBlock(name, basePoint, selectedEntities);
        if (block) {
            // Remove the original entities (like AutoCAD)
            CAD.removeEntities(state.selectedIds, true);

            // Insert a block reference at the base point
            CAD.addEntity({
                type: 'block',
                blockName: name,
                insertPoint: { ...basePoint },
                scale: { x: 1, y: 1 },
                rotation: 0
            }, true);

            UI.log(`BLOCK: Block "${name}" created with ${selectedEntities.length} object(s).`);
        } else {
            UI.log('BLOCK: Failed to create block.', 'error');
        }

        state.clearSelection();
        this.finishCommand(true);
    },

    handleInsertClick(point) {
        const state = CAD;

        // If block is selected and we're placing it
        if (state.cmdOptions.insertBlockName) {
            const blockName = state.cmdOptions.insertBlockName;
            const scale = state.cmdOptions.insertScale || { x: 1, y: 1 };
            const rotation = state.cmdOptions.insertRotation || 0;

            CAD.saveUndoState('Insert Block');

            CAD.addEntity({
                type: 'block',
                blockName: blockName,
                insertPoint: { ...point },
                scale: scale,
                rotation: Utils.degToRad(rotation)
            });

            UI.log(`INSERT: Block "${blockName}" inserted.`);

            // Ask for next insertion point (like AutoCAD)
            UI.log('INSERT: Specify insertion point or [Enter] to finish:', 'prompt');
        }
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
            const entity = CAD.addEntity({
                type: 'dimension',
                dimType: state.activeCmd === 'dimaligned' ? 'aligned' : 'linear',
                p1: { ...p1 },
                p2: { ...p2 },
                dimLinePos: { ...dimLine },
                value: distance,
                text: distance.toFixed(CAD.dimPrecision ?? 2)
            });
            CAD.lastLinearDim = entity;

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
                    text: `${prefix}${value.toFixed(CAD.dimPrecision ?? 2)}`
                });

                UI.log(`${state.activeCmd === 'dimdiameter' ? 'Diameter' : 'Radius'}: ${value.toFixed(4)}`);
            }
            this.finishCommand();
        } else {
            UI.log('Please select a circle or arc.', 'error');
        }
    },

    handleDimContinueClick(point) {
        const state = CAD;
        state.points.push(point);
        state.step++;

        if (state.step === 1) {
            UI.log(`${state.activeCmd === 'dimbaseline' ? 'DIMBASELINE' : 'DIMCONTINUE'}: Specify dimension line location:`, 'prompt');
        } else if (state.step === 2) {
            const p1 = state.cmdOptions.dimBasePoint;
            const p2 = state.points[0];
            const dimLine = state.points[1];
            if (!p1) {
                UI.log('Dimension base point missing.', 'error');
                this.finishCommand(true);
                return;
            }
            const distance = Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y) ?
                Math.abs(p2.x - p1.x) : Math.abs(p2.y - p1.y);
            const entity = CAD.addEntity({
                type: 'dimension',
                dimType: 'linear',
                p1: { ...p1 },
                p2: { ...p2 },
                dimLinePos: { ...dimLine },
                value: distance,
                text: distance.toFixed(CAD.dimPrecision ?? 2)
            });
            CAD.lastLinearDim = entity;
            UI.log(`Dimension: ${distance.toFixed(4)}`);
            this.finishCommand();
        }
    },

    // ==========================================
    // QUICK-WIN COMMAND HANDLERS
    // ==========================================

    // --- Entity length/point helpers ---
    getEntityLength(entity) {
        switch (entity.type) {
            case 'line':
                return Utils.dist(entity.p1, entity.p2);
            case 'circle':
                return 2 * Math.PI * entity.r;
            case 'arc': {
                let sweep = entity.end - entity.start;
                if (sweep < 0) sweep += 2 * Math.PI;
                return entity.r * sweep;
            }
            case 'polyline': {
                let len = 0;
                for (let i = 1; i < entity.points.length; i++) {
                    len += Utils.dist(entity.points[i - 1], entity.points[i]);
                }
                return len;
            }
            case 'ellipse': {
                // Approximate ellipse perimeter (Ramanujan)
                const a = entity.rx, b = entity.ry;
                return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
            }
            case 'rect': {
                const w = Math.abs(entity.p2.x - entity.p1.x);
                const h = Math.abs(entity.p2.y - entity.p1.y);
                return 2 * (w + h);
            }
            default:
                return 0;
        }
    },

    getPointAtDistance(entity, distance) {
        switch (entity.type) {
            case 'line': {
                const len = Utils.dist(entity.p1, entity.p2);
                if (len === 0) return { ...entity.p1 };
                const t = distance / len;
                return Utils.lerp(entity.p1, entity.p2, t);
            }
            case 'circle': {
                const angle = (distance / entity.r); // in radians
                return {
                    x: entity.center.x + entity.r * Math.cos(angle),
                    y: entity.center.y + entity.r * Math.sin(angle)
                };
            }
            case 'arc': {
                const angle = entity.start + (distance / entity.r);
                return {
                    x: entity.center.x + entity.r * Math.cos(angle),
                    y: entity.center.y + entity.r * Math.sin(angle)
                };
            }
            case 'polyline': {
                let remaining = distance;
                for (let i = 1; i < entity.points.length; i++) {
                    const segLen = Utils.dist(entity.points[i - 1], entity.points[i]);
                    if (remaining <= segLen) {
                        const t = segLen > 0 ? remaining / segLen : 0;
                        return Utils.lerp(entity.points[i - 1], entity.points[i], t);
                    }
                    remaining -= segLen;
                }
                return { ...entity.points[entity.points.length - 1] };
            }
            case 'rect': {
                // Trace around rectangle perimeter
                const corners = [
                    { ...entity.p1 },
                    { x: entity.p2.x, y: entity.p1.y },
                    { ...entity.p2 },
                    { x: entity.p1.x, y: entity.p2.y },
                    { ...entity.p1 }
                ];
                let remaining = distance;
                for (let i = 1; i < corners.length; i++) {
                    const segLen = Utils.dist(corners[i - 1], corners[i]);
                    if (remaining <= segLen) {
                        const t = segLen > 0 ? remaining / segLen : 0;
                        return Utils.lerp(corners[i - 1], corners[i], t);
                    }
                    remaining -= segLen;
                }
                return { ...corners[corners.length - 1] };
            }
            default:
                return null;
        }
    },

    // --- DIVIDE ---
    handleDivideClick(point) {
        const hit = this.hitTest(point);
        if (!hit) {
            UI.log('DIVIDE: No object found. Select an object:', 'prompt');
            return;
        }
        const length = this.getEntityLength(hit);
        if (length <= 0) {
            UI.log('DIVIDE: Cannot divide this object type.', 'error');
            this.finishCommand();
            return;
        }
        CAD.cmdOptions.divideTarget = hit;
        UI.log('DIVIDE: Enter number of segments <2>:', 'prompt');
    },

    executeDivide(entity, segments) {
        const length = this.getEntityLength(entity);
        const segLen = length / segments;
        CAD.saveUndoState('Divide');

        for (let i = 1; i < segments; i++) {
            const pt = this.getPointAtDistance(entity, segLen * i);
            if (pt) {
                CAD.addEntity({ type: 'point', position: pt }, true);
            }
        }
        UI.log(`DIVIDE: ${segments - 1} point(s) placed.`);
        this.finishCommand();
        Renderer.draw();
    },

    // --- MEASURE ---
    handleMeasureClick(point) {
        const hit = this.hitTest(point);
        if (!hit) {
            UI.log('MEASURE: No object found. Select an object:', 'prompt');
            return;
        }
        const length = this.getEntityLength(hit);
        if (length <= 0) {
            UI.log('MEASURE: Cannot measure this object type.', 'error');
            this.finishCommand();
            return;
        }
        CAD.cmdOptions.measureTarget = hit;
        UI.log('MEASURE: Specify length of interval:', 'prompt');
    },

    executeMeasure(entity, interval) {
        const length = this.getEntityLength(entity);
        const count = Math.floor(length / interval);
        if (count < 1) {
            UI.log('MEASURE: Interval is larger than entity length.', 'error');
            this.finishCommand();
            return;
        }
        CAD.saveUndoState('Measure');

        for (let i = 1; i <= count; i++) {
            const pt = this.getPointAtDistance(entity, interval * i);
            if (pt) {
                CAD.addEntity({ type: 'point', position: pt }, true);
            }
        }
        UI.log(`MEASURE: ${count} point(s) placed at ${interval} intervals.`);
        this.finishCommand();
        Renderer.draw();
    },

    // --- REVCLOUD ---
    handleRevcloudClick(point) {
        const state = CAD;
        if (state.step === 0) {
            // Still waiting for arc length input, accept default
            state.step = 1;
            UI.log('REVCLOUD: Specify first point:', 'prompt');
            return;
        }
        state.points.push(point);
        if (state.points.length === 1) {
            UI.log('REVCLOUD: Specify next point or [Close]:', 'prompt');
        } else {
            const first = state.points[0];
            const last = state.points[state.points.length - 1];
            if (Utils.dist(first, last) < 15 / CAD.zoom && state.points.length >= 3) {
                // Close the revcloud
                this.createRevcloud(state.points);
                return;
            }
            UI.log('REVCLOUD: Specify next point or [Close]:', 'prompt');
        }
        Renderer.draw();
    },

    createRevcloud(points) {
        const arcLen = CAD.cmdOptions.revcloudArcLen || 15;
        // Generate arc bumps along the polyline path
        const revcloudPoints = [];
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const segLen = Utils.dist(p1, p2);
            const numArcs = Math.max(1, Math.round(segLen / arcLen));
            const angle = Utils.angle(p1, p2);
            const perpAngle = angle + Math.PI / 2;
            const bumpHeight = arcLen * 0.4;

            for (let j = 0; j < numArcs; j++) {
                const t0 = j / numArcs;
                const t1 = (j + 1) / numArcs;
                const tMid = (t0 + t1) / 2;

                revcloudPoints.push(Utils.lerp(p1, p2, t0));
                // Add arc bump point
                const midPt = Utils.lerp(p1, p2, tMid);
                revcloudPoints.push({
                    x: midPt.x + bumpHeight * Math.cos(perpAngle),
                    y: midPt.y + bumpHeight * Math.sin(perpAngle)
                });
            }
        }
        // Close the shape
        if (revcloudPoints.length > 0) {
            revcloudPoints.push({ ...revcloudPoints[0] });
        }

        CAD.saveUndoState('Revision Cloud');
        CAD.addEntity({
            type: 'polyline',
            points: revcloudPoints,
            isRevcloud: true
        }, true);
        UI.log('REVCLOUD: Revision cloud created.');
        this.finishCommand();
        Renderer.draw();
    },

    // --- MATCHPROP ---
    handleMatchpropClick(point) {
        const state = CAD;
        const hit = this.hitTest(point);
        if (!hit) {
            UI.log('MATCHPROP: No object found. Try again.', 'prompt');
            return;
        }

        if (!state.cmdOptions.matchSource) {
            // First click: select source
            state.cmdOptions.matchSource = hit;
            UI.log(`MATCHPROP: Source: ${hit.type} on layer "${hit.layer}". Select destination objects:`, 'prompt');
        } else {
            // Subsequent clicks: apply properties to destination
            const src = state.cmdOptions.matchSource;
            CAD.saveUndoState('Match Properties');
            CAD.updateEntity(hit.id, {
                layer: src.layer,
                lineWeight: src.lineWeight,
                lineType: src.lineType,
                color: src.color || undefined
            });
            UI.log(`MATCHPROP: Properties applied to ${hit.type}. Select next or press Enter to finish.`, 'prompt');
            Renderer.draw();
        }
    },

    // --- WIPEOUT ---
    handleWipeoutClick(point) {
        const state = CAD;
        state.points.push(point);

        if (state.points.length === 1) {
            UI.log('WIPEOUT: Specify next point:', 'prompt');
        } else {
            UI.log(`WIPEOUT: Specify next point or press Enter to finish (${state.points.length} points):`, 'prompt');
        }
        Renderer.draw();
    },

    createWipeout() {
        const state = CAD;
        if (state.points.length < 3) {
            UI.log('WIPEOUT: Need at least 3 points.', 'error');
            this.finishCommand();
            return;
        }
        CAD.saveUndoState('Wipeout');
        // Close the polygon
        const pts = [...state.points, { ...state.points[0] }];
        CAD.addEntity({
            type: 'wipeout',
            points: pts
        }, true);
        UI.log('WIPEOUT: Wipeout created.');
        this.finishCommand();
        Renderer.draw();
    },

    // --- LAYER LOCK/UNLOCK ---
    lockLayer(layerName, lock) {
        const layer = CAD.getLayer(layerName);
        if (!layer) {
            const layerNames = CAD.layers.map(l => l.name).join(', ');
            UI.log(`Layer "${layerName}" not found. Available: ${layerNames}`, 'error');
            return;
        }
        layer.locked = lock;
        UI.log(`Layer "${layerName}" ${lock ? 'locked' : 'unlocked'}.`);
        UI.updateLayerUI();
        this.finishCommand();
        Renderer.draw();
    },

    // --- NAMED VIEWS ---
    saveNamedView(name) {
        if (!name) {
            UI.log('VIEW: Enter a valid name.', 'error');
            return;
        }
        if (!CAD.namedViews) CAD.namedViews = {};
        CAD.namedViews[name] = {
            pan: { ...CAD.pan },
            zoom: CAD.zoom
        };
        UI.log(`VIEW: View "${name}" saved.`);
        this.finishCommand();
    },

    restoreNamedView(name) {
        if (!CAD.namedViews || !CAD.namedViews[name]) {
            UI.log(`VIEW: View "${name}" not found.`, 'error');
            return;
        }
        const view = CAD.namedViews[name];
        CAD.pan = { ...view.pan };
        CAD.zoom = view.zoom;
        UI.log(`VIEW: Restored view "${name}".`);
        this.finishCommand();
        Renderer.draw();
    },

    deleteNamedView(name) {
        if (!CAD.namedViews || !CAD.namedViews[name]) {
            UI.log(`VIEW: View "${name}" not found.`, 'error');
            return;
        }
        delete CAD.namedViews[name];
        UI.log(`VIEW: View "${name}" deleted.`);
        this.finishCommand();
    },

    listNamedViews() {
        if (!CAD.namedViews || Object.keys(CAD.namedViews).length === 0) {
            UI.log('VIEW: No named views defined.');
        } else {
            const views = Object.keys(CAD.namedViews);
            UI.log(`VIEW: ${views.length} view(s): ${views.join(', ')}`);
        }
        this.finishCommand();
    },

    // --- DIMORDINATE ---
    handleDimOrdinateClick(point) {
        const state = CAD;
        if (state.step === 0) {
            state.points.push(point);
            state.step = 1;
            UI.log('DIMORDINATE: Specify leader endpoint or [Xdatum/Ydatum]:', 'prompt');
        } else if (state.step === 1) {
            state.points.push(point);
            const featurePt = state.points[0];
            const leaderEnd = state.points[1];

            // Determine X or Y based on direction of leader
            const dx = Math.abs(leaderEnd.x - featurePt.x);
            const dy = Math.abs(leaderEnd.y - featurePt.y);
            const isXDatum = state.cmdOptions.dimOrdAxis === 'x' || (!state.cmdOptions.dimOrdAxis && dy > dx);
            const isYDatum = state.cmdOptions.dimOrdAxis === 'y' || (!state.cmdOptions.dimOrdAxis && dx >= dy);

            const value = isXDatum ? featurePt.x : featurePt.y;
            const precision = CAD.dimPrecision || 4;
            const text = value.toFixed(precision);

            CAD.saveUndoState('Ordinate Dimension');
            CAD.addEntity({
                type: 'dimension',
                dimType: 'ordinate',
                featurePoint: { ...featurePt },
                leaderEnd: { ...leaderEnd },
                isXDatum: isXDatum,
                text: text,
                value: value
            }, true);

            UI.log(`DIMORDINATE: ${isXDatum ? 'X' : 'Y'} = ${text}`);
            CAD.lastLinearDim = { p1: featurePt, p2: leaderEnd };
            this.finishCommand();
            Renderer.draw();
        }
    },

    // --- SELECTION CYCLING ---
    hitTestAll(point) {
        const tolerance = 10 / CAD.zoom;
        const entities = CAD.getVisibleEntities();
        const hits = [];

        for (let i = entities.length - 1; i >= 0; i--) {
            if (Geometry.hitTest(point, entities[i], tolerance)) {
                hits.push(entities[i]);
            }
        }
        return hits;
    },

    handleSelectionClick(point) {
        const hits = this.hitTestAll(point);
        if (hits.length === 0) {
            // Start window/crossing selection
            CAD.selectionMode = true;
            CAD.selectStart = point;
            Renderer.draw();
            return;
        }

        if (hits.length === 1) {
            CAD.select(hits[0].id);
            UI.log(`Selected: ${hits[0].type} on layer "${hits[0].layer}"`);
        } else {
            // Selection cycling: cycle through overlapping entities
            if (!CAD.cmdOptions._cycleHits ||
                !CAD.cmdOptions._cyclePoint ||
                Utils.dist(CAD.cmdOptions._cyclePoint, point) > 5 / CAD.zoom) {
                // New cycle location
                CAD.cmdOptions._cycleHits = hits;
                CAD.cmdOptions._cycleIndex = 0;
                CAD.cmdOptions._cyclePoint = { ...point };
            } else {
                // Advance cycle
                CAD.cmdOptions._cycleIndex = (CAD.cmdOptions._cycleIndex + 1) % hits.length;
            }

            const idx = CAD.cmdOptions._cycleIndex;
            const entity = hits[idx];
            CAD.clearSelection();
            CAD.select(entity.id);
            UI.log(`Cycling (${idx + 1}/${hits.length}): ${entity.type} on layer "${entity.layer}". Click again to cycle.`);
        }
        UI.updateSelectionRibbon();
        Renderer.draw();
    },

    // --- OVERKILL ---
    executeOverkill() {
        const entities = CAD.getVisibleEntities();
        const toRemove = [];
        const tolerance = 0.001;

        for (let i = 0; i < entities.length; i++) {
            if (toRemove.includes(entities[i].id)) continue;
            for (let j = i + 1; j < entities.length; j++) {
                if (toRemove.includes(entities[j].id)) continue;
                if (this.areEntitiesDuplicate(entities[i], entities[j], tolerance)) {
                    toRemove.push(entities[j].id);
                }
            }
        }

        if (toRemove.length === 0) {
            UI.log('OVERKILL: No duplicate objects found.');
        } else {
            CAD.saveUndoState('Overkill');
            CAD.removeEntities(toRemove, true);
            UI.log(`OVERKILL: ${toRemove.length} duplicate object(s) removed.`);
        }
        this.finishCommand();
        Renderer.draw();
    },

    areEntitiesDuplicate(a, b, tol) {
        if (a.type !== b.type) return false;
        if (a.layer !== b.layer) return false;

        switch (a.type) {
            case 'line':
                return (this.pointsEqual(a.p1, b.p1, tol) && this.pointsEqual(a.p2, b.p2, tol)) ||
                       (this.pointsEqual(a.p1, b.p2, tol) && this.pointsEqual(a.p2, b.p1, tol));
            case 'circle':
                return this.pointsEqual(a.center, b.center, tol) && Math.abs(a.r - b.r) < tol;
            case 'arc':
                return this.pointsEqual(a.center, b.center, tol) &&
                       Math.abs(a.r - b.r) < tol &&
                       Math.abs(a.start - b.start) < tol &&
                       Math.abs(a.end - b.end) < tol;
            case 'rect':
                return (this.pointsEqual(a.p1, b.p1, tol) && this.pointsEqual(a.p2, b.p2, tol)) ||
                       (this.pointsEqual(a.p1, b.p2, tol) && this.pointsEqual(a.p2, b.p1, tol));
            case 'point':
                return this.pointsEqual(a.position, b.position, tol);
            case 'polyline':
                if (a.points.length !== b.points.length) return false;
                return a.points.every((p, i) => this.pointsEqual(p, b.points[i], tol));
            case 'text':
            case 'mtext':
                return this.pointsEqual(a.position, b.position, tol) && a.text === b.text;
            case 'ellipse':
                return this.pointsEqual(a.center, b.center, tol) &&
                       Math.abs(a.rx - b.rx) < tol &&
                       Math.abs(a.ry - b.ry) < tol;
            default:
                return false;
        }
    },

    pointsEqual(a, b, tol) {
        return Math.abs(a.x - b.x) < tol && Math.abs(a.y - b.y) < tol;
    },

    // ==========================================
    // INPUT HANDLING
    // ==========================================

    handleInput(input) {
        const state = CAD;
        input = input.trim();

        if (!input) {
            // Enter pressed with empty input

            // TEXT - use default height
            if (state.activeCmd === 'text' && state.step === 1) {
                CAD.cmdOptions.textHeight = CAD.textHeight || 10;
                state.step = 2;
                UI.log('TEXT: Specify rotation angle <0>:', 'prompt');
                return true;
            }

            // TEXT - use default rotation (0)
            if (state.activeCmd === 'text' && state.step === 2) {
                CAD.cmdOptions.textRotation = 0;
                state.step = 3;
                UI.log('TEXT: Enter text:', 'prompt');
                return true;
            }

            // POINT - finish point command on Enter
            if (state.activeCmd === 'point') {
                this.finishCommand();
                return true;
            }

            // Confirm selection during modify commands
            if (state.cmdOptions.needSelection && state.selectedIds.length > 0) {
                // Store for "Previous" option
                UI.previousSelection = [...state.selectedIds];
                state.cmdOptions.needSelection = false;
                UI.hideCanvasSelectionToolbar();
                this.continueCommand(state.activeCmd);
                Renderer.draw();
                return true;
            }

            // Cancel selection mode if no selection made
            if (state.cmdOptions.needSelection && state.selectedIds.length === 0) {
                UI.log('No objects selected.');
                this.finishCommand(true);
                return true;
            }

            if (state.activeCmd === 'osnap') {
                CAD.osnapEnabled = !CAD.osnapEnabled;
                UI.log(`OSNAP: ${CAD.osnapEnabled ? 'ON' : 'OFF'}`);
                UI.updateStatusBar();
                this.finishCommand();
                return true;
            }

            if (state.activeCmd === 'polar') {
                CAD.polarEnabled = !CAD.polarEnabled;
                UI.log(`POLAR: ${CAD.polarEnabled ? 'ON' : 'OFF'}`);
                UI.updateStatusBar();
                this.finishCommand();
                return true;
            }

            if (state.activeCmd === 'offset' && state.step === 0) {
                state.step = 1;
                UI.log(`Offset distance: ${CAD.offsetDist.toFixed(4)}`);
                UI.log('OFFSET: Select object to offset:', 'prompt');
                return true;
            }

            if (state.activeCmd === 'scale' && state.step === 1 && state.cmdOptions.scaleMode === 'factor') {
                const scaleFactor = CAD.lastScaleFactor || 1;
                this.applyScale(state.points[0], scaleFactor, state.cmdOptions.scaleCopy);
                return true;
            }

            if (state.activeCmd === 'imageattach' && state.step === 1) {
                const scaleFactor = CAD.imageAttachScale || 1;
                state.cmdOptions.imageScale = scaleFactor;
                state.step = 2;
                UI.log(`IMAGEATTACH: Specify rotation angle <${CAD.imageAttachRotation}>:`, 'prompt');
                return true;
            }

            if (state.activeCmd === 'imageattach' && state.step === 2) {
                const rotation = CAD.imageAttachRotation || 0;
                state.cmdOptions.imageRotation = rotation;
                this.createImageEntity(state.cmdOptions.imageInsert, state.cmdOptions.imageScale, rotation);
                return true;
            }

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

            if (state.activeCmd === 'imageattach' && state.step === 1) {
                this.createImageEntity(state.cmdOptions.imageInsert, this.getImageDefaultCorner());
                return true;
            }

            // INSERT - accept default scale with Enter
            if (state.activeCmd === 'insert' && state.cmdOptions.waitingForScale) {
                state.cmdOptions.insertScale = { x: 1, y: 1 };
                state.cmdOptions.waitingForScale = false;
                state.cmdOptions.waitingForRotation = true;
                UI.log(`INSERT: Specify rotation angle <0>:`, 'prompt');
                return true;
            }

            // INSERT - accept default rotation with Enter
            if (state.activeCmd === 'insert' && state.cmdOptions.waitingForRotation) {
                state.cmdOptions.insertRotation = 0;
                state.cmdOptions.waitingForRotation = false;
                UI.log('INSERT: Specify insertion point:', 'prompt');
                return true;
            }

            // INSERT - finish on empty Enter during placement
            if (state.activeCmd === 'insert' && state.cmdOptions.insertBlockName && !state.cmdOptions.waitingForScale && !state.cmdOptions.waitingForRotation) {
                this.finishCommand(true);
                return true;
            }

            // WIPEOUT - finish on Enter
            if (state.activeCmd === 'wipeout' && state.points.length >= 3) {
                this.createWipeout();
                return true;
            }

            // REVCLOUD - accept default arc length on Enter
            if (state.activeCmd === 'revcloud' && state.step === 0) {
                state.step = 1;
                UI.log('REVCLOUD: Specify first point:', 'prompt');
                return true;
            }

            // REVCLOUD - close on Enter
            if (state.activeCmd === 'revcloud' && state.points.length >= 3) {
                this.createRevcloud(state.points);
                return true;
            }

            // MATCHPROP - finish on Enter
            if (state.activeCmd === 'matchprop' && state.cmdOptions.matchSource) {
                this.finishCommand();
                return true;
            }

            // VIEW - toggle default on enter
            if (state.activeCmd === 'view') {
                this.listNamedViews();
                return true;
            }

            if (state.activeCmd === 'leader' && state.step === 2) {
                UI.log('LEADER: Text required to finish leader.', 'error');
                return true;
            }

            if (state.activeCmd) {
                this.finishCommand();
                Renderer.draw();
                return true;
            }

            return false;
        }

        if (state.activeCmd === 'leader' && state.step === 2) {
            this.completeLeaderCommand(input);
            return true;
        }

        // DIVIDE - number of segments input
        if (state.activeCmd === 'divide' && state.cmdOptions.divideTarget) {
            const num = parseInt(input);
            if (!isNaN(num) && num >= 2) {
                this.executeDivide(state.cmdOptions.divideTarget, num);
                return true;
            }
            UI.log('DIVIDE: Enter a valid number (2 or more).', 'error');
            return true;
        }

        // MEASURE - distance input
        if (state.activeCmd === 'measure' && state.cmdOptions.measureTarget) {
            const dist = parseFloat(input);
            if (!isNaN(dist) && dist > 0) {
                this.executeMeasure(state.cmdOptions.measureTarget, dist);
                return true;
            }
            UI.log('MEASURE: Enter a valid positive distance.', 'error');
            return true;
        }

        // REVCLOUD - arc length input
        if (state.activeCmd === 'revcloud' && state.step === 0) {
            const arcLen = parseFloat(input);
            if (!isNaN(arcLen) && arcLen > 0) {
                CAD.cmdOptions.revcloudArcLen = arcLen;
                state.step = 1;
                UI.log('REVCLOUD: Specify first point:', 'prompt');
                return true;
            }
            // If not a number, accept default and start picking
            state.step = 1;
            UI.log('REVCLOUD: Specify first point:', 'prompt');
            return true;
        }

        // VIEW command
        if (state.activeCmd === 'view') {
            const value = input.toLowerCase();
            if (state.cmdOptions.viewAction === 'save') {
                this.saveNamedView(input.trim());
                return true;
            }
            if (state.cmdOptions.viewAction === 'restore') {
                this.restoreNamedView(input.trim());
                return true;
            }
            if (state.cmdOptions.viewAction === 'delete') {
                this.deleteNamedView(input.trim());
                return true;
            }
            if (value === 's' || value === 'save') {
                state.cmdOptions.viewAction = 'save';
                UI.log('VIEW: Enter name for current view:', 'prompt');
                return true;
            }
            if (value === 'r' || value === 'restore') {
                state.cmdOptions.viewAction = 'restore';
                const viewNames = Object.keys(CAD.namedViews || {});
                UI.log(`VIEW: Available views: ${viewNames.length ? viewNames.join(', ') : 'None'}`);
                UI.log('VIEW: Enter view name to restore:', 'prompt');
                return true;
            }
            if (value === 'd' || value === 'delete') {
                state.cmdOptions.viewAction = 'delete';
                UI.log('VIEW: Enter view name to delete:', 'prompt');
                return true;
            }
            if (value === 'l' || value === 'list') {
                this.listNamedViews();
                return true;
            }
            UI.log('VIEW: Unknown option. [Save/Restore/Delete/List]', 'error');
            return true;
        }

        // LAYLCK - lock layer
        if (state.activeCmd === 'laylck') {
            this.lockLayer(input.trim(), true);
            return true;
        }

        // LAYULK - unlock layer
        if (state.activeCmd === 'layulk') {
            this.lockLayer(input.trim(), false);
            return true;
        }

        // DIMORDINATE - axis option
        if (state.activeCmd === 'dimordinate' && state.step === 1) {
            const opt = input.toLowerCase();
            if (opt === 'x' || opt === 'xdatum') {
                CAD.cmdOptions.dimOrdAxis = 'x';
                UI.log('DIMORDINATE: X datum selected. Specify leader endpoint:', 'prompt');
                return true;
            }
            if (opt === 'y' || opt === 'ydatum') {
                CAD.cmdOptions.dimOrdAxis = 'y';
                UI.log('DIMORDINATE: Y datum selected. Specify leader endpoint:', 'prompt');
                return true;
            }
        }

        if (state.activeCmd === 'osnap') {
            const value = input.toLowerCase();
            const modes = {
                end: 'endpoint',
                endpoint: 'endpoint',
                mid: 'midpoint',
                midpoint: 'midpoint',
                cen: 'center',
                center: 'center',
                int: 'intersection',
                intersection: 'intersection',
                per: 'perpendicular',
                perpendicular: 'perpendicular',
                tan: 'tangent',
                tangent: 'tangent',
                nea: 'nearest',
                nearest: 'nearest'
            };
            if (value === 'on' || value === 'off') {
                CAD.osnapEnabled = value === 'on';
                UI.log(`OSNAP: ${CAD.osnapEnabled ? 'ON' : 'OFF'}`);
                UI.updateStatusBar();
                this.finishCommand();
                return true;
            }
            if (value === 'all') {
                Object.keys(CAD.snapModes).forEach(mode => {
                    CAD.snapModes[mode] = true;
                });
                UI.log('OSNAP: All modes enabled.');
                UI.updateStatusBar();
                this.finishCommand();
                return true;
            }
            if (value === 'none') {
                Object.keys(CAD.snapModes).forEach(mode => {
                    CAD.snapModes[mode] = false;
                });
                UI.log('OSNAP: All modes disabled.');
                UI.updateStatusBar();
                this.finishCommand();
                return true;
            }
            if (value === 'list') {
                const enabled = Object.entries(CAD.snapModes)
                    .filter(([, enabled]) => enabled)
                    .map(([mode]) => mode);
                UI.log(`OSNAP: Enabled modes: ${enabled.length ? enabled.join(', ') : 'None'}.`, 'prompt');
                this.finishCommand();
                return true;
            }
            const modeKey = modes[value];
            if (modeKey) {
                CAD.snapModes[modeKey] = !CAD.snapModes[modeKey];
                UI.log(`OSNAP: ${modeKey} ${CAD.snapModes[modeKey] ? 'enabled' : 'disabled'}.`);
                UI.updateStatusBar();
                this.finishCommand();
                return true;
            }
            UI.log(`OSNAP: Unknown option "${input}".`, 'error');
            return true;
        }

        if (state.activeCmd === 'polar') {
            const value = input.toLowerCase();
            if (value === 'on' || value === 'off') {
                CAD.polarEnabled = value === 'on';
                UI.log(`POLAR: ${CAD.polarEnabled ? 'ON' : 'OFF'}`);
                UI.updateStatusBar();
                this.finishCommand();
                return true;
            }
            if (value === 'angle') {
                UI.log(`POLAR: Enter new angle <${CAD.polarAngle}>:`, 'prompt');
                return true;
            }
            const angle = parseFloat(input);
            if (!Number.isNaN(angle)) {
                CAD.polarAngle = Math.abs(angle) || 45;
                UI.log(`POLAR: Angle set to ${CAD.polarAngle}`);
                UI.updateStatusBar();
                this.finishCommand();
                return true;
            }
            UI.log(`POLAR: Unknown option "${input}".`, 'error');
            return true;
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
                if (state.cmdOptions.scaleMode === 'reference') {
                    // Reference mode - first number is reference length
                    state.cmdOptions.refLength = num;
                    UI.log(`Reference length: ${num}`);
                    UI.log('SCALE: Specify new length:', 'prompt');
                    state.step = 5; // Special step for new length input
                } else {
                    // Direct scale factor input
                    this.applyScale(state.points[0], num, state.cmdOptions.scaleCopy);
                }
                Renderer.draw();
                return true;
            }

            if (state.activeCmd === 'imageattach' && state.step === 1) {
                const scale = Math.abs(num) || 1;
                state.cmdOptions.imageScale = scale;
                CAD.imageAttachScale = scale;
                state.step = 2;
                UI.log(`IMAGEATTACH: Specify rotation angle <${CAD.imageAttachRotation}>:`, 'prompt');
                return true;
            }

            if (state.activeCmd === 'imageattach' && state.step === 2) {
                const rotation = num;
                state.cmdOptions.imageRotation = rotation;
                CAD.imageAttachRotation = rotation;
                this.createImageEntity(state.cmdOptions.imageInsert, state.cmdOptions.imageScale, rotation);
                return true;
            }

            if (state.activeCmd === 'scale' && state.step === 5) {
                // Reference mode - new length entered after reference length
                const refLen = state.cmdOptions.refLength || 1;
                if (refLen > 0) {
                    const scale = num / refLen;
                    this.applyScale(state.points[0], scale, state.cmdOptions.scaleCopy);
                }
                Renderer.draw();
                return true;
            }

            if (state.activeCmd === 'scale' && state.step === 3 && state.cmdOptions.scaleMode === 'reference') {
                // Reference mode by points - numeric new length input
                const refDist = Utils.dist(state.points[1], state.points[2]);
                if (refDist > 0) {
                    const scale = num / refDist;
                    this.applyScale(state.points[0], scale, state.cmdOptions.scaleCopy);
                }
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

            // TEXT - height input
            if (state.activeCmd === 'text' && state.step === 1) {
                CAD.cmdOptions.textHeight = num;
                state.step = 2;
                UI.log('TEXT: Specify rotation angle <0>:', 'prompt');
                return true;
            }

            // TEXT - rotation input
            if (state.activeCmd === 'text' && state.step === 2) {
                CAD.cmdOptions.textRotation = num;
                state.step = 3;
                UI.log('TEXT: Enter text:', 'prompt');
                return true;
            }

            // MTEXT - height input
            if (state.activeCmd === 'mtext' && state.cmdOptions.waitingForHeight) {
                CAD.cmdOptions.textHeight = num;
                state.cmdOptions.waitingForHeight = false;
                UI.log('MTEXT: Specify opposite corner:', 'prompt');
                return true;
            }

            // POINT - set PDMODE
            if (state.activeCmd === 'point' && input.toLowerCase() === 's') {
                const mode = prompt('Enter PDMODE (0=dot, 2=+, 3=X, 32=square, 64=circle):', CAD.pointDisplayMode);
                if (mode !== null) {
                    CAD.pointDisplayMode = parseInt(mode) || 3;
                    UI.log(`Point display mode set to ${CAD.pointDisplayMode}`);
                    Renderer.draw();
                }
                return true;
            }

            // OFFSETGAPTYPE setting
            if (state.activeCmd === 'offsetgaptype') {
                const val = Math.max(0, Math.min(2, Math.round(num)));
                CAD.offsetGapType = val;
                const types = ['Extend', 'Fillet', 'Chamfer'];
                UI.log(`OFFSETGAPTYPE set to ${val} (${types[val]})`);
                this.finishCommand();
                return true;
            }

            // PDMODE setting
            if (state.activeCmd === 'pdmode') {
                CAD.pointDisplayMode = Math.round(num);
                UI.log(`PDMODE set to ${CAD.pointDisplayMode}`);
                Renderer.draw();
                this.finishCommand();
                return true;
            }

            // PDSIZE setting
            if (state.activeCmd === 'pdsize') {
                CAD.pointDisplaySize = Math.abs(num) || 5;
                UI.log(`PDSIZE set to ${CAD.pointDisplaySize}`);
                Renderer.draw();
                this.finishCommand();
                return true;
            }

            // TEXTSIZE setting
            if (state.activeCmd === 'textsize') {
                CAD.textHeight = Math.abs(num) || 10;
                UI.log(`TEXTSIZE set to ${CAD.textHeight}`);
                this.finishCommand();
                return true;
            }

            // DIMTXT setting (dimension text height)
            if (state.activeCmd === 'dimtxt') {
                CAD.dimTextHeight = Math.abs(num) || 2.5;
                UI.log(`DIMTXT set to ${CAD.dimTextHeight}`);
                Renderer.draw();
                this.finishCommand();
                return true;
            }

            // DIMASZ setting (dimension arrow size)
            if (state.activeCmd === 'dimasz') {
                CAD.dimArrowSize = Math.abs(num) || 2.5;
                UI.log(`DIMASZ set to ${CAD.dimArrowSize}`);
                Renderer.draw();
                this.finishCommand();
                return true;
            }

            // DIMSCALE setting (overall dimension scale)
            if (state.activeCmd === 'dimscale') {
                CAD.dimScale = Math.abs(num) || 1;
                UI.log(`DIMSCALE set to ${CAD.dimScale}`);
                Renderer.draw();
                this.finishCommand();
                return true;
            }

            if (state.activeCmd === 'dimdec') {
                CAD.dimPrecision = Math.max(0, Math.round(num));
                UI.log(`DIMDEC set to ${CAD.dimPrecision}`);
                Renderer.draw();
                this.finishCommand();
                return true;
            }

            if (state.activeCmd === 'ltscale') {
                CAD.lineTypeScale = Math.abs(num) || 1;
                UI.log(`LTSCALE set to ${CAD.lineTypeScale}`);
                Renderer.draw();
                this.finishCommand();
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

            // INSERT - scale factor input
            if (state.activeCmd === 'insert' && state.cmdOptions.waitingForScale) {
                state.cmdOptions.insertScale = { x: num, y: num };
                state.cmdOptions.waitingForScale = false;
                state.cmdOptions.waitingForRotation = true;
                UI.log(`INSERT: Specify rotation angle <0>:`, 'prompt');
                return true;
            }

            // INSERT - rotation angle input
            if (state.activeCmd === 'insert' && state.cmdOptions.waitingForRotation) {
                state.cmdOptions.insertRotation = num;
                state.cmdOptions.waitingForRotation = false;
                UI.log('INSERT: Specify insertion point:', 'prompt');
                return true;
            }
        }

        if (state.activeCmd === 'qselect' && state.cmdOptions.waitingForQselectType) {
            const query = input.toLowerCase();
            if (query === 'list') {
                const types = this.getSelectableTypes();
                UI.log(`QSELECT types: ${types.length ? types.join(', ') : 'None'}`, 'prompt');
                return true;
            }
            state.cmdOptions.waitingForQselectType = false;
            this.selectByType(query);
            this.finishCommand();
            return true;
        }

        if (state.activeCmd === 'layer') {
            const tokens = input.trim().split(/\s+/);
            const action = tokens[0]?.toLowerCase();
            const name = tokens.slice(1).join(' ');
            if (!action) {
                UI.log('LAYER: Enter option [New/Set/On/Off/List]:', 'prompt');
                return true;
            }
            if (action === 'list') {
                CAD.layers.forEach(layer => {
                    UI.log(`  ${layer.name} (${layer.visible ? 'On' : 'Off'})`);
                });
                this.finishCommand();
                return true;
            }
            if (action === 'new') {
                if (!name) {
                    UI.log('LAYER: Enter new layer name.', 'error');
                    return true;
                }
                const layer = CAD.addLayer(name);
                if (!layer) {
                    UI.log(`LAYER: Layer "${name}" already exists.`, 'error');
                    return true;
                }
                CAD.setCurrentLayer(name);
                UI.updateLayerUI();
                UI.log(`LAYER: Layer "${name}" created and set current.`);
                this.finishCommand();
                return true;
            }
            if (action === 'set') {
                if (!name) {
                    UI.log('LAYER: Enter layer name to set current.', 'error');
                    return true;
                }
                if (!CAD.setCurrentLayer(name)) {
                    UI.log(`LAYER: Layer "${name}" not found.`, 'error');
                    return true;
                }
                UI.updateLayerUI();
                UI.log(`LAYER: Current layer set to "${name}".`);
                this.finishCommand();
                return true;
            }
            if (action === 'on' || action === 'off') {
                if (!name) {
                    UI.log(`LAYER: Enter layer name to turn ${action}.`, 'error');
                    return true;
                }
                const layer = CAD.getLayer(name);
                if (!layer) {
                    UI.log(`LAYER: Layer "${name}" not found.`, 'error');
                    return true;
                }
                layer.visible = action === 'on';
                UI.updateLayerUI();
                Renderer.draw();
                UI.log(`LAYER: Layer "${name}" turned ${action}.`);
                this.finishCommand();
                return true;
            }
            if (CAD.setCurrentLayer(input.trim())) {
                UI.updateLayerUI();
                UI.log(`LAYER: Current layer set to "${input.trim()}".`);
                this.finishCommand();
                return true;
            }
            UI.log(`LAYER: Unknown option "${input}".`, 'error');
            return true;
        }

        if (['layfrz', 'laythw', 'layon', 'layoff'].includes(state.activeCmd)) {
            const value = input.trim();
            const targetName = value ? value : CAD.currentLayer;
            const layer = CAD.getLayer(targetName);
            if (!layer) {
                UI.log(`LAYER: Layer "${targetName}" not found.`, 'error');
                return true;
            }
            if (state.activeCmd === 'layfrz' || state.activeCmd === 'layoff') {
                layer.visible = false;
            } else {
                layer.visible = true;
            }
            UI.updateLayerUI();
            Renderer.draw();
            UI.log(`LAYER: Layer "${targetName}" ${layer.visible ? 'On' : 'Off'}.`);
            this.finishCommand();
            return true;
        }

        if (state.activeCmd === 'linetype') {
            const value = input.toLowerCase();
            const options = this.getLinetypeOptions();
            if (value === 'list') {
                UI.log(`LINETYPE options: ${options.join(', ')}`, 'prompt');
                return true;
            }
            if (!options.includes(value)) {
                UI.log(`LINETYPE: Unknown linetype "${input}". Use LIST to see options.`, 'error');
                return true;
            }
            if (state.selectedIds.length > 0) {
                CAD.saveUndoState('Set Linetype');
                state.selectedIds.forEach(id => {
                    CAD.updateEntity(id, { lineType: value }, true);
                });
                UI.log(`LINETYPE set to ${value} for ${state.selectedIds.length} object(s).`);
                Renderer.draw();
            } else {
                CAD.lineType = value;
                UI.log(`LINETYPE set to ${CAD.lineType}.`);
            }
            this.finishCommand();
            return true;
        }

        // BLOCK - name input
        if (state.activeCmd === 'block' && state.cmdOptions.waitingForName) {
            const blockName = input.trim();
            if (!blockName) {
                UI.log('BLOCK: Invalid block name.', 'error');
                return true;
            }
            if (CAD.getBlock(blockName)) {
                UI.log(`BLOCK: Block "${blockName}" already exists. Enter a different name:`, 'prompt');
                return true;
            }
            state.cmdOptions.blockName = blockName;
            state.cmdOptions.waitingForName = false;
            state.cmdOptions.waitingForBasePoint = true;
            UI.log('BLOCK: Specify base point:', 'prompt');
            return true;
        }

        // INSERT - block name input
        if (state.activeCmd === 'insert' && state.cmdOptions.waitingForBlockName) {
            const blockName = input.trim();
            if (!CAD.getBlock(blockName)) {
                const blockList = CAD.getBlockList();
                UI.log(`INSERT: Block "${blockName}" not found. Available blocks: ${blockList.join(', ')}`, 'error');
                return true;
            }
            state.cmdOptions.insertBlockName = blockName;
            state.cmdOptions.waitingForBlockName = false;
            state.cmdOptions.waitingForScale = true;
            UI.log(`INSERT: Specify scale factor <1>:`, 'prompt');
            return true;
        }

        if (state.activeCmd === 'hatch') {
            const pattern = input.toLowerCase();
            const validPatterns = {
                solid: 'solid',
                s: 'solid',
                diagonal: 'diagonal',
                d: 'diagonal',
                cross: 'cross',
                c: 'cross',
                dots: 'dots',
                o: 'dots',
                ansi31: 'diagonal',
                ansi32: 'cross',
                ansi37: 'dots'
            };

            if (pattern === 'list') {
                UI.log(`HATCH patterns: ${this.getHatchPatternOptions()}`, 'prompt');
                return true;
            }

            if (validPatterns[pattern]) {
                this.setHatchPattern(validPatterns[pattern]);
                return true;
            }
        }

        // Undo last point during LINE or POLYLINE drawing
        if ((input.toLowerCase() === 'u' || input.toLowerCase() === 'undo') &&
            (state.activeCmd === 'line' || state.activeCmd === 'polyline' || state.activeCmd === 'spline')) {
            if (state.points.length > 1) {
                // Remove the last point
                state.points.pop();
                // For line, we also need to undo the last created entity
                if (state.activeCmd === 'line' && CAD.entities.length > 0) {
                    const lastEntity = CAD.entities[CAD.entities.length - 1];
                    if (lastEntity.type === 'line') {
                        CAD.removeEntity(lastEntity.id, true);
                        UI.log('LINE: Last segment undone. Specify next point:', 'prompt');
                    }
                }
                if (state.activeCmd === 'polyline') {
                    UI.log('PLINE: Last point undone. Specify next point or [Arc/Close/Undo]:', 'prompt');
                }
                if (state.activeCmd === 'spline') {
                    UI.log('SPLINE: Last point undone. Specify next point:', 'prompt');
                }
                Renderer.draw();
            } else if (state.points.length === 1) {
                state.points = [];
                UI.log(`${state.activeCmd.toUpperCase()}: Cannot undo - specify first point:`, 'prompt');
            } else {
                UI.log('Nothing to undo.', 'error');
            }
            return true;
        }

        // Check for special command options

        // SCALE options: Copy, Reference, Points
        if (state.activeCmd === 'scale') {
            const option = input.toLowerCase();

            if ((option === 'c' || option === 'copy') && state.step === 1) {
                state.cmdOptions.scaleCopy = true;
                UI.log(`SCALE: Copy mode enabled. Specify scale factor or [Reference] <${CAD.lastScaleFactor}>:`, 'prompt');
                return true;
            }

            if ((option === 'r' || option === 'reference') && state.step === 1) {
                state.cmdOptions.scaleMode = 'reference';
                UI.log('SCALE: Specify reference length or [Points] <1>:', 'prompt');
                return true;
            }

            if ((option === 'p' || option === 'points') && state.step === 1 && state.cmdOptions.scaleMode === 'reference') {
                state.step = 2;
                UI.log('SCALE: Specify first reference point:', 'prompt');
                return true;
            }
        }

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

        // PEDIT options handling
        if (state.activeCmd === 'pedit' && state.cmdOptions.peditTarget) {
            const option = input.toLowerCase();
            const target = state.cmdOptions.peditTarget;

            if (option === 'c' || option === 'close') {
                // Close polyline
                if (target.type === 'polyline' && target.points.length >= 3) {
                    if (!Utils.isPolygonClosed(target.points)) {
                        CAD.saveUndoState('PEDIT Close');
                        target.points.push({ ...target.points[0] });
                        target.closed = true;
                        CAD.updateEntity(target.id, target, true);
                        UI.log('Polyline closed.');
                        Renderer.draw();
                    } else {
                        UI.log('Polyline is already closed.');
                    }
                }
                this.finishCommand();
                return true;
            }

            if (option === 'o' || option === 'open') {
                // Open polyline
                if (target.type === 'polyline' && target.points.length >= 3) {
                    if (Utils.isPolygonClosed(target.points)) {
                        CAD.saveUndoState('PEDIT Open');
                        target.points.pop();
                        target.closed = false;
                        CAD.updateEntity(target.id, target, true);
                        UI.log('Polyline opened.');
                        Renderer.draw();
                    } else {
                        UI.log('Polyline is already open.');
                    }
                }
                this.finishCommand();
                return true;
            }

            if (option === 'j' || option === 'join') {
                // Join nearby lines/polylines
                UI.log('PEDIT Join: Select objects to join:', 'prompt');
                state.cmdOptions.peditMode = 'join';
                state.cmdOptions.needSelection = true;
                return true;
            }

            if (option === 's' || option === 'spline') {
                // Convert to spline curve
                if (target.type === 'polyline') {
                    CAD.saveUndoState('PEDIT Spline');
                    target.isSpline = true;
                    CAD.updateEntity(target.id, target, true);
                    UI.log('Polyline converted to spline.');
                    Renderer.draw();
                }
                this.finishCommand();
                return true;
            }

            if (option === 'd' || option === 'decurve') {
                // Remove spline curve
                if (target.type === 'polyline') {
                    CAD.saveUndoState('PEDIT Decurve');
                    target.isSpline = false;
                    CAD.updateEntity(target.id, target, true);
                    UI.log('Spline removed from polyline.');
                    Renderer.draw();
                }
                this.finishCommand();
                return true;
            }

            if (option === 'x' || option === 'exit') {
                this.finishCommand();
                return true;
            }

            UI.log('PEDIT: Unknown option. [Close/Open/Join/Spline/Decurve/eXit]:', 'prompt');
            return true;
        }

        // TEXT - text content input (step 3)
        if (state.activeCmd === 'text' && state.step === 3 && input.length > 0) {
            this.completeTextCommand(input);
            Renderer.draw();
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
