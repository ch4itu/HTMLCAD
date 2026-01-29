# AutoCAD Feature Coverage

This checklist maps major AutoCAD feature areas to what is currently implemented in this repository. Items are checked when a corresponding command/UI exists in the codebase; unchecked items indicate functionality not found during the repo scan.

Legend: **[x] implemented**, **[ ] not implemented (not found in repo)**

## 2D Drafting / Drawing
- [x] Lines (LINE)
- [x] Polylines (PLINE)
- [x] Circles (CIRCLE)
- [x] Arcs (ARC)
- [x] Rectangles (RECT)
- [x] Ellipses (ELLIPSE)
- [x] Splines (SPLINE)
- [x] Rays (RAY)
- [x] Construction lines (XLINE)
- [x] Polygons (POLYGON)
- [x] Donuts (DONUT)
- [x] Hatching (HATCH)
- [x] Leaders (LEADER)
- [x] Revision clouds (REVCLOUD)
- [x] Wipeouts (WIPEOUT)
- [x] Solid fills (SOLID)
- [x] Regions & boundary creation (REGION / BOUNDARY)
- [ ] 3D primitives (BOX, SPHERE, CYLINDER, etc.)
- [ ] Surface/solid modeling tools
- [ ] Mesh modeling

## Text & Annotation
- [x] Single-line text (TEXT)
- [x] Multi-line text (MTEXT)
- [ ] Rich text formatting (full MText editor)
- [ ] Annotation scaling & annotative objects
- [ ] Tables with advanced styles/formatting

## Modify / Edit
- [x] Move, Copy, Rotate, Scale, Mirror
- [x] Offset
- [x] Trim / Extend
- [x] Fillet / Chamfer
- [x] Break
- [x] Stretch
- [x] Join / PEDIT
- [x] Explode
- [x] Array (rectangular, polar, path)
- [x] Align
- [x] Match properties
- [x] Divide / Measure
- [x] Overkill
- [x] Change properties (CHPROP)
- [x] Reverse polyline direction
- [ ] Advanced grips editing
- [ ] Parametric constraints

## Dimensions
- [x] Linear, Aligned, Angular
- [x] Radius, Diameter
- [x] Baseline / Continue
- [x] Ordinate
- [x] Quick dimension (QDIM)
- [x] Arc length dimension (DIMARC)
- [x] Dimension breaks (DIMBREAK)
- [x] Dimension spacing (DIMSPACE)
- [ ] Dimension styles manager (full DIMSTYLE editor)

## Layers & Object Organization
- [x] Layer creation and management
- [x] Layer on/off, freeze/thaw, lock/unlock
- [x] Layer isolate/unisolate
- [x] Layer delete / merge
- [x] Groups (GROUP/UNGROUP)
- [x] Blocks (BLOCK/INSERT)
- [x] Paste as block (PASTEBLOCK)
- [ ] Dynamic blocks / block attributes
- [ ] Xrefs (external references)

## View & Navigation
- [x] Zoom (All/Extents/Window/Center)
- [x] Pan
- [x] Named views
- [x] Regen
- [ ] Multiple viewports / layouts (paper space)
- [ ] ViewCube / 3D navigation

## Selection & Inquiry
- [x] Window/crossing selection
- [x] Select all
- [x] Quick select / filter
- [x] Select similar
- [x] Distance / Area / ID / List inquiry
- [ ] Lasso selection
- [ ] Advanced selection sets (named)

## Snaps & Drafting Aids
- [x] OSNAP modes (end/mid/center/int/per/tan/nea)
- [x] Grid display & grid snap
- [x] Ortho mode
- [x] Polar tracking
- [ ] Object snap tracking (advanced)
- [ ] Dynamic input (heads-up coordinate entry)

## Data / Interop / Automation
- [x] Save/open drawing (local storage)
- [x] Export DXF
- [x] Export JSON
- [x] Load AutoLISP scripts
- [ ] DWG import/export
- [ ] PDF import/export
- [ ] Plot/print
- [ ] Sheet set manager

## Miscellaneous UI/UX
- [x] Undo / Redo
- [x] Status bar toggles for grid/ortho/snap/osnap/polar
- [x] Basic properties panel / layer UI
- [ ] Tool palettes / customization
- [ ] Workspace switching
