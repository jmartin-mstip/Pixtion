/* PIXTION · core/env.js — environment checks (in-app browsers such as Messenger). */

export let IAB;

/** Runs once at start-up, in the original order. */
export function init() {
  IAB = /FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|Line\//i.test(navigator.userAgent || '');
}
