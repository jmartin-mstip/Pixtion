/* PIXTION · templates/catalog.js — the template catalogue: titles, categories, descriptions and lazy frame generation. */
import { enc } from '../core/codec.js';
import { uid } from '../core/dom.js';
import { aquariumFrames, auroraFrame, balloonFrames, blossomFrames, earthFrames, firefliesFrames, galaxy, koiFrames, lavaLampFrames, lighthouseFrames, megaMountains, nightStarFrames, rainyCityFrames, ringedPlanetFrames, snowForestFrames, stormFrames, sunsetSeaFrames, synthFrames, tunnelFrames, valley, volcanoFrames, warpFrame, waterfallFrames } from './art-big.js';
import { beachSunset, castleArt, cityFrame, codeRainFrames, cubeFrames, fireFrame, landscape, mountains, nightSky, oceanFloor, parallaxFrames, platformLevel, rainbowFrames } from './art-scenes.js';
import { butterflyFrame, campfireFrame, carArt, clockFrame, dayNightFrame, ecgFrames, eqFrames, fishFrame, flagFrame, gemFrame, heroWalk, hourglassFrames, makeBall, pendulumFrames, rippleFrames, rocketFrame, slimeFrame, snowFrame, spinFrame, starFrame, sunSpinFrames, trafficFrame, wavesFrame, windmillFrame } from './art-small.js';
import { fromMap, shape, shiftArt } from './draw.js';
import { MAPS } from './maps.js';

export function exampleItem() { return {id: uid(), title: 'Bouncing ball', example: true, grid: 16, fps: 10, frames: makeBall().map(enc), desc: 'Squash and stretch on landing, with a shadow that grows as the ball falls.', artist: 'PIXTION', created: Date.now(), updated: Date.now()}; }

function heartFrame(s, fill = 6){
  const a = shape(16, (x, y) => { const X = (x + .5 - 8) / (5.6 * s), Y = -(y + .5 - 8.3) / (5.6 * s), q = X * X + Y * Y - 1; return q * q * q - X * X * Y * Y * Y <= 0; }, fill, 1);
  if (fill){ const i = Math.round(8.3 - 3.4 * s) * 16 + Math.round(8 - 3.3 * s); if (a[i] === fill) a[i] = 29; }
  return a;
}

function faceFrame(blink){
  const g = 16, a = shape(g, (x, y) => { const dx = x + .5 - 8, dy = y + .5 - 8; return dx * dx + dy * dy <= 43.5; }, 10, 1);
  const P = (x, y, v) => a[y * g + x] = v;
  if (blink){ [4, 5, 6, 9, 10, 11].forEach(x => P(x, 7, 1)); }
  else { [5, 10].forEach(x => { P(x, 6, 1); P(x, 7, 1); }); }
  P(4, 9, 7); P(11, 9, 7);
  P(5, 10, 1); P(10, 10, 1); [6, 7, 8, 9].forEach(x => P(x, 11, 1));
  return a;
}

function coinFrame(rx){
  const g = 16, a = shape(g, (x, y) => { const dx = (x + .5 - 8) / rx, dy = (y + .5 - 8) / 6.3; return dx * dx + dy * dy <= 1; }, 10, 27);
  if (rx > 3){
    for (let y = 6; y <= 9; y++){ a[y * g + 7] = 27; a[y * g + 8] = 27; }
    const sx = Math.round(8 - rx * .55); for (let y = 4; y <= 6; y++) if (a[y * g + sx] === 10) a[y * g + sx] = 11;
  }
  return a;
}

function flameFrame(sway, tip){
  const g = 16, a = new Array(g * g).fill(0), base = 10;
  for (let y = tip; y < base; y++){
    const t = (y - tip) / Math.max(1, base - 1 - tip), hw = 3 * Math.sqrt(t) * (1 - .22 * t) + .35, cx = 8 + sway * (1 - t) * 1.3;
    for (let x = 0; x < g; x++){
      const d = Math.abs(x + .5 - cx);
      if (d <= hw) a[y * g + x] = (d <= hw * .35 && t > .35) ? 11 : d <= hw * .68 ? 10 : 8;
    }
  }
  a[10 * g + 7] = 1; a[10 * g + 8] = 1;
  for (let y = 11; y <= 14; y++) for (let x = 5; x <= 10; x++) a[y * g + x] = (x === 5 || x === 10) ? 1 : 5;
  a[11 * g + 6] = 4; a[12 * g + 6] = 4;
  for (let x = 3; x <= 12; x++) a[15 * g + x] = 2;
  return a;
}

function rainFrame(f){
  const g = 16, blobs = [[5, 4.6, 3], [9, 3.6, 3.4], [11.6, 5, 2.6], [7.5, 5.4, 3]];
  const a = shape(g, (x, y) => y <= 6 && blobs.some(([cx, cy, r]) => { const dx = x + .5 - cx, dy = y + .5 - cy; return dx * dx + dy * dy <= r * r; }), 29, 3);
  [[3, 0], [7, 3], [11, 1], [5, 4], [9, 2], [13, 5]].forEach(([x, ph]) => {
    const y0 = 8 + ((f + ph) % 6);
    for (let y = y0; y < y0 + 2 && y < 15; y++) a[y * g + x] = 19;
  });
  for (let x = 0; x < g; x++) a[15 * g + x] = 18;
  a[15 * g + ((f * 3) % 14) + 1] = 20;
  return a;
}

const TPL_ANIM = [
  {title: 'Bouncing ball', desc: 'Squash and stretch on landing, with a shadow that grows.', grid: 16, fps: 10, make: () => makeBall()},
  {title: 'Beating heart', desc: 'A heart that pulses big and small like a heartbeat.', grid: 16, fps: 6, make: () => [1, 1.13, 1, 1.07, 1, 1].map(s => heartFrame(s))},
  {title: 'Blinking smiley', desc: 'A happy face that blinks every second.', grid: 16, fps: 6, make: () => [0, 0, 0, 0, 1, 0].map(b => faceFrame(b))},
  {title: 'Candle flame', desc: 'A flickering flame that sways from side to side.', grid: 16, fps: 8, make: () => [[0, 2], [1, 1], [0, 2], [-1, 3], [0, 2], [-1, 1]].map(([s, t]) => flameFrame(s, t))},
  {title: 'Spinning coin', desc: 'A gold coin turning on its edge.', grid: 16, fps: 10, make: () => [6.3, 4.6, 2.3, .9, 2.3, 4.6].map(coinFrame)},
  {title: 'Rain cloud', desc: 'Raindrops falling from a cloud into a puddle.', grid: 16, fps: 8, make: () => [0, 1, 2, 3, 4, 5].map(rainFrame)}
];

const TPL_STATIC = [
  {title: 'Hero character', desc: 'Colour the clothes, then duplicate the frame and move the legs to make a walk.', grid: 16, make: () => [fromMap(MAPS.hero)]},
  {title: 'Cat face', desc: 'Make it blink, wiggle its ears or twitch its nose.', grid: 16, make: () => [fromMap(MAPS.cat)]},
  {title: 'Little house', desc: 'Add smoke from the roof or switch the window light on and off.', grid: 16, make: () => [fromMap(MAPS.house)]},
  {title: 'Pixel tree', desc: 'Animate falling apples or leaves blowing in the wind.', grid: 16, make: () => [fromMap(MAPS.tree)]},
  {title: 'Sunny landscape', desc: 'A 20×20 scene. Use Move to slide the cloud across the sky.', grid: 20, make: () => [landscape()]},
  {title: 'Heart outline', desc: 'An empty heart. Fill it with your favourite colour.', grid: 16, make: () => [heartFrame(1, 0)]}
];

const CATS = {'Bouncing ball': 'Objects', 'Beating heart': 'Objects', 'Blinking smiley': 'Characters', 'Candle flame': 'Objects', 'Spinning coin': 'Objects', 'Rain cloud': 'Nature',
  'Hero character': 'Characters', 'Cat face': 'Characters', 'Little house': 'Scenes', 'Pixel tree': 'Nature', 'Sunny landscape': 'Scenes', 'Heart outline': 'Objects'};

export let TPLS;

export function tplFrames(t) { return t._f || (t._f = t.make()); }

/** Runs once at start-up, in the original order. */
export function init() {
  TPL_ANIM.forEach(t => t.cat = CATS[t.title]);

 
  TPL_STATIC.forEach(t => t.cat = CATS[t.title]);

  TPL_ANIM.push(
    {title: 'Walking hero', cat: 'Characters', desc: 'Two-frame walk cycle. Add more frames in between to make it smoother.', grid: 16, fps: 4, make: heroWalk},
    {title: 'Floating ghost', cat: 'Characters', desc: 'A friendly ghost bobbing up and down.', grid: 16, fps: 6, make: () => [0, -1, -1, 0, 1, 1].map(dy => shiftArt(fromMap(MAPS.ghost), 16, 0, dy))},
    {title: 'Swimming fish', cat: 'Nature', desc: 'A fish crossing the sea past swaying seaweed and bubbles.', grid: 20, fps: 8, make: () => [...Array(16).keys()].map(fishFrame)},
    {title: 'Twinkling star', cat: 'Nature', desc: 'A pulsing star with sparkles that hop around it.', grid: 16, fps: 4, make: () => [0, 1, 2, 3].map(starFrame)},
    {title: 'Snowy night', cat: 'Scenes', desc: 'Snow drifting down over pine trees under the moon.', grid: 20, fps: 6, make: () => [...Array(17).keys()].map(snowFrame)},
    {title: 'Fireworks', cat: 'Scenes', desc: 'A rocket shoots up over the city and bursts into colour.', grid: 24, fps: 8, make: () => [...Array(8).keys()].map(fireFrame)},
    {title: 'Rocket launch', cat: 'Scenes', desc: 'A rocket flying up through the stars, flame flickering.', grid: 16, fps: 10, make: () => [...Array(11).keys()].map(rocketFrame)},
    {title: 'City lights', cat: 'Scenes', desc: 'A 48×48 skyline at night with windows switching on and off.', grid: 48, fps: 3, make: () => [0, 1, 2, 3].map(cityFrame)},
    {title: 'Philippine flag', cat: 'Objects', desc: 'The Philippine flag waving in the wind, with the golden sun and three stars.', grid: 32, fps: 8, make: () => [...Array(6).keys()].map(flagFrame)},
    {title: 'Ticking clock', cat: 'Objects', desc: 'The red second hand goes round in eight steps.', grid: 16, fps: 4, make: () => [...Array(8).keys()].map(clockFrame)},
    {title: 'Loading spinner', cat: 'Objects', desc: 'A spinning ring of dots, like a loading screen.', grid: 16, fps: 10, make: () => [...Array(8).keys()].map(spinFrame)}
  );

  TPL_STATIC.push(
    {title: 'Robot', cat: 'Characters', desc: 'Make its eyes blink or its antenna light flash.', grid: 16, make: () => [fromMap(MAPS.robot)]},
    {title: 'Mushroom', cat: 'Nature', desc: 'A spotted mushroom with a cute face. Try a squash-and-stretch hop.', grid: 16, make: () => [fromMap(MAPS.mushroom)]},
    {title: 'Flower', cat: 'Nature', desc: 'Make the petals open or the stem sway.', grid: 16, make: () => [fromMap(MAPS.flower)]},
    {title: 'Magic potion', cat: 'Objects', desc: 'Move the bubbles up a pixel each frame to make it fizz.', grid: 16, make: () => [fromMap(MAPS.potion)]},
    {title: 'Ice cream', cat: 'Objects', desc: 'Add drips, sprinkles or a second scoop.', grid: 16, make: () => [fromMap(MAPS.icecream)]},
    {title: 'Night sky', cat: 'Scenes', desc: 'A 24×24 crescent moon over the hills. Add a shooting star.', grid: 24, make: () => [nightSky()]},
    {title: 'Ocean floor', cat: 'Scenes', desc: 'Coral, seaweed and a starfish. Add your own fish.', grid: 20, make: () => [oceanFloor()]},
    {title: 'Beach sunset', cat: 'Scenes', desc: 'A 24×24 sunset over the sea with seagulls.', grid: 24, make: () => [beachSunset()]},
    {title: 'Game level', cat: 'Scenes', desc: 'A 32×32 platform level with bricks, coins and a pipe.', grid: 32, make: () => [platformLevel()]},
    {title: 'Mountains at dawn', cat: 'Scenes', desc: 'A detailed 64×64 landscape. Zoom in to add details.', grid: 64, make: () => [mountains()]}
  );

  TPL_ANIM.push(
    {title: 'Bouncing slime', cat: 'Characters', desc: 'A jelly slime that squashes, jumps and lands.', grid: 16, fps: 8, make: () => [[4, 0], [3.2, 0], [4.6, 1], [5, 3], [4.6, 5], [4.2, 3], [4.6, 1], [3, 0]].map(slimeFrame)},
    {title: 'Butterfly', cat: 'Nature', desc: 'Wings flap open and shut as it flutters.', grid: 16, fps: 8, make: () => [0, 1, 2, 3].map(butterflyFrame)},
    {title: 'Campfire', cat: 'Scenes', desc: 'A crackling fire with sparks under the night sky.', grid: 20, fps: 8, make: () => [...Array(6).keys()].map(campfireFrame)},
    {title: 'Windmill', cat: 'Scenes', desc: 'Sails turning slowly in the breeze.', grid: 20, fps: 6, make: () => [0, 1, 2, 3].map(windmillFrame)},
    {title: 'Traffic light', cat: 'Objects', desc: 'Red, then green, then yellow. A tiny 12×12 loop.', grid: 12, fps: 2, make: () => [...Array(7).keys()].map(trafficFrame)},
    {title: 'Day to night', cat: 'Scenes', desc: 'The sun sets, the moon rises and the window lights up.', grid: 20, fps: 3, make: () => [...Array(8).keys()].map(dayNightFrame)},
    {title: 'Ocean waves', cat: 'Scenes', desc: 'Waves rolling in and foam washing up the beach.', grid: 24, fps: 6, make: () => [...Array(6).keys()].map(wavesFrame)},
    {title: 'Sparkling gem', cat: 'Objects', desc: 'A shiny gem with a glint that moves around it.', grid: 16, fps: 4, make: () => [0, 1, 2, 3].map(gemFrame)},
    {title: 'Warp speed', cat: 'Scenes', desc: 'A 128×128 starfield rushing past, like jumping to hyperspace.', grid: 128, fps: 10, make: () => [...Array(8).keys()].map(warpFrame)},
    {title: 'Aurora sky', cat: 'Scenes', desc: 'A 256×256 northern lights scene with shimmering bands.', grid: 256, fps: 4, make: () => [0, 1, 2, 3].map(auroraFrame)}
  );

  TPL_STATIC.push(
    {title: 'Treasure chest', cat: 'Objects', desc: 'Animate the lid opening and gold spilling out.', grid: 16, make: () => [fromMap(MAPS.chest)]},
    {title: 'Sword', cat: 'Objects', desc: 'Add a glint sliding along the blade.', grid: 16, make: () => [fromMap(MAPS.sword)]},
    {title: 'Cupcake', cat: 'Objects', desc: 'Light a candle on top or add more sprinkles.', grid: 16, make: () => [fromMap(MAPS.cupcake)]},
    {title: 'Burger', cat: 'Objects', desc: 'Stack more layers or make it bounce.', grid: 16, make: () => [fromMap(MAPS.burger)]},
    {title: 'Frog', cat: 'Characters', desc: 'Make it blink or puff out its cheeks.', grid: 16, make: () => [fromMap(MAPS.frog)]},
    {title: 'Penguin', cat: 'Characters', desc: 'Make it waddle side to side.', grid: 16, make: () => [fromMap(MAPS.penguin)]},
    {title: 'Red car', cat: 'Objects', desc: 'A 24×24 car. Use Move to drive it across the frame.', grid: 24, make: () => [carArt()]},
    {title: 'Castle', cat: 'Scenes', desc: 'A 32×32 castle with towers and flags.', grid: 32, make: () => [castleArt()]},
    {title: 'Spiral galaxy', cat: 'Scenes', desc: 'A 128×128 galaxy with glowing spiral arms.', grid: 128, make: () => [galaxy()]},
    {title: 'Lakeside valley', cat: 'Scenes', desc: 'A 256×256 landscape with a lake, pine trees and wildflowers.', grid: 256, make: () => [valley()]},
    {title: 'Mega mountains', cat: 'Scenes', desc: 'A huge 512×512 mountain range at sunset. Zoom to 8× or 16× to paint details.', grid: 512, make: () => [megaMountains()]}
  );

  TPL_ANIM.push(
    {title: 'Spinning Earth', cat: 'Scenes', desc: 'A 128×128 planet turning in space, with clouds and polar ice.', grid: 128, fps: 8, make: earthFrames},
    {title: 'Rainy city', cat: 'Scenes', desc: 'A 128×128 street at night with rain, a lamp post and puddle ripples.', grid: 128, fps: 8, make: rainyCityFrames},
    {title: 'Aquarium', cat: 'Nature', desc: 'A 128×128 fish tank with a school of fish, swaying seaweed and bubbles.', grid: 128, fps: 8, make: aquariumFrames},
    {title: 'Volcano', cat: 'Nature', desc: 'A 128×128 volcano erupting lava and smoke.', grid: 128, fps: 8, make: volcanoFrames},
    {title: 'Sunset sea', cat: 'Scenes', desc: 'A 256×256 sunset with rolling waves, a sailboat and a palm tree.', grid: 256, fps: 6, make: sunsetSeaFrames},
    {title: 'Snowy forest', cat: 'Scenes', desc: 'A 256×256 winter forest with a cabin, chimney smoke and falling snow.', grid: 256, fps: 6, make: snowForestFrames},
    {title: 'Retro road', cat: 'Scenes', desc: 'A 256×256 retro sunset with a neon grid racing toward you.', grid: 256, fps: 10, make: synthFrames},
    {title: 'Shooting star', cat: 'Scenes', desc: 'A 512×512 night sky with twinkling stars and a shooting star over the hills.', grid: 512, fps: 8, make: nightStarFrames},
    {title: 'Lighthouse', cat: 'Scenes', desc: 'A 512×512 lighthouse sweeping its beam across a night sea.', grid: 512, fps: 6, make: lighthouseFrames},
    {title: 'Cherry blossoms', cat: 'Nature', desc: 'A 512×512 park with a blossom tree and petals drifting down.', grid: 512, fps: 8, make: blossomFrames},
    {title: 'Lava lamp', cat: 'Objects', desc: 'A 512×512 lava lamp with glowing blobs rising and sinking.', grid: 512, fps: 8, make: lavaLampFrames}
  );

  TPL_ANIM.push(
    {title: 'Hourglass', cat: 'Objects', desc: 'Sand trickling from the top to the bottom.', grid: 16, fps: 3, make: hourglassFrames},
    {title: 'Heartbeat monitor', cat: 'Objects', desc: 'A 32×32 heart-rate line beeping across the screen.', grid: 32, fps: 12, make: ecgFrames},
    {title: 'Pendulum', cat: 'Objects', desc: 'A gold pendulum swinging with a motion trail.', grid: 32, fps: 8, make: pendulumFrames},
    {title: 'Music equalizer', cat: 'Objects', desc: 'Bars bouncing to the beat, from green to red.', grid: 32, fps: 8, make: eqFrames},
    {title: 'Happy sun', cat: 'Nature', desc: 'A smiling sun with spinning rays.', grid: 32, fps: 6, make: sunSpinFrames},
    {title: 'Water drop', cat: 'Nature', desc: 'A drop falls and ripples spread across the water.', grid: 48, fps: 8, make: rippleFrames},
    {title: 'Rainbow wave', cat: 'Nature', desc: 'A 64×64 rainbow rippling through the sky.', grid: 64, fps: 8, make: rainbowFrames},
    {title: 'Code rain', cat: 'Scenes', desc: 'A 64×64 hacker-style screen of falling green code.', grid: 64, fps: 8, make: codeRainFrames},
    {title: 'Spinning cube', cat: 'Objects', desc: 'A 64×64 3D wireframe cube turning in space.', grid: 64, fps: 10, make: cubeFrames},
    {title: 'Scrolling hills', cat: 'Scenes', desc: 'A 64×64 side-scrolling scene with layers moving at different speeds.', grid: 64, fps: 8, make: parallaxFrames},
    {title: 'Neon tunnel', cat: 'Scenes', desc: 'A 128×128 checkered tunnel pulling you forward.', grid: 128, fps: 10, make: tunnelFrames},
    {title: 'Thunderstorm', cat: 'Nature', desc: 'A 128×128 storm with heavy rain and a lightning flash.', grid: 128, fps: 8, make: stormFrames},
    {title: 'Hot air balloons', cat: 'Scenes', desc: 'A 256×256 sunrise with striped balloons bobbing and clouds drifting.', grid: 256, fps: 6, make: balloonFrames},
    {title: 'Ringed planet', cat: 'Scenes', desc: 'A 256×256 planet with rings and two orbiting moons.', grid: 256, fps: 8, make: ringedPlanetFrames},
    {title: 'Waterfall', cat: 'Nature', desc: 'A 512×512 waterfall pouring into a misty pool.', grid: 512, fps: 8, make: waterfallFrames},
    {title: 'Firefly forest', cat: 'Nature', desc: 'A 512×512 night forest full of blinking fireflies.', grid: 512, fps: 6, make: firefliesFrames},
    {title: 'Koi pond', cat: 'Nature', desc: 'A 512×512 pond with koi circling between lily pads.', grid: 512, fps: 8, make: koiFrames}
  );

  TPL_STATIC.push(
    {title: 'Cactus', cat: 'Nature', desc: 'A potted cactus with a pink flower. Make the flower bloom.', grid: 16, make: () => [fromMap(MAPS.cactus)]},
    {title: 'Pizza slice', cat: 'Objects', desc: 'Add steam or stretch the cheese.', grid: 16, make: () => [fromMap(MAPS.pizza)]},
    {title: 'Owl', cat: 'Characters', desc: 'Make it blink or turn its head.', grid: 16, make: () => [fromMap(MAPS.owl)]},
    {title: 'Bunny', cat: 'Characters', desc: 'Wiggle its ears or make it hop.', grid: 16, make: () => [fromMap(MAPS.bunny)]}
  );

  TPL_ANIM.forEach(t => t.anim = true);

  TPLS = [...TPL_ANIM, ...TPL_STATIC];
}
