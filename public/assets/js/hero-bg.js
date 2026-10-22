// Hero background: a field of dots that waves like fabric and ripples under the pointer.
// Storytelling: tailoring (fabric) meets code (grid of points). Pauses off-screen; static under reduced motion.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const canvas = document.getElementById('heroBg');
const header = canvas?.parentElement;
const gl = canvas && (() => { try { return canvas.getContext('webgl2') || canvas.getContext('webgl'); } catch { return null; } })();
if (gl) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  // ponytail: 160x80 points (~13k) is plenty; raise segments only if it looks sparse on 4K
  const geo = new THREE.PlaneGeometry(36, 18, 160, 80);
  const accent = () => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uHover: { value: 0 },
    uColor: { value: accent() },
    uSize: { value: 3.4 * renderer.getPixelRatio() },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: `
      uniform float uTime; uniform vec2 uMouse; uniform float uHover; uniform float uSize;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float t = uTime;
        float z = sin(p.x * .32 + t * .7) * .9 + cos(p.y * .45 + t * .5) * .55 + sin((p.x + p.y) * .18 - t * .4) * .6;
        float d = distance(p.xy, uMouse);
        z += sin(d * 1.4 - t * 3.2) * exp(-d * .25) * uHover * 1.3;
        p.z = z;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (10. / -mv.z);
        vAlpha = clamp(.42 + z * .3, .14, 1.);
      }`,
    fragmentShader: `
      uniform vec3 uColor; varying float vAlpha;
      void main() {
        float r = length(gl_PointCoord - .5);
        if (r > .5) discard;
        gl_FragColor = vec4(uColor, vAlpha * smoothstep(.5, .15, r));
      }`,
  });
  const field = new THREE.Points(geo, mat);
  field.rotation.x = -1.0;
  field.position.y = -0.4;
  scene.add(field);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = header;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize);

  // Theme toggle swaps --accent: keep the dots in sync
  new MutationObserver(() => { uniforms.uColor.value = accent(); if (reduce) renderer.render(scene, camera); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Pointer -> point on the tilted plane (local coords) for the ripple
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3();
  const plane = new THREE.Plane();
  let hoverTarget = 0;
  header.addEventListener('pointermove', e => {
    const r = header.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    field.updateMatrixWorld();
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1).applyQuaternion(field.quaternion), field.position);
    if (ray.ray.intersectPlane(plane, hit)) {
      field.worldToLocal(hit);
      uniforms.uMouse.value.set(hit.x, hit.y);
      hoverTarget = 1;
    }
  });
  header.addEventListener('pointerleave', () => { hoverTarget = 0; });

  const clock = new THREE.Clock();
  let running = false;
  const frame = () => {
    if (!running) return;
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * .05;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  };

  if (reduce) {
    uniforms.uTime.value = 2;
    renderer.render(scene, camera);
  } else {
    // Only animate while the hero is on screen
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; clock.start(); requestAnimationFrame(frame); }
      else if (!e.isIntersecting) { running = false; clock.stop(); }
    }).observe(header);
  }
  requestAnimationFrame(() => canvas.classList.add('on'));
}
