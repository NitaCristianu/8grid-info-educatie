import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useSize from '@/app/logic/[id]/hooks/useSize';

const BACKGROUND_SHADER = `
    uniform float time;
    uniform vec2 size;
    
    #define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a)
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash( vec2 p )
{
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
	return fract(sin(p)*43758.5453);
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                        dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                   mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                        dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
	return 0.5 + 0.5*n;
}


void main()
{
    vec2 uv = gl_FragCoord.xy/size.xy;
    float ratio = size.x / size.y;

    vec2 tuv = uv;
    tuv -= .5;

    float degree = noise(vec2(time*.1, tuv.x*tuv.y));

    tuv.y *= 1./ratio;
    tuv *= Rot(radians((degree-.5)*720.+180.));
	tuv.y *= ratio;

    
    float frequency = 5.;
    float amplitude = 30.;
    float speed = time * 2.;
    tuv.x += sin(tuv.y*frequency+speed)/amplitude;
   	tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);

    vec3 colorYellow = vec3(.957, .804, .623) / 2.;
    vec3 colorDeepBlue = vec3(.192, .484, .933) / 2.;
    vec3 layer1 = mix(colorYellow, colorDeepBlue, S(-.3, .2, (tuv*Rot(radians(-5.))).x));
    
    vec3 colorRed = vec3(.910, .110, .1) / 3.;
    vec3 colorBlue = vec3(0.350, .71, .953) / 7.;
    vec3 layer2 = mix(colorRed, colorBlue, S(-.3, .6, (tuv*Rot(radians(-5.))).x));
    
    vec3 finalComp = mix(layer1, layer2, S(.5, -.3, tuv.y));
    
    vec3 col = finalComp;
    
    vec2 center = vec2(0.0, 0.0);
    float dist = 1.- length( (uv - 0.5) * vec2(ratio, 1.0));
    float fade = smoothstep(0.0, 1., dist) * 1.2;
    col *= fade;

    gl_FragColor = vec4(col,1.);
}
`;

const BackgroundShader = (props: any) => {
    const { size, offset } = props;
    const uniformsRef = useRef({
        time: { value: offset },
        size: { value: new THREE.Vector2(0, 0) }
    });

    // Update the time uniform in each frame
    useFrame(({ clock }) => {
        uniformsRef.current.time.value = clock.getElapsedTime() + offset;
    });

    // Update the size uniform when the size changes
    useEffect(() => {
        uniformsRef.current.size.value.set(size.x, size.y);
    }, [size]);

    return (
        <mesh>
            <planeGeometry args={[window.innerWidth, window.innerHeight]} />
            <shaderMaterial
                uniforms={uniformsRef.current}
                fragmentShader={BACKGROUND_SHADER}
            />
        </mesh>
    );
};

const Background3 = (props: {
    offset?: number,
    opacity?: number,
    x?: number,
    y?: number

}) => {
    const size = useSize();

    return (
        <div
            style={
                {
                    marginLeft: (props.x || 0) * size.x,
                    marginTop: (props.y || 0) * size.y,
                    opacity: props.opacity
                }
            }

        >
            <Canvas style={{ position: 'fixed', width: size.x, height: size.y }}>
                <BackgroundShader size={size} offset={props.offset || 0} />
            </Canvas>
        </div>
    );
};

export default Background3;
