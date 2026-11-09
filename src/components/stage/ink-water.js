import * as THREE from 'three';

const fragmentShader = `
  varying vec2 vUv; uniform float uTime;
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
  void main(){
    float v=caustic(vUv*vec2(3.,2.2),uTime*.32);
    vec2 cell=fract(mat2(.707,-.707,.707,.707)*gl_FragCoord.xy/5.)-.5;
    float dots=step(length(cell),.3);
    // Three hard tones: ink, screentone, bright crest.
    vec3 ink=vec3(.02);
    vec3 tone=mix(vec3(.05),vec3(.32),dots);
    vec3 crest=vec3(.72,.71,.68);
    gl_FragColor=vec4(v<.12?ink:v<.42?tone:crest,1.);
  }`;

export function createInkWater() {
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(46, 26), material);
  mesh.rotation.x = -1.34;
  mesh.position.set(0, -3.4, -4);
  return { mesh, setTime: (time) => { material.uniforms.uTime.value = time; } };
}
