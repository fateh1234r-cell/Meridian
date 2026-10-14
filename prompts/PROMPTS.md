# Meridian Group: hero video prompt pack (Google Whisk + Google Flow)

There are three hero videos, one per company. Each one is played **by the visitor's scroll**: scrolling
down moves the story forward and scrolling up rewinds it. Until you deliver the clips, the site shows
a 3-stage photo sequence in each hero, so the demo already works. When the encoded clip appears at
its path, it takes over automatically with no code changes.

| Hero | Story | Final file (Claude makes this) |
|---|---|---|
| Home / Meridian Build | Site line-out → workers building → finished commercial landmark | `assets/video/01-build-hero.mp4` + `-m` |
| Meridian Interiors | Empty shell → interior taking shape → supreme finished interior | `assets/video/02-interiors-hero.mp4` + `-m` |
| Meridian Glass Studio | Furnace → molten glass gathered and shaped → finished artwork in light | `assets/video/03-glass-hero.mp4` + `-m` |

## How to make each video

**1. Make the 4 anchor stills in Whisk (A0 → A3) for one story.**
- **Same camera in every still.** Use the identical camera position, lens and framing for all four,
  and change only what is in the scene. This is what makes the final video look like one continuous
  time-lapse rather than four different shots.
  - In Whisk, put **A0 in the "Scene" slot** while generating A1, A2 and A3 to lock the angle.
  - Repeat the camera line given in each story at the start of every prompt.
- **Format:** 16:9, highest quality. If Whisk drifts the angle, regenerate. Matching frames matter
  more than pretty ones.

**2. Make 3 clips in Flow (one "leg" per pair of stills).**
- Use **Frames to Video** with start frame = A0 and end frame = A1. Paste the leg prompt, choose
  8 seconds and highest quality.
- Repeat for A1 → A2 and A2 → A3.
- Because each leg starts exactly where the last one ended, Claude can join them seamlessly.

**3. Phone version (optional).** If Flow offers 9:16, redo the same legs with 9:16 anchors. Otherwise
skip it and Claude will crop the 16:9 clip for phones.

**4. Hand-off.** Save the files into `meridian-group-demo/raw/` using the exact names below and tell
Claude. Claude will:
- join the 3 legs,
- check the seams,
- encode them for scrubbing (dense keyframes: 1080p desktop, 720p mobile),
- make poster frames,
- wire everything in.

**Paste this at the end of every Flow prompt:**
> One single continuous take, locked-off camera (or one smooth slow move where stated), no cuts, no
> camera shake, no flicker, no text, no logos. Photoreal, cinematic, natural light.

**About people** (the construction workers and the glassblower's hands): AI video can warp faces and
change how many people there are.
- **Workers:** keep them **small in frame, seen from a distance, wearing hard hats and hi-vis**, with
  the same few people throughout.
- **Glassblowing:** frame **hands and tools only**, no faces.
- **If someone morphs, regenerate that leg.** The scroll lets visitors stop on any frame, so a warped
  frame will be seen.

---

## 01 · Meridian Build: "We draw the line. We build. We deliver."
**Camera line (start of every prompt):** *High wide aerial view from a fixed drone position,
three-quarter angle looking down at a city plot in Mumbai's Bandra Kurla Complex, 24mm lens,
late-afternoon golden light, surrounding towers and roads at the frame edges.*

| Anchor | Whisk prompt (after the camera line) |
|---|---|
| **A0 · Line-out** | An empty levelled plot of dusty earth. Bright white survey line-out markings are painted on the ground showing the building's footprint, grid lines and column positions, with wooden survey pegs and string lines. Two small surveyors with a tripod total station in one corner. |
| **A1 · Foundations** | The same plot with excavation and foundations: concrete raft and rebar cages following the same white grid, two yellow tower cranes erected, a few small construction workers in hard hats and orange hi-vis, an excavator at the edge. |
| **A2 · Structure** | The same plot now with a 12-storey concrete frame rising on the same footprint: exposed columns and slabs, formwork on the top floor, the two tower cranes beside it, small workers on the slabs, scaffolding on one side. |
| **A3 · Finished** | The same plot now a finished premium commercial tower: floor-to-ceiling blue-green glass curtain wall, bronze fins, landscaped plaza with trees and a water feature, warm lights coming on inside at dusk, cranes and workers gone. |

| Leg | Flow prompt (Frames to Video, 8 s) | Save as |
|---|---|---|
| A0 → A1 | Time-lapse of construction beginning: the ground is excavated along the white survey lines, rebar and concrete foundations appear, and two tower cranes rise. Workers move busily but stay small in frame. Locked-off aerial camera, shadows sweeping as hours pass. | `raw/01a.mp4` |
| A1 → A2 | Time-lapse of the concrete frame rising floor by floor on the foundations, cranes swinging and lifting, scaffolding climbing. Locked-off aerial camera, light changing across days. | `raw/01b.mp4` |
| A2 → A3 | Time-lapse of the building being completed: glass curtain wall panels clad the frame from bottom to top, scaffolding and cranes are removed, the plaza is landscaped, and dusk falls as interior lights switch on. Very slow push-in toward the tower. | `raw/01c.mp4` |

## 02 · Meridian Interiors: "Empty space. Shaped by light. Rooms, finished."
**Camera line:** *Eye-level wide interior view from a fixed position in the doorway of a large
Mumbai apartment living room, 20mm lens, one large floor-to-ceiling window on the right with a sea
and city view, soft late-afternoon sunlight falling across the floor.*

| Anchor | Whisk prompt (after the camera line) |
|---|---|
| **A0 · Empty** | A completely empty bare shell: raw grey concrete walls, ceiling and floor, exposed conduit, dust in the sunbeam, nothing else in the room. |
| **A1 · Shaped** | The same empty room with surfaces finished: smooth warm-white plaster walls, a coved ceiling with hidden linear lighting, a pale travertine stone floor, and a fluted walnut panelled feature wall on the left. Still no furniture. |
| **A2 · Furnished** | The same room now furnished: a low cream bouclé sofa, travertine coffee table, oxblood velvet armchair, a large hand-knotted wool rug, sheer linen curtains, built-in walnut shelving. |
| **A3 · Supreme** | The same room fully styled as a supreme luxury interior at golden hour: brass and alabaster pendant lights glowing, art on the walls, sculptural vases, books, fresh flowers, a colourful hand-blown glass art piece on the console, with warm light and soft shadows everywhere. |

| Leg | Flow prompt (Frames to Video, 8 s) | Save as |
|---|---|---|
| A0 → A1 | The bare concrete room transforms smoothly: plaster, stone flooring and walnut panelling appear across the surfaces as if built in fast-forward, while the sunlight on the floor stays steady. Locked-off camera. | `raw/02a.mp4` |
| A1 → A2 | Furniture, rug and curtains appear one after another and settle into place in the finished room, smooth and natural. Locked-off camera with a very slight slow push forward. | `raw/02b.mp4` |
| A2 → A3 | The room is styled and comes alive: lights glow on, art, objects and flowers appear, and the light warms into golden hour. Very slow push forward. | `raw/02c.mp4` |

## 03 · Meridian Glass Studio: "Born in fire. Shaped by breath. We craft light."
**Camera line:** *Close cinematic view inside a dark glassblowing studio, 50mm lens, black
background, the scene lit mainly by the orange glow of molten glass, shallow depth of field.*

| Anchor | Whisk prompt (after the camera line) |
|---|---|
| **A0 · Fire** | The open mouth of a glass furnace glowing intense orange-white, a steel blowpipe entering from the right with a glowing gather of molten glass on its tip. Only hands in thick gloves visible, no face. |
| **A1 · Gather** | The same framing: the blowpipe pulled out of the furnace, a large glowing orange gather of molten glass rotating on its end, sparks and heat shimmer, gloved hands turning the pipe. |
| **A2 · Shaping** | The same framing: the glowing glass inflated into a bulb and being shaped with a wet wooden block and steel jacks, colour now showing through the glow in swirls of cobalt and amber, gloved hands only. |
| **A3 · Light** | The same framing: the finished hand-blown glass sculpture, cooled and flawless, with sweeping organic forms in cobalt, teal and amber, standing on a black obsidian plinth. A single beam of light passes through it and throws a prismatic rainbow caustic onto the plinth. Hands and tools gone. |

| Leg | Flow prompt (Frames to Video, 8 s) | Save as |
|---|---|---|
| A0 → A1 | The blowpipe is drawn slowly out of the glowing furnace, the molten gather turning steadily, heat shimmer rising. Locked-off camera. | `raw/03a.mp4` |
| A1 → A2 | The molten glass is gently inflated and shaped as the pipe turns, the glowing bulb swelling, and colour swirls bloom inside it. Locked-off camera. | `raw/03b.mp4` |
| A2 → A3 | The glowing form cools and transforms into the finished glass sculpture on the plinth: the orange glow fades into clear jewel colours, and a light beam reveals a rainbow caustic. Very slow push-in. | `raw/03c.mp4` |
