import * as THREE from 'three';

export function createGrassMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWindStrength: { value: 0.15 },
    },
    vertexShader: /* glsl */ `
      attribute float aCutProgress;
      attribute float aRandom;

      uniform float uTime;
      uniform float uWindStrength;

      varying float vCutProgress;
      varying float vHeight;

      void main() {
        vCutProgress = aCutProgress;
        vHeight = position.y;

        vec3 pos = position;

        // Wind sway - only for standing grass
        float windFactor = 1.0 - aCutProgress;
        float sway = sin(uTime * 2.0 + aRandom * 6.28) * uWindStrength * pos.y * windFactor;
        pos.x += sway;
        pos.z += cos(uTime * 1.5 + aRandom * 3.14) * uWindStrength * 0.5 * pos.y * windFactor;

        // Cut animation - bend forward
        float bendAngle = aCutProgress * 1.5;
        float bendDir = aRandom * 6.28;
        pos.x += sin(bendAngle) * pos.y * cos(bendDir);
        pos.z += sin(bendAngle) * pos.y * sin(bendDir);
        pos.y *= (1.0 - aCutProgress * 0.3);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vCutProgress;
      varying float vHeight;

      void main() {
        // Green to brown gradient based on cut progress
        vec3 greenColor = vec3(0.2, 0.7, 0.15);
        vec3 brownColor = vec3(0.6, 0.45, 0.2);
        vec3 tipColor = vec3(0.3, 0.8, 0.2);

        // Height gradient: darker at base, lighter at tip
        vec3 baseColor = mix(greenColor * 0.6, greenColor, vHeight);
        baseColor = mix(baseColor, tipColor, smoothstep(0.5, 1.0, vHeight));

        // Mix with brown based on cut progress
        vec3 finalColor = mix(baseColor, brownColor * 0.7, vCutProgress);

        // Slight transparency for cut grass
        float alpha = 1.0 - vCutProgress * 0.3;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });
}
