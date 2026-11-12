// Works out how much of the page is ready, from markers components put in their markup:
//
//   data-preload="canvas"   → ready once a WebGL <canvas> inside it has drawn a few frames
//   data-preload="images"   → one task per <img> inside it, ready when each has loaded (or failed)
//   data-preload-waiting    → not ready yet; the component hasn't rendered its content
//
// Fonts count as one more task.

const framesSeen = new WeakMap<Element, number>();

// ShaderGradient compiles its shader on the first frame it draws, which blocks the main thread.
// A few frames after the canvas appears, that has happened and it's on screen.
const CANVAS_FRAMES = 3;

function canvasReady(el: Element) {
  const canvas = el.querySelector("canvas");
  if (!canvas || canvas.width === 0) return false;
  const seen = (framesSeen.get(el) ?? 0) + 1;
  framesSeen.set(el, seen);
  return seen >= CANVAS_FRAMES;
}

// Call once per animation frame. Returns 0–1.
export function measureReadiness(fontsReady: boolean) {
  let total = 1;
  let done = fontsReady ? 1 : 0;

  document.querySelectorAll<HTMLElement>("[data-preload]").forEach((el) => {
    if (el.hasAttribute("data-preload-waiting")) {
      total += 1;
      return;
    }
    if (el.dataset.preload === "canvas") {
      total += 1;
      if (canvasReady(el)) done += 1;
    } else if (el.dataset.preload === "images") {
      el.querySelectorAll("img").forEach((img) => {
        total += 1;
        if (img.complete) done += 1;
      });
    }
  });

  return done / total;
}
