// src/components/Particles.tsx
import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

///const defaultColors = ['#ffffff'];

///const hexToRgb = (hex: string) => {
  ///const int = parseInt(hex.replace(/^#/, ''), 16);
  ///return [
    ///((int >> 16) & 255) / 255,
    ///((int >> 8) & 255) / 255,
    ///(int & 255) / 255,
  ///];
///};

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec4 random;
attribute vec3 color;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vRandom = random;
  vColor = color;
  
  vec3 pos = position * uSpread;
  pos.z *= 10.0;
  
  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  float t = uTime;
  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
  
  vec4 mvPos = viewMatrix * mPos;
  gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`;
const fragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uAlphaParticles;
varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  
  if(uAlphaParticles < 0.5) {
    if(d > 0.5) {
      discard;
    }
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
  } else {
    float circle = smoothstep(0.5, 0.4, d) * 0.8;
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
  }
}
`;

const Particles = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl);
    camera.position.z = 20;

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 200;
    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(count * 3).map(() => Math.random() * 2 - 1) },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: 10 },
        uBaseSize: { value: 100 },
        uSizeRandomness: { value: 1 },
        uAlphaParticles: { value: 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { geometry, program });
    let t = 0;

    const animate = () => {
      t += 0.01;
      program.uniforms.uTime.value = t;
      renderer.render({ scene: mesh, camera });
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      container.removeChild(gl.canvas);
    };
  }, []);

  return <div ref={containerRef} className={`absolute inset-0 z-0 ${className}`} />;
};

export default Particles;
