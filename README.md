# BrowserCAD

BrowserCAD is a browser-based CAD experience inspired by AutoCAD workflows. It supports classic command-line entry, a ribbon interface, and a growing set of drawing, modify, and utility commands.

## Quick Start

1. Open `index.html` in a browser (or serve with a local HTTP server).
2. Click in the command line and type commands like `LINE`, `OFFSET`, or `IMAGEATTACH`.
3. Use **Space** or **Enter** to accept default values (just like AutoCAD).

## Command Line Basics

- **Enter/Space**: confirm default values or finish steps.
- **Esc**: cancel the active command.
- **Arrow Up/Down**: command history.
- **Tab**: autocomplete commands.

## Drawing Commands

| Command | Alias | Description |
| --- | --- | --- |
| LINE | `L` | Draw lines. |
| PLINE | `PL` | Draw polylines. |
| CIRCLE | `C` | Draw circles. |
| ARC | `A` | Draw arcs. |
| RECT | `REC` | Draw rectangles. |
| ELLIPSE | `EL` | Draw ellipses. |
| TEXT | `T` | Add single-line text. |
| MTEXT | `MT` | Add multi-line text. |
| POLYGON | `POL` | Draw a regular polygon. |
| DONUT | `DO` | Draw donuts. |
| RAY | `RAY` | Draw rays. |
| XLINE | `XL` | Draw construction lines. |
| SPLINE | `SPL` | Draw splines. |
| HATCH | `H` | Hatch closed areas. |
| IMAGEATTACH | `IMAGE`, `ATTACH` | Attach an image for tracing. |

### IMAGEATTACH workflow

1. Run `IMAGEATTACH`.
2. Choose an image file.
3. Specify insertion point.
4. Specify scale factor (or click a corner).
5. Specify rotation angle.

Defaults for scale/rotation are reused when you press **Enter** or **Space**.

## Modify Commands

| Command | Alias | Description |
| --- | --- | --- |
| MOVE | `M` | Move objects. |
| COPY | `CO` | Copy objects. |
| ROTATE | `RO` | Rotate objects. |
| SCALE | `SC` | Scale objects (supports Copy/Reference). |
| MIRROR | `MI` | Mirror objects. |
| OFFSET | `O` | Offset entities (uses `OFFSETGAPTYPE` for polylines/rects). |
| TRIM | `TR` | Trim objects. |
| EXTEND | `EX` | Extend objects. |
| FILLET | `F` | Fillet between two lines. |
| CHAMFER | `CHA` | Chamfer between two lines. |
| BREAK | `BR` | Break an object. |
| STRETCH | `S` | Stretch objects via window selection. |
| JOIN | `J` | Join line/polyline segments. |
| PEDIT | `PE` | Edit polylines. |
| ERASE | `E` | Erase objects. |
| EXPLODE | `X` | Explode objects. |
| ARRAY | `AR` | Rectangular array. |
| ARRAYPOLAR | `ARPO` | Polar array. |

## Dimension Commands

| Command | Alias | Description |
| --- | --- | --- |
| DIMLINEAR | `DIM` | Linear dimension. |
| DIMALIGNED | `DAL` | Aligned dimension. |
| DIMANGULAR | `DAN` | Angular dimension. |
| DIMRADIUS | `DRA` | Radius dimension. |
| DIMDIAMETER | `DDI` | Diameter dimension. |

## Inquiry Commands

| Command | Alias | Description |
| --- | --- | --- |
| DISTANCE | `DI` | Measure distance. |
| AREA | `AA` | Measure area. |
| ID | `ID` | Read a coordinate. |
| LIST | `LI` | List selected entity properties. |

## View & Utility Commands

| Command | Alias | Description |
| --- | --- | --- |
| ZOOM | `Z` | Zoom (All/Extents/Window/Center). |
| PAN | `P` | Pan view. |
| REGEN | `RE` | Regenerate display. |
| SELECTALL | `ALL` | Select all entities. |
| UNDO | `U` | Undo last action. |
| REDO | `Y` | Redo last action. |
| APPLOAD | `LOAD` | Load AutoLISP scripts from file. |

## Settings Commands

| Command | Description |
| --- | --- |
| GRID | Toggle grid. |
| SNAP | Toggle snap. |
| ORTHO | Toggle ortho mode. |
| OSNAP | Toggle object snap. |
| OFFSETGAPTYPE | Set gap type (0=Extend, 1=Fillet, 2=Chamfer). |
| PDMODE | Set point display mode. |
| PDSIZE | Set point display size. |
| TEXTSIZE | Set text height. |
| DIMTXT | Set dimension text height. |
| DIMASZ | Set dimension arrow size. |
| DIMSCALE | Set overall dimension scale. |

## File Commands

| Command | Alias | Description |
| --- | --- | --- |
| NEW | `NEW` | Start a new drawing. |
| SAVE | `SAVE` | Save to local storage. |
| OPEN | `OPEN` | Load from local storage. |
| EXPORT | `DXFOUT` | Export to DXF. |

## AutoLISP Guide

BrowserCAD includes a lightweight AutoLISP interpreter for scripting and automation. Enter expressions in the command line using parentheses:

```
(+ 1 2 3)
(setq x 10)
(command "circle" '(0 0) 50)
```

### Loading LISP scripts

Use `APPLOAD` (or `LOAD`) to upload a `.lsp` file from your machine. The script is loaded into the session and can define new functions/commands.

### Common AutoLISP helpers

- `(command "line" '(0 0) '(100 0))` - run a built-in command with arguments.
- `(getpoint "Pick a point:")` - prompt for a point.
- `(getstring "Name:")` - prompt for text input.
- `(getreal "Enter a value:")` - prompt for a real number.
- `(getint "Enter an integer:")` - prompt for an integer.
- `(entsel "Select object:")` - select a single entity.
- `(ssget)` - select multiple entities.
- `(entget (car (entsel)))` - get entity data from a selection.

### Tips

- Use **Space** or **Enter** to submit LISP expressions.
- Use `(help)` inside AutoLISP for available functions.

---

Try it live: https://ch4itu.github.io/BrowserCAD/
