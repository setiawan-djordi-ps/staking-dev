'use client'
import React, { useMemo, useRef } from 'react'
import styles from './gradient.module.scss';
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three';


const vertexShader = `
  attribute float aProgress;
  attribute float aSize;
  attribute float aAlpha;

  varying float vAlpha;

  //
  // GLSL textureless classic 3D noise "cnoise",
  // with an RSL-style periodic variant "pnoise".
  // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
  // Version: 2011-10-11
  //
  // Many thanks to Ian McEwan of Ashima Arts for the
  // ideas for permutation and gradient selection.
  //
  // Copyright (c) 2011 Stefan Gustavson. All rights reserved.
  // Distributed under the MIT license. See LICENSE file.
  // https://github.com/ashima/webgl-noise
  //

  vec3 mod289(vec3 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise
  float cnoise(vec3 P)
  {
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor[5];
  varying vec3 vColor;

  void main() {
    vUv = uv;

    vec2 noiseCoord = uv*vec2(5.,6.);

    float tilt = -0.8*uv.y;

    float incline = uv.x*0.5;

    float offset = incline*mix(-.25,0.25,uv.y);

    float noise = cnoise(vec3(noiseCoord.x + uTime * 0.2, noiseCoord.y, uTime * 0.2));
    
    noise = max(0.,noise);

    vec3 pos = vec3(position.x, position.y, position.z + noise * 2.0 + tilt + incline + offset);

    
    vColor = uColor[0];

    for(int i = 0; i < 4; i++){
      
      float noiseFlow = 1. + float(i) * 0.5;
      float noiseSpeed = 1. + float(i) * 0.5;

      float noiseSeed = 2. + float(i) * 0.3;
      vec2 noiseFreq = vec2(0.5,0.5);

      float noiseFloor = 0.01;
      float noiseCeil = 0.6 + float(i) * 0.07;

      float noise = smoothstep(noiseFloor,noiseCeil,cnoise(
          vec3(
            noiseCoord.x*noiseFreq.x + uTime*noiseFlow,
            noiseCoord.y*noiseFreq.y, 
            uTime * noiseSpeed + noiseSeed
          )
        )
      );

      vColor = mix(vColor,uColor[i],noise);


    }


    vec4 modelPosition = modelMatrix * vec4(pos,1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition; 

  }
`;

const fragmentShader =  `
  varying vec2 vUv;
  varying vec3 vColor;

  void main() {
  
    gl_FragColor = vec4(vColor,1.0);
  } 
`;




const Gradient = () => {
  const mesh = useRef<any>(null);

  const colorsScheme = ['#33CB98','#2EBAE2','#FFFFFF','#84D47E','#038EF5'];
  const pallete = colorsScheme.map((color) => new THREE.Color(color));

  const uniforms = useMemo(() => ({
    uTime:{
      value:0
    },
    uSize:{
      value: new THREE.Vector2()
    },
    uColor: { value: pallete },
    
  }),[]);

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.uTime.value = clock.getElapsedTime() * 0.1;
  });

  return <mesh ref={mesh} >
      <planeGeometry args={[40,40,100,100]}/>
      <shaderMaterial 
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
  </mesh>
}

const Scene = () => (
  <Canvas camera={{ fov: 75, position: [0, 0, 10] }}>
    {/* <OrbitControls/> */}
    <Gradient />
  </Canvas>
)


interface props {
    isGradient?:boolean,
    mask?:boolean
}


const GradientShader = ({isGradient = false,mask}:props) => {
  return (
    <div className={styles['gradient-container']}>
      {
          isGradient ? <>
            <img src={`${mask ? '/mask.png' : '/mask_1.png'}`} alt="gradient mask" className={styles['gradient-mask']} draggable="false"/>
            <Scene/>
          </>
          :
          <picture>
            <source media="(max-width: 600px)" srcSet="/background/bg-mobile.png"/>
            <img src="/background/bg.png" alt="gradient mask" className={styles['gradient-mask']} draggable="false"/>
          </picture>
      }
    </div>
  )
}

export default GradientShader