/* ============================================
   HTMLCAD - Storage Module
   ============================================ */

const Storage = {
    STORAGE_KEY: 'htmlcad_drawing',
    SETTINGS_KEY: 'htmlcad_settings',

    // ==========================================
    // LOCAL STORAGE OPERATIONS
    // ==========================================

    saveToLocalStorage() {
        try {
            const data = CAD.toJSON();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            CAD.modified = false;
            UI.log('Drawing saved to local storage.');
            return true;
        } catch (e) {
            UI.log('Error saving drawing: ' + e.message, 'error');
            return false;
        }
    },

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (!saved) {
                UI.log('No saved drawing found.');
                return false;
            }

            const data = JSON.parse(saved);
            CAD.fromJSON(data);
            UI.updateLayerUI();
            Renderer.draw();
            UI.log('Drawing loaded from local storage.');
            return true;
        } catch (e) {
            UI.log('Error loading drawing: ' + e.message, 'error');
            return false;
        }
    },

    clearLocalStorage() {
        localStorage.removeItem(this.STORAGE_KEY);
        UI.log('Saved drawing cleared.');
    },

    hasSavedDrawing() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },

    // ==========================================
    // SETTINGS PERSISTENCE
    // ==========================================

    saveSettings() {
        try {
            const settings = {
                snapEnabled: CAD.snapEnabled,
                snapModes: CAD.snapModes,
                orthoEnabled: CAD.orthoEnabled,
                polarEnabled: CAD.polarEnabled,
                polarAngle: CAD.polarAngle,
                showGrid: CAD.showGrid,
                gridSpacing: CAD.gridSpacing,
                gridSubdivisions: CAD.gridSubdivisions,
                gridSize: CAD.gridSize
            };
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    },

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.SETTINGS_KEY);
            if (!saved) return false;

            const settings = JSON.parse(saved);
            Object.assign(CAD, settings);
            UI.updateStatusBar();
            return true;
        } catch (e) {
            console.error('Error loading settings:', e);
            return false;
        }
    },

    // ==========================================
    // FILE EXPORT - JSON
    // ==========================================

    exportJSON() {
        try {
            const data = CAD.toJSON();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            this.downloadBlob(blob, `${CAD.drawingName || 'drawing'}.json`);
            UI.log('Drawing exported as JSON.');
        } catch (e) {
            UI.log('Error exporting JSON: ' + e.message, 'error');
        }
    },

    // ==========================================
    // FILE EXPORT - DXF
    // ==========================================

    exportDXF() {
        try {
            const dxf = this.generateDXF();
            const blob = new Blob([dxf], { type: 'application/dxf' });
            this.downloadBlob(blob, `${CAD.drawingName || 'drawing'}.dxf`);
            UI.log('Drawing exported as DXF.');
        } catch (e) {
            UI.log('Error exporting DXF: ' + e.message, 'error');
        }
    },

    generateDXF() {
        let dxf = '';

        // Header section
        dxf += '0\nSECTION\n';
        dxf += '2\nHEADER\n';
        dxf += '9\n$ACADVER\n1\nAC1015\n';
        dxf += '9\n$INSBASE\n10\n0.0\n20\n0.0\n30\n0.0\n';
        dxf += '9\n$EXTMIN\n10\n0.0\n20\n0.0\n30\n0.0\n';
        dxf += '9\n$EXTMAX\n10\n1000.0\n20\n1000.0\n30\n0.0\n';
        dxf += '0\nENDSEC\n';

        // Tables section (layers)
        dxf += '0\nSECTION\n';
        dxf += '2\nTABLES\n';
        dxf += '0\nTABLE\n';
        dxf += '2\nLAYER\n';
        dxf += '70\n' + CAD.layers.length + '\n';

        CAD.layers.forEach(layer => {
            dxf += '0\nLAYER\n';
            dxf += '2\n' + layer.name + '\n';
            dxf += '70\n0\n';
            dxf += '62\n' + this.getAciColor(layer.color) + '\n';
            dxf += '6\nCONTINUOUS\n';
        });

        dxf += '0\nENDTAB\n';
        dxf += '0\nENDSEC\n';

        // Entities section
        dxf += '0\nSECTION\n';
        dxf += '2\nENTITIES\n';

        CAD.entities.forEach(entity => {
            dxf += this.entityToDXF(entity);
        });

        dxf += '0\nENDSEC\n';
        dxf += '0\nEOF\n';

        return dxf;
    },

    entityToDXF(entity) {
        let dxf = '';
        const color = CAD.getEntityColor(entity);
        const colorInt = Utils.hexToInt(color);

        switch (entity.type) {
            case 'line':
                dxf += '0\nLINE\n';
                dxf += '8\n' + entity.layer + '\n';
                dxf += '420\n' + colorInt + '\n';
                dxf += '10\n' + entity.p1.x + '\n';
                dxf += '20\n' + (-entity.p1.y) + '\n';
                dxf += '30\n0.0\n';
                dxf += '11\n' + entity.p2.x + '\n';
                dxf += '21\n' + (-entity.p2.y) + '\n';
                dxf += '31\n0.0\n';
                break;

            case 'circle':
                dxf += '0\nCIRCLE\n';
                dxf += '8\n' + entity.layer + '\n';
                dxf += '420\n' + colorInt + '\n';
                dxf += '10\n' + entity.center.x + '\n';
                dxf += '20\n' + (-entity.center.y) + '\n';
                dxf += '30\n0.0\n';
                dxf += '40\n' + entity.r + '\n';
                break;

            case 'arc':
                dxf += '0\nARC\n';
                dxf += '8\n' + entity.layer + '\n';
                dxf += '420\n' + colorInt + '\n';
                dxf += '10\n' + entity.center.x + '\n';
                dxf += '20\n' + (-entity.center.y) + '\n';
                dxf += '30\n0.0\n';
                dxf += '40\n' + entity.r + '\n';
                // Convert radians to degrees and flip for DXF coordinate system
                dxf += '50\n' + (-Utils.radToDeg(entity.end)) + '\n';
                dxf += '51\n' + (-Utils.radToDeg(entity.start)) + '\n';
                break;

            case 'rect':
                dxf += '0\nLWPOLYLINE\n';
                dxf += '8\n' + entity.layer + '\n';
                dxf += '420\n' + colorInt + '\n';
                dxf += '90\n4\n';
                dxf += '70\n1\n'; // Closed
                dxf += '10\n' + entity.p1.x + '\n20\n' + (-entity.p1.y) + '\n';
                dxf += '10\n' + entity.p2.x + '\n20\n' + (-entity.p1.y) + '\n';
                dxf += '10\n' + entity.p2.x + '\n20\n' + (-entity.p2.y) + '\n';
                dxf += '10\n' + entity.p1.x + '\n20\n' + (-entity.p2.y) + '\n';
                break;

            case 'polyline':
                dxf += '0\nLWPOLYLINE\n';
                dxf += '8\n' + entity.layer + '\n';
                dxf += '420\n' + colorInt + '\n';
                dxf += '90\n' + entity.points.length + '\n';
                dxf += '70\n' + (Utils.isPolygonClosed(entity.points) ? 1 : 0) + '\n';
                entity.points.forEach(p => {
                    dxf += '10\n' + p.x + '\n20\n' + (-p.y) + '\n';
                });
                break;

            case 'ellipse':
                dxf += '0\nELLIPSE\n';
                dxf += '8\n' + entity.layer + '\n';
                dxf += '420\n' + colorInt + '\n';
                dxf += '10\n' + entity.center.x + '\n';
                dxf += '20\n' + (-entity.center.y) + '\n';
                dxf += '30\n0.0\n';
                // Major axis endpoint relative to center
                const majorX = entity.rx * Math.cos(entity.rotation || 0);
                const majorY = entity.rx * Math.sin(entity.rotation || 0);
                dxf += '11\n' + majorX + '\n';
                dxf += '21\n' + (-majorY) + '\n';
                dxf += '31\n0.0\n';
                // Ratio of minor to major axis
                dxf += '40\n' + (entity.ry / entity.rx) + '\n';
                dxf += '41\n0.0\n'; // Start parameter
                dxf += '42\n' + (Math.PI * 2) + '\n'; // End parameter
                break;

            case 'text':
                dxf += '0\nTEXT\n';
                dxf += '8\n' + entity.layer + '\n';
                dxf += '420\n' + colorInt + '\n';
                dxf += '10\n' + entity.position.x + '\n';
                dxf += '20\n' + (-entity.position.y) + '\n';
                dxf += '30\n0.0\n';
                dxf += '40\n' + entity.height + '\n';
                dxf += '1\n' + entity.text + '\n';
                if (entity.rotation) {
                    dxf += '50\n' + entity.rotation + '\n';
                }
                break;

            case 'point':
                dxf += '0\nPOINT\n';
                dxf += '8\n' + entity.layer + '\n';
                dxf += '420\n' + colorInt + '\n';
                dxf += '10\n' + entity.position.x + '\n';
                dxf += '20\n' + (-entity.position.y) + '\n';
                dxf += '30\n0.0\n';
                break;
        }

        // Add hatch if entity has it
        if (entity.hatch) {
            dxf += this.generateHatchDXF(entity, colorInt);
        }

        return dxf;
    },

    generateHatchDXF(entity, colorInt) {
        let dxf = '';

        dxf += '0\nHATCH\n';
        dxf += '8\n' + entity.layer + '\n';
        dxf += '420\n' + colorInt + '\n';
        dxf += '10\n0.0\n20\n0.0\n30\n0.0\n';
        dxf += '210\n0.0\n220\n0.0\n230\n1.0\n';
        dxf += '2\nSOLID\n';
        dxf += '70\n1\n';
        dxf += '71\n0\n';
        dxf += '91\n1\n';

        if (entity.type === 'circle') {
            dxf += '92\n1\n';
            dxf += '93\n1\n';
            dxf += '72\n2\n';
            dxf += '10\n' + entity.center.x + '\n';
            dxf += '20\n' + (-entity.center.y) + '\n';
            dxf += '40\n' + entity.r + '\n';
            dxf += '50\n0.0\n51\n360.0\n73\n1\n97\n0\n';
        } else {
            let pts = [];
            if (entity.type === 'rect') {
                pts = [
                    { x: entity.p1.x, y: -entity.p1.y },
                    { x: entity.p2.x, y: -entity.p1.y },
                    { x: entity.p2.x, y: -entity.p2.y },
                    { x: entity.p1.x, y: -entity.p2.y }
                ];
            } else if (entity.type === 'polyline') {
                pts = entity.points.map(p => ({ x: p.x, y: -p.y }));
            }

            dxf += '92\n2\n72\n0\n73\n1\n';
            dxf += '93\n' + pts.length + '\n';
            pts.forEach(p => {
                dxf += '10\n' + p.x + '\n20\n' + p.y + '\n';
            });
            dxf += '97\n0\n';
        }

        return dxf;
    },

    getAciColor(hexColor) {
        // Simplified mapping - return white (7) for now
        // A full implementation would map to AutoCAD Color Index
        const rgb = Utils.hexToRgb(hexColor);
        if (!rgb) return 7;

        // Simple approximation
        if (rgb.r > 200 && rgb.g > 200 && rgb.b > 200) return 7; // White
        if (rgb.r > 200 && rgb.g < 100 && rgb.b < 100) return 1; // Red
        if (rgb.r < 100 && rgb.g > 200 && rgb.b < 100) return 3; // Green
        if (rgb.r < 100 && rgb.g < 100 && rgb.b > 200) return 5; // Blue
        if (rgb.r > 200 && rgb.g > 200 && rgb.b < 100) return 2; // Yellow
        if (rgb.r < 100 && rgb.g > 200 && rgb.b > 200) return 4; // Cyan
        if (rgb.r > 200 && rgb.g < 100 && rgb.b > 200) return 6; // Magenta

        return 7; // Default white
    },

    // ==========================================
    // FILE EXPORT - SVG
    // ==========================================

    exportSVG() {
        try {
            const svg = this.generateSVG();
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            this.downloadBlob(blob, `${CAD.drawingName || 'drawing'}.svg`);
            UI.log('Drawing exported as SVG.');
        } catch (e) {
            UI.log('Error exporting SVG: ' + e.message, 'error');
        }
    },

    generateSVG() {
        // Calculate bounds
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        CAD.entities.forEach(entity => {
            const ext = CAD.getEntityExtents(entity);
            if (ext) {
                minX = Math.min(minX, ext.minX);
                minY = Math.min(minY, ext.minY);
                maxX = Math.max(maxX, ext.maxX);
                maxY = Math.max(maxY, ext.maxY);
            }
        });

        if (minX === Infinity) {
            minX = 0; minY = 0; maxX = 100; maxY = 100;
        }

        const padding = 10;
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding * 2;

        let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        svg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX - padding} ${minY - padding} ${width} ${height}" width="${width}" height="${height}">\n`;
        svg += `<rect x="${minX - padding}" y="${minY - padding}" width="${width}" height="${height}" fill="#1a1a1a"/>\n`;

        CAD.entities.forEach(entity => {
            svg += this.entityToSVG(entity);
        });

        svg += '</svg>';
        return svg;
    },

    entityToSVG(entity) {
        const color = CAD.getEntityColor(entity);
        const style = `stroke="${color}" stroke-width="1" fill="none"`;

        switch (entity.type) {
            case 'line':
                return `<line x1="${entity.p1.x}" y1="${entity.p1.y}" x2="${entity.p2.x}" y2="${entity.p2.y}" ${style}/>\n`;

            case 'circle':
                const fill = entity.hatch ? `fill="${color}" fill-opacity="0.2"` : 'fill="none"';
                return `<circle cx="${entity.center.x}" cy="${entity.center.y}" r="${entity.r}" stroke="${color}" stroke-width="1" ${fill}/>\n`;

            case 'arc':
                const startX = entity.center.x + entity.r * Math.cos(entity.start);
                const startY = entity.center.y + entity.r * Math.sin(entity.start);
                const endX = entity.center.x + entity.r * Math.cos(entity.end);
                const endY = entity.center.y + entity.r * Math.sin(entity.end);
                const largeArc = Math.abs(entity.end - entity.start) > Math.PI ? 1 : 0;
                const sweep = entity.end > entity.start ? 1 : 0;
                return `<path d="M ${startX} ${startY} A ${entity.r} ${entity.r} 0 ${largeArc} ${sweep} ${endX} ${endY}" ${style}/>\n`;

            case 'rect':
                const rectFill = entity.hatch ? `fill="${color}" fill-opacity="0.2"` : 'fill="none"';
                return `<rect x="${Math.min(entity.p1.x, entity.p2.x)}" y="${Math.min(entity.p1.y, entity.p2.y)}" width="${Math.abs(entity.p2.x - entity.p1.x)}" height="${Math.abs(entity.p2.y - entity.p1.y)}" stroke="${color}" stroke-width="1" ${rectFill}/>\n`;

            case 'polyline':
                const points = entity.points.map(p => `${p.x},${p.y}`).join(' ');
                const polyFill = entity.hatch ? `fill="${color}" fill-opacity="0.2"` : 'fill="none"';
                return `<polyline points="${points}" stroke="${color}" stroke-width="1" ${polyFill}/>\n`;

            case 'ellipse':
                const rot = (entity.rotation || 0) * 180 / Math.PI;
                const ellipseFill = entity.hatch ? `fill="${color}" fill-opacity="0.2"` : 'fill="none"';
                return `<ellipse cx="${entity.center.x}" cy="${entity.center.y}" rx="${entity.rx}" ry="${entity.ry}" transform="rotate(${rot} ${entity.center.x} ${entity.center.y})" stroke="${color}" stroke-width="1" ${ellipseFill}/>\n`;

            case 'text':
                return `<text x="${entity.position.x}" y="${entity.position.y}" fill="${color}" font-size="${entity.height}" font-family="Arial">${entity.text}</text>\n`;

            default:
                return '';
        }
    },

    // ==========================================
    // FILE IMPORT
    // ==========================================

    importJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                CAD.fromJSON(data);
                UI.updateLayerUI();
                Renderer.draw();
                UI.log('Drawing imported from JSON.');
            } catch (err) {
                UI.log('Error importing JSON: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    },

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    downloadBlob(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    },

    openFileDialog(accept, callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.onchange = (e) => {
            if (e.target.files.length > 0) {
                callback(e.target.files[0]);
            }
        };
        input.click();
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
