/* PIXTION · shared.js — the one object that several modules both read and change.
   Keeping it here (instead of global variables) makes every shared value easy to find:
     app.profile   the signed-in profile {name, age}
     app.gallery   saved artworks
     app.undo / app.redo                 undo history for the studio
     app.drawing / app.last / app.dirty  the stroke in progress on the canvas
     app.start / app.base                where a shape started and the frame before it */
export const app = {};
