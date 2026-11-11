import * as THREE from 'three';

// Hero background (DESIGN.md §7 Card 03, calmed in §19): hard ink water, 40 % of the v7 speed and
// 60 % of its strength, and kept off the menu and the portrait by two screen-space masks.
const SPEED = 0.4;
const STRENGTH = 0.6;
// Soft edge of the masks, CSS px (scaled by the device pixel ratio in the shader).
const MASK_FEATHER = 56;
const MASK_PAD = 24;

const fragmentShader = `
  varying vec2 vUv; uniform float uTime,uDry,uStrength,uFeather; uniform vec4 uMask[2];
  float caustic(vec2 uv,float t){
    vec2 p=mod(uv*6.283,6.283)-250.;
    vec2 i=p; float c=1.;
    for(int n=0;n<3;n++){
      float tt=t*(1.-3.5/float(n+1));
      i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));
      c+=1./length(vec2(p.x/(sin(i.x+tt)/.005),p.y/(cos(i.y+tt)/.005)));
    }
    c/=3.;
    return pow(abs(1.17-pow(c,1.4)),8.);
  }
  // 0 inside the rect (x0, y0, x1, y1 in framebuffer px), 1 beyond the feather.
  float outside(vec4 r){
    vec2 d=max(r.xy-gl_FragCoord.xy,gl_FragCoord.xy-r.zw);
    return smoothstep(0.,uFeather,length(max(d,0.)));
  }
  void main(){
    float v=caustic(vUv*vec2(3.,2.2),uTime*.32);
    vec2 cell=fract(mat2(.707,-.707,.707,.707)*gl_FragCoord.xy/5.)-.5;
    float dots=step(length(cell),.3);
    // Three hard tones: ink, screentone, bright crest.
    vec3 ink=vec3(.02);
    vec3 tone=mix(vec3(.05),vec3(.32),dots);
    vec3 crest=vec3(.72,.71,.68);
    // Raising the thresholds drains the water with hard edges instead of a soft fade.
    vec3 water=v<.12+uDry?ink:v<.42+uDry*2.?tone:crest;
    float keep=uStrength*outside(uMask[0])*outside(uMask[1]);
    gl_FragColor=vec4(mix(ink,water,keep),1.);
  }`;

const NONE = new THREE.Vector4(-1e5, -1e5, -1e5, -1e5);

export function createInkWater() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDry: { value: 0 },
      uStrength: { value: STRENGTH },
      uFeather: { value: MASK_FEATHER },
      uMask: { value: [NONE.clone(), NONE.clone()] },
    },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(46, 26), material);
  mesh.rotation.x = -1.34;
  mesh.position.set(0, -3.4, -4);
  return {
    mesh,
    // masks: page rects { left, right, top, bottom } (CSS px, top/bottom include the scroll offset).
    update(time, dry, masks = [], scroll = 0, viewportH = 0, dpr = 1) {
      material.uniforms.uTime.value = time * SPEED;
      material.uniforms.uDry.value = dry;
      material.uniforms.uFeather.value = MASK_FEATHER * dpr;
      material.uniforms.uMask.value.forEach((target, i) => {
        const r = masks[i];
        if (!r) {
          target.copy(NONE);
          return;
        }
        // gl_FragCoord runs bottom-up in framebuffer pixels.
        target.set(
          (r.left - MASK_PAD) * dpr,
          (viewportH - (r.bottom - scroll) - MASK_PAD) * dpr,
          (r.right + MASK_PAD) * dpr,
          (viewportH - (r.top - scroll) + MASK_PAD) * dpr,
        );
      });
    },
  };
}
