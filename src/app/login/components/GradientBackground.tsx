"use client";
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import useResize from '@/app/hooks/useResize';
import useMouse from '@/app/hooks/useMouse';

const BACKGROUND_SHADER = `
    uniform vec2 mpos;
    uniform vec2 size;
    uniform vec3 color1;
    uniform vec3 color2;

    vec3 rgb(in int r, in int g, in int b){
        return vec3(float(r), float(g),float(b)) / 255.;
    }

    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))
                    * 43758.5453123);
    }

    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    void main() {
        vec2 st = (gl_FragCoord.xy + mpos * vec2(-1., 1.) / 5.) / size;
        vec3 color1 = color1 / 255.;
        vec3 color2 = color2 / 255.;
        float t = noise(st * 1.2);
        vec3 col = color1 + (color2 - color1) * t;
        col *= col;

        gl_FragColor = vec4(col, 1.);
    }
`;

interface color {
    r: number,
    g: number,
    b: number
}

const GradientBackground = (props: { color1: color, color2: color }) => {
    // const size = useResize();
    const mouse = useMouse();

    const uniformsRef = useRef<{
        mpos: THREE.Uniform<THREE.Vector2>,
        size: THREE.Uniform<THREE.Vector2>,
        color1: THREE.Uniform<THREE.Vector3>,
        color2: THREE.Uniform<THREE.Vector3>
    }>({
        mpos: new THREE.Uniform(new THREE.Vector2(mouse.position.x, mouse.position.y)),
        // size: new THREE.Uniform(new THREE.Vector2(size.x, size.y)),
        // mpos: new THREE.Uniform(new THREE.Vector2(0, 0)),
        size: new THREE.Uniform(new THREE.Vector2(0, 0)),
        color1: new THREE.Uniform(new THREE.Vector3(props.color1.r, props.color1.g, props.color1.b)),
        color2: new THREE.Uniform(new THREE.Vector3(props.color2.r, props.color2.g, props.color2.b)),
    });

    useEffect(() => {
        uniformsRef.current.mpos.value.set(mouse.position.x, mouse.position.y);
        uniformsRef.current.size.value.set(window.innerWidth, window.innerHeight);
    }, [window.innerWidth, window.innerHeight, mouse.position]);

    return (
        <Canvas style={{ position: 'fixed', width: '100vw', height :'100vh' }}>
            <mesh>
                <planeGeometry args={[innerWidth, innerHeight]} />
                <shaderMaterial uniforms={uniformsRef.current} fragmentShader={BACKGROUND_SHADER} />
            </mesh>
        </Canvas>
    );
};

export default GradientBackground;
