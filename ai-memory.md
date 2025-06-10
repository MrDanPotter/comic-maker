# Comic Maker Project Memory

## Project Structure
- The project is a visual comic book editor laid out in three columns:
  1. Left: TemplateSelector - Contains page templates that can be added to the main work area
  2. Center: ComicAssembly - Main work area where comic pages are created and edited
  3. Right: ImageLibrary - Allows users to upload and manage images

## Panel System
- Comic pages use SVG for panel rendering
- Each panel has both an SVG component and an HTML overlay for drag-and-drop functionality
- Panels support:
  - Image drag and drop
  - Image repositioning within panels
  - Panel rotation
  - Panel mirroring
  - Non-rectangular shapes

## Layout System
- Templates are defined in `src/utils/layouts.ts`
- Each layout is a function that returns an array of Panel objects
- Standard layouts include:
  - fullPage
  - widePage (5:4 aspect ratio)
  - sixPanels (2x3 grid)
  - fourPanels (2x2 grid)
  - oneBigTwoSmall
  - threePanels
  - twoPanels
  - threePanelAction (dynamic tapered panels)

## Recent Implementations
1. Panel Animation System:
   - Added transition animations for panel rotation and mirroring
   - Used styled-components with transition properties
   - Special handling to disable animations during manual image dragging

2. Layout System Simplification:
   - Removed redundant layouts that could be achieved through rotation/mirroring
   - Renamed layouts for clarity
   - Added user-friendly display names

3. Panel Resize System:
   - Added ResizeIndicator component with hover effects
   - Implemented cursor changes for resize directions
   - Added gap detection between panels
   - Enhanced to handle complex multi-panel borders
   - Added rectangular panel detection to only allow resizing of rectangular panels

4. Dynamic Panel Shapes:
   - Implemented threePanelAction layout with tapered edges
   - Used vertical tapering (7% of available width) for dynamic flow
   - Panel tapering pattern:
     * Top panel: Bottom edge tapers out
     * Middle panel: Both edges taper (pinched look)
     * Bottom panel: Top edge tapers out
   - Maintained straight vertical edges for clean layout
