/* ============================================
   HTMLCAD - Geometry Engine Module
   ============================================ */

const Geometry = {
    // ==========================================
    // LINE-LINE INTERSECTION
    // ==========================================

    // Line-line intersection (infinite lines)
    lineLineIntersection(p1, p2, p3, p4) {
        const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
        if (Math.abs(d) < 1e-10) return null; // Parallel or coincident

        const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;

        return {
            x: p1.x + t * (p2.x - p1.x),
            y: p1.y + t * (p2.y - p1.y)
        };
    },

    // Segment-segment intersection (bounded)
    segmentSegmentIntersection(p1, p2, p3, p4) {
        const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
        if (Math.abs(d) < 1e-10) return null;

        const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
        const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y)
            };
        }
        return null;
    },

    // ==========================================
    // LINE-CIRCLE INTERSECTION
    // ==========================================

    lineCircleIntersection(lineP1, lineP2, center, radius) {
        const d = Utils.vector(lineP1, lineP2);
        const f = Utils.vector(center, lineP1);

        const a = Utils.dot(d, d);
        const b = 2 * Utils.dot(f, d);
        const c = Utils.dot(f, f) - radius * radius;

        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return [];

        const points = [];
        discriminant = Math.sqrt(discriminant);

        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);

        if (t1 >= 0 && t1 <= 1) {
            points.push({
                x: lineP1.x + t1 * d.x,
                y: lineP1.y + t1 * d.y
            });
        }

        if (t2 >= 0 && t2 <= 1 && Math.abs(t2 - t1) > 1e-10) {
            points.push({
                x: lineP1.x + t2 * d.x,
                y: lineP1.y + t2 * d.y
            });
        }

        return points;
    },

    // ==========================================
    // CIRCLE-CIRCLE INTERSECTION
    // ==========================================

    circleCircleIntersection(c1, r1, c2, r2) {
        const d = Utils.dist(c1, c2);

        // No intersection cases
        if (d > r1 + r2) return []; // Too far apart
        if (d < Math.abs(r1 - r2)) return []; // One inside the other
        if (d === 0 && r1 === r2) return []; // Coincident

        const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
        const h = Math.sqrt(r1 * r1 - a * a);

        const px = c1.x + a * (c2.x - c1.x) / d;
        const py = c1.y + a * (c2.y - c1.y) / d;

        return [
            {
                x: px + h * (c2.y - c1.y) / d,
                y: py - h * (c2.x - c1.x) / d
            },
            {
                x: px - h * (c2.y - c1.y) / d,
                y: py + h * (c2.x - c1.x) / d
            }
        ];
    },

    // ==========================================
    // GET ENTITY SEGMENTS
    // ==========================================

    getEntitySegments(entity) {
        switch (entity.type) {
            case 'line':
                return [{ type: 'line', p1: entity.p1, p2: entity.p2 }];

            case 'polyline':
                const segments = [];
                for (let i = 0; i < entity.points.length - 1; i++) {
                    segments.push({
                        type: 'line',
                        p1: entity.points[i],
                        p2: entity.points[i + 1]
                    });
                }
                return segments;

            case 'rect':
                const p1 = entity.p1, p2 = entity.p2;
                return [
                    { type: 'line', p1: { x: p1.x, y: p1.y }, p2: { x: p2.x, y: p1.y } },
                    { type: 'line', p1: { x: p2.x, y: p1.y }, p2: { x: p2.x, y: p2.y } },
                    { type: 'line', p1: { x: p2.x, y: p2.y }, p2: { x: p1.x, y: p2.y } },
                    { type: 'line', p1: { x: p1.x, y: p2.y }, p2: { x: p1.x, y: p1.y } }
                ];

            case 'circle':
                return [{ type: 'circle', center: entity.center, r: entity.r }];

            case 'arc':
                return [{ type: 'arc', center: entity.center, r: entity.r, start: entity.start, end: entity.end }];

            case 'ellipse':
                return [{ type: 'ellipse', center: entity.center, rx: entity.rx, ry: entity.ry, rotation: entity.rotation || 0 }];

            default:
                return [];
        }
    },

    // ==========================================
    // FIND INTERSECTIONS BETWEEN TWO ENTITIES
    // ==========================================

    findIntersections(entity1, entity2) {
        const segs1 = this.getEntitySegments(entity1);
        const segs2 = this.getEntitySegments(entity2);
        const intersections = [];

        segs1.forEach(s1 => {
            segs2.forEach(s2 => {
                const pts = this.segmentIntersection(s1, s2);
                intersections.push(...pts);
            });
        });

        return Utils.uniquePoints(intersections);
    },

    segmentIntersection(s1, s2) {
        // Line-Line
        if (s1.type === 'line' && s2.type === 'line') {
            const pt = this.segmentSegmentIntersection(s1.p1, s1.p2, s2.p1, s2.p2);
            return pt ? [pt] : [];
        }

        // Line-Circle
        if (s1.type === 'line' && s2.type === 'circle') {
            return this.lineCircleIntersection(s1.p1, s1.p2, s2.center, s2.r);
        }
        if (s1.type === 'circle' && s2.type === 'line') {
            return this.lineCircleIntersection(s2.p1, s2.p2, s1.center, s1.r);
        }

        // Circle-Circle
        if (s1.type === 'circle' && s2.type === 'circle') {
            return this.circleCircleIntersection(s1.center, s1.r, s2.center, s2.r);
        }

        // Line-Arc (simplified - treat arc as circle for now)
        if (s1.type === 'line' && s2.type === 'arc') {
            const pts = this.lineCircleIntersection(s1.p1, s1.p2, s2.center, s2.r);
            return pts.filter(p => this.isPointOnArc(p, s2));
        }
        if (s1.type === 'arc' && s2.type === 'line') {
            const pts = this.lineCircleIntersection(s2.p1, s2.p2, s1.center, s1.r);
            return pts.filter(p => this.isPointOnArc(p, s1));
        }

        return [];
    },

    isPointOnArc(point, arc) {
        const angle = Math.atan2(point.y - arc.center.y, point.x - arc.center.x);
        let start = arc.start;
        let end = arc.end;

        // Normalize angles
        while (start < 0) start += Math.PI * 2;
        while (end < 0) end += Math.PI * 2;
        let a = angle;
        while (a < 0) a += Math.PI * 2;

        if (start <= end) {
            return a >= start && a <= end;
        } else {
            return a >= start || a <= end;
        }
    },

    // ==========================================
    // OFFSET OPERATIONS
    // ==========================================

    offsetLine(p1, p2, distance, side) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.hypot(dx, dy);
        if (len === 0) return null;

        const nx = -dy / len;
        const ny = dx / len;
        const d = distance * side;

        return {
            p1: { x: p1.x + nx * d, y: p1.y + ny * d },
            p2: { x: p2.x + nx * d, y: p2.y + ny * d }
        };
    },

    getOffsetSide(lineP1, lineP2, clickPoint) {
        const dx = lineP2.x - lineP1.x;
        const dy = lineP2.y - lineP1.y;
        const nx = -dy;
        const ny = dx;

        const vx = clickPoint.x - lineP1.x;
        const vy = clickPoint.y - lineP1.y;

        return (vx * nx + vy * ny) > 0 ? 1 : -1;
    },

    offsetCircle(center, radius, distance, clickPoint) {
        const currentDist = Utils.dist(center, clickPoint);
        const newRadius = currentDist > radius ? radius + distance : radius - distance;

        if (newRadius <= 0) return null;

        return {
            center: { ...center },
            r: newRadius
        };
    },

    offsetRect(p1, p2, distance, clickPoint) {
        const minX = Math.min(p1.x, p2.x);
        const maxX = Math.max(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);

        const isInside = clickPoint.x > minX && clickPoint.x < maxX &&
                         clickPoint.y > minY && clickPoint.y < maxY;
        const sign = isInside ? -1 : 1;

        const nMinX = minX - distance * sign;
        const nMaxX = maxX + distance * sign;
        const nMinY = minY - distance * sign;
        const nMaxY = maxY + distance * sign;

        if (nMaxX <= nMinX || nMaxY <= nMinY) return null;

        return {
            p1: { x: nMinX, y: nMinY },
            p2: { x: nMaxX, y: nMaxY }
        };
    },

    offsetPolyline(entity, distance, clickPoint) {
        if (entity.points.length < 2) return null;

        // Find closest segment to determine offset side
        let closestIdx = 0;
        let minDist = Infinity;

        for (let i = 0; i < entity.points.length - 1; i++) {
            const d = Utils.distToSegment(clickPoint, entity.points[i], entity.points[i + 1]);
            if (d < minDist) {
                minDist = d;
                closestIdx = i;
            }
        }

        const side = this.getOffsetSide(entity.points[closestIdx], entity.points[closestIdx + 1], clickPoint);

        // Offset all segments
        const offsetLines = [];
        for (let i = 0; i < entity.points.length - 1; i++) {
            const offset = this.offsetLine(entity.points[i], entity.points[i + 1], distance, side);
            if (offset) offsetLines.push(offset);
        }

        if (offsetLines.length === 0) return null;

        // Find intersection points between adjacent offset lines
        const newPoints = [];
        const isClosed = Utils.isPolygonClosed(entity.points);

        if (isClosed) {
            const inter = this.lineLineIntersection(
                offsetLines[offsetLines.length - 1].p1,
                offsetLines[offsetLines.length - 1].p2,
                offsetLines[0].p1,
                offsetLines[0].p2
            );
            newPoints.push(inter || offsetLines[0].p1);
        } else {
            newPoints.push(offsetLines[0].p1);
        }

        for (let i = 0; i < offsetLines.length - 1; i++) {
            const inter = this.lineLineIntersection(
                offsetLines[i].p1,
                offsetLines[i].p2,
                offsetLines[i + 1].p1,
                offsetLines[i + 1].p2
            );
            newPoints.push(inter || offsetLines[i].p2);
        }

        if (isClosed) {
            newPoints.push(newPoints[0]);
        } else {
            newPoints.push(offsetLines[offsetLines.length - 1].p2);
        }

        return { points: newPoints };
    },

    // ==========================================
    // TRIM OPERATIONS
    // ==========================================

    trimLine(entity, clickPoint, allEntities) {
        // Find all intersection points
        let cuts = [];

        allEntities.forEach(other => {
            if (other.id === entity.id) return;
            const pts = this.findIntersections(entity, other);
            cuts.push(...pts);
        });

        if (cuts.length === 0) return null;

        // Add line endpoints
        cuts.push(entity.p1, entity.p2);

        // Sort by distance from p1
        cuts.sort((a, b) => Utils.dist(entity.p1, a) - Utils.dist(entity.p1, b));

        // Remove duplicates
        cuts = Utils.uniquePoints(cuts);

        // Find which segment was clicked
        let clickedIdx = -1;
        let minDist = Infinity;

        for (let i = 0; i < cuts.length - 1; i++) {
            const mid = Utils.midpoint(cuts[i], cuts[i + 1]);
            const d = Utils.dist(clickPoint, mid);
            if (d < minDist) {
                minDist = d;
                clickedIdx = i;
            }
        }

        // Build new segments (excluding clicked one)
        const newEntities = [];
        for (let i = 0; i < cuts.length - 1; i++) {
            if (i === clickedIdx) continue;
            if (Utils.dist(cuts[i], cuts[i + 1]) < 0.001) continue;

            newEntities.push({
                type: 'line',
                p1: { ...cuts[i] },
                p2: { ...cuts[i + 1] }
            });
        }

        return newEntities;
    },

    trimCircle(entity, clickPoint, allEntities) {
        // Find all intersection points
        let cuts = [];

        allEntities.forEach(other => {
            if (other.id === entity.id) return;
            const pts = this.findIntersections(entity, other);
            cuts.push(...pts);
        });

        if (cuts.length < 2) return null;

        // Convert to angles
        const angles = cuts.map(p => ({
            point: p,
            angle: Math.atan2(p.y - entity.center.y, p.x - entity.center.x)
        }));

        // Sort by angle
        angles.sort((a, b) => a.angle - b.angle);

        // Find clicked angle
        const clickAngle = Math.atan2(clickPoint.y - entity.center.y, clickPoint.x - entity.center.x);

        // Find which arc segment was clicked
        let clickedIdx = -1;
        for (let i = 0; i < angles.length; i++) {
            const start = angles[i].angle;
            const end = angles[(i + 1) % angles.length].angle;

            let inArc = false;
            if (start <= end) {
                inArc = clickAngle >= start && clickAngle <= end;
            } else {
                inArc = clickAngle >= start || clickAngle <= end;
            }

            if (inArc) {
                clickedIdx = i;
                break;
            }
        }

        if (clickedIdx === -1) return null;

        // Create arcs for remaining segments
        const newEntities = [];
        for (let i = 0; i < angles.length; i++) {
            if (i === clickedIdx) continue;

            newEntities.push({
                type: 'arc',
                center: { ...entity.center },
                r: entity.r,
                start: angles[i].angle,
                end: angles[(i + 1) % angles.length].angle
            });
        }

        return newEntities;
    },

    // ==========================================
    // HIT TESTING
    // ==========================================

    hitTest(point, entity, tolerance) {
        switch (entity.type) {
            case 'line':
                return Utils.distToSegment(point, entity.p1, entity.p2) < tolerance;

            case 'circle':
                return Math.abs(Utils.dist(point, entity.center) - entity.r) < tolerance;

            case 'arc':
                const dist = Math.abs(Utils.dist(point, entity.center) - entity.r);
                if (dist >= tolerance) return false;
                return this.isPointOnArc(point, entity);

            case 'rect':
                return Utils.distToRect(point, entity.p1, entity.p2) < tolerance;

            case 'polyline':
                for (let i = 0; i < entity.points.length - 1; i++) {
                    if (Utils.distToSegment(point, entity.points[i], entity.points[i + 1]) < tolerance) {
                        return true;
                    }
                }
                return false;

            case 'ellipse':
                // Simplified ellipse hit test
                const dx = (point.x - entity.center.x) / entity.rx;
                const dy = (point.y - entity.center.y) / entity.ry;
                const ellipseDist = Math.sqrt(dx * dx + dy * dy);
                return Math.abs(ellipseDist - 1) < tolerance / Math.min(entity.rx, entity.ry);

            case 'text':
                // Simple bounding box test for text
                const textWidth = entity.text.length * entity.height * 0.6;
                return point.x >= entity.position.x &&
                       point.x <= entity.position.x + textWidth &&
                       point.y >= entity.position.y - entity.height &&
                       point.y <= entity.position.y;

            case 'donut':
                // Hit test for donut - check if point is between inner and outer radius
                const donutDist = Utils.dist(point, entity.center);
                return donutDist >= entity.innerRadius - tolerance &&
                       donutDist <= entity.outerRadius + tolerance;

            case 'dimension':
                // Hit test for dimension - check dimension line
                if (entity.dimType === 'linear' || entity.dimType === 'aligned') {
                    return Utils.distToSegment(point, entity.p1, entity.p2) < tolerance * 2;
                } else if (entity.dimType === 'radius' || entity.dimType === 'diameter') {
                    return Utils.dist(point, entity.center) < entity.radius + tolerance;
                }
                return false;

            case 'point':
                return Utils.dist(point, entity.position) < tolerance;

            default:
                return false;
        }
    },

    // ==========================================
    // SNAP POINT DETECTION
    // ==========================================

    findSnapPoints(point, entities, snapModes, tolerance, gridSize) {
        const snaps = [];

        // Grid snap
        if (snapModes.grid) {
            const gridPoint = Utils.snapPointToGrid(point, gridSize);
            snaps.push({
                point: gridPoint,
                type: 'grid',
                distance: Utils.dist(point, gridPoint)
            });
        }

        entities.forEach(entity => {
            // Endpoint snap
            if (snapModes.endpoint) {
                const endpoints = this.getEndpoints(entity);
                endpoints.forEach(ep => {
                    const d = Utils.dist(point, ep);
                    if (d < tolerance) {
                        snaps.push({ point: ep, type: 'endpoint', distance: d });
                    }
                });
            }

            // Midpoint snap
            if (snapModes.midpoint) {
                const midpoints = this.getMidpoints(entity);
                midpoints.forEach(mp => {
                    const d = Utils.dist(point, mp);
                    if (d < tolerance) {
                        snaps.push({ point: mp, type: 'midpoint', distance: d });
                    }
                });
            }

            // Center snap
            if (snapModes.center) {
                const centers = this.getCenters(entity);
                centers.forEach(cp => {
                    const d = Utils.dist(point, cp);
                    if (d < tolerance) {
                        snaps.push({ point: cp, type: 'center', distance: d });
                    }
                });
            }

            // Nearest snap
            if (snapModes.nearest) {
                const nearest = this.getNearestPoint(point, entity);
                if (nearest) {
                    const d = Utils.dist(point, nearest);
                    if (d < tolerance) {
                        snaps.push({ point: nearest, type: 'nearest', distance: d });
                    }
                }
            }
        });

        // Intersection snap
        if (snapModes.intersection) {
            for (let i = 0; i < entities.length; i++) {
                for (let j = i + 1; j < entities.length; j++) {
                    const intersections = this.findIntersections(entities[i], entities[j]);
                    intersections.forEach(ip => {
                        const d = Utils.dist(point, ip);
                        if (d < tolerance) {
                            snaps.push({ point: ip, type: 'intersection', distance: d });
                        }
                    });
                }
            }
        }

        // Sort by distance and return closest
        snaps.sort((a, b) => a.distance - b.distance);
        return snaps.length > 0 ? snaps[0] : null;
    },

    getEndpoints(entity) {
        switch (entity.type) {
            case 'line':
                return [entity.p1, entity.p2];
            case 'polyline':
                return [...entity.points];
            case 'rect':
                return [
                    entity.p1,
                    { x: entity.p2.x, y: entity.p1.y },
                    entity.p2,
                    { x: entity.p1.x, y: entity.p2.y }
                ];
            case 'arc':
                return [
                    Utils.polarPoint(entity.center, entity.start, entity.r),
                    Utils.polarPoint(entity.center, entity.end, entity.r)
                ];
            default:
                return [];
        }
    },

    getMidpoints(entity) {
        switch (entity.type) {
            case 'line':
                return [Utils.midpoint(entity.p1, entity.p2)];
            case 'polyline':
                const mids = [];
                for (let i = 0; i < entity.points.length - 1; i++) {
                    mids.push(Utils.midpoint(entity.points[i], entity.points[i + 1]));
                }
                return mids;
            case 'rect':
                return [
                    Utils.midpoint(entity.p1, { x: entity.p2.x, y: entity.p1.y }),
                    Utils.midpoint({ x: entity.p2.x, y: entity.p1.y }, entity.p2),
                    Utils.midpoint(entity.p2, { x: entity.p1.x, y: entity.p2.y }),
                    Utils.midpoint({ x: entity.p1.x, y: entity.p2.y }, entity.p1)
                ];
            default:
                return [];
        }
    },

    getCenters(entity) {
        switch (entity.type) {
            case 'circle':
            case 'arc':
            case 'ellipse':
                return [entity.center];
            case 'rect':
                return [Utils.midpoint(entity.p1, entity.p2)];
            default:
                return [];
        }
    },

    getNearestPoint(point, entity) {
        switch (entity.type) {
            case 'line':
                return Utils.closestPointOnSegment(point, entity.p1, entity.p2);
            case 'circle':
                const angle = Math.atan2(point.y - entity.center.y, point.x - entity.center.x);
                return Utils.polarPoint(entity.center, angle, entity.r);
            case 'polyline':
                let minDist = Infinity;
                let nearest = null;
                for (let i = 0; i < entity.points.length - 1; i++) {
                    const p = Utils.closestPointOnSegment(point, entity.points[i], entity.points[i + 1]);
                    const d = Utils.dist(point, p);
                    if (d < minDist) {
                        minDist = d;
                        nearest = p;
                    }
                }
                return nearest;
            default:
                return null;
        }
    },

    // ==========================================
    // ENTITY TRANSFORMATIONS
    // ==========================================

    moveEntity(entity, delta) {
        const moved = JSON.parse(JSON.stringify(entity));

        switch (moved.type) {
            case 'line':
                moved.p1.x += delta.x;
                moved.p1.y += delta.y;
                moved.p2.x += delta.x;
                moved.p2.y += delta.y;
                break;
            case 'circle':
            case 'arc':
            case 'ellipse':
                moved.center.x += delta.x;
                moved.center.y += delta.y;
                break;
            case 'rect':
                moved.p1.x += delta.x;
                moved.p1.y += delta.y;
                moved.p2.x += delta.x;
                moved.p2.y += delta.y;
                break;
            case 'polyline':
                moved.points.forEach(p => {
                    p.x += delta.x;
                    p.y += delta.y;
                });
                break;
            case 'text':
                moved.position.x += delta.x;
                moved.position.y += delta.y;
                break;
        }

        return moved;
    },

    rotateEntity(entity, center, angle) {
        const rotated = JSON.parse(JSON.stringify(entity));

        switch (rotated.type) {
            case 'line':
                rotated.p1 = Utils.rotatePoint(rotated.p1, center, angle);
                rotated.p2 = Utils.rotatePoint(rotated.p2, center, angle);
                break;
            case 'circle':
                rotated.center = Utils.rotatePoint(rotated.center, center, angle);
                break;
            case 'arc':
                rotated.center = Utils.rotatePoint(rotated.center, center, angle);
                rotated.start += angle;
                rotated.end += angle;
                break;
            case 'ellipse':
                rotated.center = Utils.rotatePoint(rotated.center, center, angle);
                rotated.rotation = (rotated.rotation || 0) + angle;
                break;
            case 'rect':
                // Convert to polyline for rotation
                const corners = [
                    rotated.p1,
                    { x: rotated.p2.x, y: rotated.p1.y },
                    rotated.p2,
                    { x: rotated.p1.x, y: rotated.p2.y },
                    rotated.p1
                ];
                return {
                    ...rotated,
                    type: 'polyline',
                    points: corners.map(p => Utils.rotatePoint(p, center, angle))
                };
            case 'polyline':
                rotated.points = rotated.points.map(p => Utils.rotatePoint(p, center, angle));
                break;
            case 'text':
                rotated.position = Utils.rotatePoint(rotated.position, center, angle);
                rotated.rotation = (rotated.rotation || 0) + Utils.radToDeg(angle);
                break;
        }

        return rotated;
    },

    scaleEntity(entity, center, scale) {
        const scaled = JSON.parse(JSON.stringify(entity));

        switch (scaled.type) {
            case 'line':
                scaled.p1 = Utils.scalePoint(scaled.p1, center, scale);
                scaled.p2 = Utils.scalePoint(scaled.p2, center, scale);
                break;
            case 'circle':
                scaled.center = Utils.scalePoint(scaled.center, center, scale);
                scaled.r *= scale;
                break;
            case 'arc':
                scaled.center = Utils.scalePoint(scaled.center, center, scale);
                scaled.r *= scale;
                break;
            case 'ellipse':
                scaled.center = Utils.scalePoint(scaled.center, center, scale);
                scaled.rx *= scale;
                scaled.ry *= scale;
                break;
            case 'rect':
                scaled.p1 = Utils.scalePoint(scaled.p1, center, scale);
                scaled.p2 = Utils.scalePoint(scaled.p2, center, scale);
                break;
            case 'polyline':
                scaled.points = scaled.points.map(p => Utils.scalePoint(p, center, scale));
                break;
            case 'text':
                scaled.position = Utils.scalePoint(scaled.position, center, scale);
                scaled.height *= scale;
                break;
        }

        return scaled;
    },

    mirrorEntity(entity, lineP1, lineP2) {
        const mirrored = JSON.parse(JSON.stringify(entity));

        switch (mirrored.type) {
            case 'line':
                mirrored.p1 = Utils.mirrorPoint(mirrored.p1, lineP1, lineP2);
                mirrored.p2 = Utils.mirrorPoint(mirrored.p2, lineP1, lineP2);
                break;
            case 'circle':
                mirrored.center = Utils.mirrorPoint(mirrored.center, lineP1, lineP2);
                break;
            case 'arc':
                mirrored.center = Utils.mirrorPoint(mirrored.center, lineP1, lineP2);
                // Swap and negate angles for mirror
                const tempStart = mirrored.start;
                mirrored.start = -mirrored.end;
                mirrored.end = -tempStart;
                break;
            case 'ellipse':
                mirrored.center = Utils.mirrorPoint(mirrored.center, lineP1, lineP2);
                mirrored.rotation = -(mirrored.rotation || 0);
                break;
            case 'rect':
                mirrored.p1 = Utils.mirrorPoint(mirrored.p1, lineP1, lineP2);
                mirrored.p2 = Utils.mirrorPoint(mirrored.p2, lineP1, lineP2);
                break;
            case 'polyline':
                mirrored.points = mirrored.points.map(p => Utils.mirrorPoint(p, lineP1, lineP2));
                break;
            case 'text':
                mirrored.position = Utils.mirrorPoint(mirrored.position, lineP1, lineP2);
                break;
        }

        return mirrored;
    },

    // ==========================================
    // FILLET AND CHAMFER
    // ==========================================

    filletLines(line1, line2, radius) {
        // Find intersection point of the two lines
        const intersection = this.lineLineIntersection(
            line1.p1, line1.p2, line2.p1, line2.p2, false
        );

        if (!intersection) return null;

        // If radius is 0, just trim to intersection
        if (radius === 0) {
            // Determine which endpoints to keep
            const d1p1 = Utils.dist(line1.p1, intersection);
            const d1p2 = Utils.dist(line1.p2, intersection);
            const d2p1 = Utils.dist(line2.p1, intersection);
            const d2p2 = Utils.dist(line2.p2, intersection);

            return {
                line1: {
                    p1: d1p1 > d1p2 ? line1.p1 : intersection,
                    p2: d1p1 > d1p2 ? intersection : line1.p2
                },
                line2: {
                    p1: d2p1 > d2p2 ? line2.p1 : intersection,
                    p2: d2p1 > d2p2 ? intersection : line2.p2
                },
                arc: null
            };
        }

        // Calculate the angle between the lines
        const angle1 = Utils.angle(intersection, line1.p1);
        const angle2 = Utils.angle(intersection, line2.p1);

        // Find the bisector angle
        let bisector = (angle1 + angle2) / 2;
        if (Math.abs(angle1 - angle2) > Math.PI) {
            bisector += Math.PI;
        }

        // Calculate fillet arc center
        const sinHalfAngle = Math.sin(Math.abs(angle2 - angle1) / 2);
        if (sinHalfAngle === 0) return null;

        const centerDist = radius / sinHalfAngle;
        const arcCenter = {
            x: intersection.x + centerDist * Math.cos(bisector),
            y: intersection.y + centerDist * Math.sin(bisector)
        };

        // Find tangent points on each line
        const tangent1 = this.closestPointOnLine(arcCenter, line1.p1, line1.p2);
        const tangent2 = this.closestPointOnLine(arcCenter, line2.p1, line2.p2);

        // Create the fillet arc
        const startAngle = Utils.angle(arcCenter, tangent1);
        const endAngle = Utils.angle(arcCenter, tangent2);

        // Trim the lines to the tangent points
        const d1p1 = Utils.dist(line1.p1, tangent1);
        const d1p2 = Utils.dist(line1.p2, tangent1);
        const d2p1 = Utils.dist(line2.p1, tangent2);
        const d2p2 = Utils.dist(line2.p2, tangent2);

        return {
            line1: {
                type: 'line',
                p1: d1p1 > d1p2 ? line1.p1 : tangent1,
                p2: d1p1 > d1p2 ? tangent1 : line1.p2
            },
            line2: {
                type: 'line',
                p1: d2p1 > d2p2 ? line2.p1 : tangent2,
                p2: d2p1 > d2p2 ? tangent2 : line2.p2
            },
            arc: {
                type: 'arc',
                center: arcCenter,
                r: radius,
                start: startAngle,
                end: endAngle
            }
        };
    },

    closestPointOnLine(point, lineP1, lineP2) {
        const dx = lineP2.x - lineP1.x;
        const dy = lineP2.y - lineP1.y;
        const lengthSq = dx * dx + dy * dy;

        if (lengthSq === 0) return { ...lineP1 };

        const t = Math.max(0, Math.min(1,
            ((point.x - lineP1.x) * dx + (point.y - lineP1.y) * dy) / lengthSq
        ));

        return {
            x: lineP1.x + t * dx,
            y: lineP1.y + t * dy
        };
    },

    chamferLines(line1, line2, dist1, dist2) {
        // Find intersection point
        const intersection = this.lineLineIntersection(
            line1.p1, line1.p2, line2.p1, line2.p2, false
        );

        if (!intersection) return null;

        // If distances are 0, just trim to intersection
        if (dist1 === 0 && dist2 === 0) {
            return this.filletLines(line1, line2, 0);
        }

        // Calculate chamfer points on each line
        const d1p1 = Utils.dist(line1.p1, intersection);
        const d1p2 = Utils.dist(line1.p2, intersection);
        const d2p1 = Utils.dist(line2.p1, intersection);
        const d2p2 = Utils.dist(line2.p2, intersection);

        // Determine direction from intersection
        const dir1 = d1p1 > d1p2 ?
            { x: line1.p1.x - intersection.x, y: line1.p1.y - intersection.y } :
            { x: line1.p2.x - intersection.x, y: line1.p2.y - intersection.y };
        const dir2 = d2p1 > d2p2 ?
            { x: line2.p1.x - intersection.x, y: line2.p1.y - intersection.y } :
            { x: line2.p2.x - intersection.x, y: line2.p2.y - intersection.y };

        // Normalize directions
        const len1 = Math.sqrt(dir1.x * dir1.x + dir1.y * dir1.y);
        const len2 = Math.sqrt(dir2.x * dir2.x + dir2.y * dir2.y);

        const chamferP1 = {
            x: intersection.x + (dir1.x / len1) * dist1,
            y: intersection.y + (dir1.y / len1) * dist1
        };
        const chamferP2 = {
            x: intersection.x + (dir2.x / len2) * dist2,
            y: intersection.y + (dir2.y / len2) * dist2
        };

        return {
            line1: {
                type: 'line',
                p1: d1p1 > d1p2 ? line1.p1 : chamferP1,
                p2: d1p1 > d1p2 ? chamferP1 : line1.p2
            },
            line2: {
                type: 'line',
                p1: d2p1 > d2p2 ? line2.p1 : chamferP2,
                p2: d2p1 > d2p2 ? chamferP2 : line2.p2
            },
            chamferLine: {
                type: 'line',
                p1: chamferP1,
                p2: chamferP2
            }
        };
    },

    breakLine(entity, breakPoint1, breakPoint2) {
        if (entity.type !== 'line') return null;

        // Project break points onto line
        const proj1 = this.closestPointOnLine(breakPoint1, entity.p1, entity.p2);
        const proj2 = this.closestPointOnLine(breakPoint2, entity.p1, entity.p2);

        // Calculate distances along line
        const lineLen = Utils.dist(entity.p1, entity.p2);
        const t1 = Utils.dist(entity.p1, proj1) / lineLen;
        const t2 = Utils.dist(entity.p1, proj2) / lineLen;

        const tMin = Math.min(t1, t2);
        const tMax = Math.max(t1, t2);

        const result = [];

        // First segment (if not at start)
        if (tMin > 0.001) {
            result.push({
                type: 'line',
                p1: { ...entity.p1 },
                p2: {
                    x: entity.p1.x + tMin * (entity.p2.x - entity.p1.x),
                    y: entity.p1.y + tMin * (entity.p2.y - entity.p1.y)
                }
            });
        }

        // Second segment (if not at end)
        if (tMax < 0.999) {
            result.push({
                type: 'line',
                p1: {
                    x: entity.p1.x + tMax * (entity.p2.x - entity.p1.x),
                    y: entity.p1.y + tMax * (entity.p2.y - entity.p1.y)
                },
                p2: { ...entity.p2 }
            });
        }

        return result;
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Geometry;
}
