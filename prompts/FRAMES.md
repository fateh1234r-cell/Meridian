# Hero frame sequences: 24 frames per site

Each hero plays its 24 frames like footage. Scrolling moves forward and back through them, and the
site crossfades between neighbouring frames so the motion looks continuous (the same technique as the
reference reels).

## How to get frames that match each other (this matters most)
Image generators redraw the whole scene each time. If every frame is generated from scratch, the
building, the room or the glass piece will look different in every shot and the film will flicker.
To avoid that:

1. **Use an image editor that edits your previous image.**
   - **Best:** Gemini (Nano Banana image editing) or Google Whisk with the previous frame in the
     "Scene" slot.
   - **Process:** upload the last good frame and ask for only the next change.
2. **Construction: generate the finished building first** (frame 20, the "master"). Then work
   backwards from it (19, 18 … 1), each time removing a little. Undoing a finished building keeps the
   architecture identical in every frame.
3. **Start every edit with the lock line:**
   > Keep the exact same camera position, lens, framing, horizon, lighting direction, surroundings and
   > image size. Only change the following:
4. **Settings:** 16:9, the largest size available. No text, logos, watermarks or people's faces
   (small distant workers and gloved hands are fine).
5. **Reject drifting frames.** If a frame's camera drifts, regenerate it. A slight drift is fine,
   because the crossfade hides it.

## Where to put them
- **Folders:** save the frames into `meridian-group-demo/raw/frames/build/`, `.../interiors/` and
  `.../glass/`, named `01.png` … `24.png` in story order.
- **Hand-off:** tell Claude when they're in. Claude converts them to optimised WebP, makes phone
  versions, and they replace the current heroes automatically, with no code changes.
- **Counts:** fewer or more than 24 frames is fine (16–40). Claude adjusts the count.

---

## 1 · Meridian Build: "from the ground up" (the construction reel)
**Camera (every frame):** *Photoreal architectural photograph. Fixed low-aerial three-quarter view
from across a wide road, about 12 m high. A corner plot in Mumbai's Bandra Kurla Complex with
neighbouring towers and trees at the frame edges. Warm golden-hour sun from the left, 35mm lens,
cinematic, ultra-detailed.*

**The building (keep identical):** a 6-storey premium corporate headquarters. It has a blue-green
glass curtain wall, slim bronze vertical fins, a cantilevered top floor with a warm-lit soffit, a
double-height glass lobby at the corner, a landscaped plaza with palms and a long reflecting pool.

**Make frame 20 first** (the master), then edit backwards.

| # | Stage | Change from the master (frame 20) |
|---|---|---|
| 01 | Line-out | An empty levelled plot of dusty earth. Bright white survey line-out markings show the building's footprint and column grid. Wooden pegs, string lines, two small surveyors with a total station. No building, no cranes. |
| 02 | Excavation | Two yellow excavators dig the foundation pit along the white lines, with a dump truck and piles of earth. |
| 03 | Piling | The pit is dug. A piling rig, a grid of pile caps and rebar cages, one tower crane being erected. |
| 04 | Foundation | The concrete raft foundation is poured and smooth. Column starter bars stick up. Two tower cranes are up. |
| 05 | Ground floor | Ground-floor concrete columns with timber formwork for the first slab. Small workers in orange hi-vis. |
| 06 | Level 1 | The first slab is finished and level-1 columns are rising. Scaffolding on one side. |
| 07 | Level 2 | A 2-storey bare concrete-and-steel frame. Cranes lifting beams. |
| 08 | Level 3 | A 3-storey frame. |
| 09 | Level 4 | A 4-storey frame. |
| 10 | Level 5 | A 5-storey frame. Cranes at full height. |
| 11 | Topped out | The full 6-storey frame with the cantilevered top floor's steel and the roof slab done. Scaffolding wraps two faces. |
| 12 | Glass L0 | Blue-green glass curtain wall installed on the ground floor only. The rest is bare frame. |
| 13 | Glass L1–2 | Glass up to level 2. |
| 14 | Glass L3–4 | Glass up to level 4. |
| 15 | Glass L5 | Glass up to level 5. Scaffolding partly removed. |
| 16 | Clad | The whole glass skin is complete. One crane is being dismantled; the other is gone. |
| 17 | Fins | The bronze fins and the top-floor soffit are finished. All scaffolding and cranes are gone. The site is still dusty. |
| 18 | Landscaping | Paving laid, trees being planted, the reflecting pool empty. |
| 19 | Plaza | The plaza is finished, the pool is filled, a few warm lights are coming on inside. |
| **20** | **MASTER: delivered** | **The finished headquarters at golden hour: glowing glass, warm interior lights, the reflecting pool mirroring the building, a pristine plaza. Make this first.** |
| 21 | Blue hour | Same, at blue hour: the sky deep blue, every floor lit warm, uplights on the palms. |
| 22 | Approach | The camera has moved closer and lower, toward the corner lobby (allowed: a gentle forward move). |
| 23 | At the doors | Eye-level in front of the tall glass lobby doors, the warm double-height lobby visible inside. |
| 24 | Inside | Inside the double-height lobby: book-matched marble walls, a polished stone floor, large ring chandeliers, a reception desk in walnut and brass, warm light. |

---

## 2 · Meridian Interiors: "zoom in, turn around, zoom out" (the villa + 3D-scroll interior reels)
**Style (every frame):** *Photoreal luxury interior and architectural photography, moody warm
lighting with wall-washers and hidden cove light, rich dark walnut, warm travertine, cream bouclé,
brushed brass, oxblood accents, large sea-view windows, golden hour turning to dusk, 24mm lens,
ultra-detailed, editorial.*

**The home (keep identical):** a modern sea-facing luxury villa on the Alibaug coast near Mumbai.
White and travertine boxes with walnut louvres, an infinity pool, palms, and a tall brass pivot front
door.

- **Frames 01–05 (zoom in):** edit from frame 01.
- **Frames 06–19 (turn around):** each is a new view of the same house. Put frame 07 in Whisk's
  "Style" and "Scene" slots so the materials stay consistent.
- **Frames 20–24 (zoom out):** edit from frame 01, reversed.

| # | Move | Prompt |
|---|---|---|
| 01 | Aerial | High aerial view of the whole villa on the coast at golden hour: pool, palms, sea and a jetty. |
| 02 | Descend | Same villa, camera lower and closer, the villa filling half the frame. |
| 03 | Arrival | Eye level on the drive, facing the entrance facade: travertine wall, walnut louvres, the tall brass pivot door closed. |
| 04 | Door | Close to the brass pivot door, which is just opening; warm light spills out. |
| 05 | Threshold | The door is fully open. Looking through it into a glowing double-height foyer. |
| 06 | Foyer | Inside the foyer looking straight ahead into the double-height living room with sea-view glass beyond. |
| 07 | Living (key) | Wide view of the living room: a walnut feature wall, travertine floor, low cream bouclé sofa, travertine coffee table, oxblood velvet armchair, sculptural brass floor lamp, sea through floor-to-ceiling glass. **Use as the style reference for 08–19.** |
| 08 | Turn 30° | Camera turned 30° right: the living room flows into the dining area, with a marble table and a sculptural alabaster pendant. |
| 09 | Turn 60° | The dining area and an open kitchen beyond. |
| 10 | Turn 90° | The kitchen: fluted walnut cabinetry, a long book-matched marble island, brass taps, pendant lights. |
| 11 | Turn 120° | A floating walnut staircase with a glass balustrade beside a gallery wall of large art. |
| 12 | Turn 150° | A gallery corridor: three framed artworks lit by spotlights on a dark wall, polished floor. |
| 13 | Turn 180° | Looking back toward the entrance from inside, the brass door and foyer glowing. |
| 14 | Turn 210° | A lounge corner with a fluted stone fireplace and an oxblood armchair. |
| 15 | Turn 240° | A dark walnut bar with a backlit onyx wall and wine display. |
| 16 | Turn 270° | An open doorway into the master bedroom, with warm light inside. |
| 17 | Turn 300° | Master bedroom: a low walnut bed, linen layers, a backlit headboard wall, sheer curtains, the sea. |
| 18 | Turn 330° | An en-suite marble bathroom glimpsed through a glass partition, with a freestanding stone tub. |
| 19 | Turn 360° | Back to the living room facing the sea windows, sunset light flooding in. |
| 20 | To window | The camera moves toward the window wall, the terrace and infinity pool beyond. |
| 21 | Terrace | Out on the terrace at the pool edge, the sea ahead, the villa lights glowing behind. |
| 22 | Rise | The camera rises above the pool; the villa roof and terrace are below. |
| 23 | Pull back | Aerial pull-back, the whole villa glowing at dusk among palms. |
| 24 | Aerial dusk | The same high aerial as frame 01 but at blue hour: every room lit warm, the pool glowing turquoise. |

---

## 3 · Meridian Glass Studio: "making of a piece, beginning to end"
**Camera (every frame):** *Photoreal close cinematic photograph in a dark glassblowing studio. Black
background, lit mainly by the orange glow of molten glass plus one soft key light. 50mm lens, shallow
depth of field. Hands in heat-proof gloves and sleeves only, never faces.*

**The piece (keep identical):** a large organic sculptural vessel. It has flowing petal-like folds,
deep cobalt at the base melting into teal and then amber at the rim, with fine white veins.

**Frames 01–19:** edit each from the previous one. **Frames 20–24:** edit from frame 19, the finished
glowing piece.

| # | Step | Prompt |
|---|---|---|
| 01 | Design | Overhead: a pencil-and-watercolour sketch of the vessel on paper, glass colour rods (cobalt, teal, amber) beside it, a single warm lamp. |
| 02 | Materials | Bowls of clear cullet and coloured frit (cobalt, teal, amber) on a steel bench, lit warmly. |
| 03 | Furnace | The furnace door open, glowing intense orange-white, a heat haze. |
| 04 | Gather | A steel blowpipe dipping into the molten glass inside the furnace. |
| 05 | Glowing gather | The blowpipe pulled out with a glowing orange gather of molten glass, gloved hands turning it. |
| 06 | Marver | Rolling the glowing gather on a polished steel marver table, sparks of light. |
| 07 | Colour | Rolling the gather through cobalt and teal frit on the bench; colour flecks stick to the glow. |
| 08 | Reheat | Gather back in the glory hole, glowing white-orange, colours melting in. |
| 09 | First breath | The first breath: a small bubble inflating inside the gather on the pipe. |
| 10 | Block | Shaping the bubble with a wet cherrywood block, steam rising. |
| 11 | Swell | The bubble now larger, cobalt and teal swirls visible through the orange glow. |
| 12 | Jacks | Steel jacks necking the form while the pipe turns. |
| 13 | Paddle | A wooden paddle flattening the base. |
| 14 | Punty | The piece transferred onto a punty rod, sparks at the join. |
| 15 | Open | Jacks opening the mouth of the vessel as it spins. |
| 16 | Flare | The rim flaring outward into a wide bloom with centrifugal spin, glowing amber. |
| 17 | Petals | Tweezers pulling the rim into organic petal folds. |
| 18 | Finished hot | The finished form glowing on the punty, colours visible through the heat. |
| 19 | Annealer | The piece placed into the annealing kiln, glowing, the kiln door half-closed. |
| 20 | Revealed | Next morning: the kiln opened, the cooled vessel inside, jewel colours clear. |
| 21 | Polish | Cold-working: the base polished on a wet grinding wheel, water spray, hands only. |
| 22 | Plinth | The finished vessel on a black obsidian plinth in a dark gallery, a soft top light. |
| 23 | Light | A single beam of light through the vessel throwing prismatic rainbow caustics across the plinth and wall. |
| 24 | Installed | The vessel installed in a luxury penthouse niche lit with warm grazing light, city lights beyond the window. |
