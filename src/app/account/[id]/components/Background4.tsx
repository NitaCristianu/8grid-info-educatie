import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useSize from '@/app/logic/[id]/hooks/useSize';

const BACKGROUND_SHADER = `
    uniform float time;
    uniform vec2 size;
    uniform vec3 color;
    
    
vec3 lightpos = vec3(0),lpRot;
float scatter =0.;
float g;

float sdPlane(vec3 p, vec3 n, float h) {
    return dot(p, n) + h;
}

// https://iquilezles.org/articles/distfunctions
float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

// https://iquilezles.org/articles/distfunctions
float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// https://iquilezles.org/articles/distfunctions
float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

// https://iquilezles.org/articles/smin
float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0);
    return min(a, b) - 0.25*h*h/k;
}

// https://iquilezles.org/articles/smin
float smax(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0);
    return max(a, b) + 0.25*h*h/k;
}

float prod3(vec3 v) {
	return v.x*v.y*v.z;
}

mat3 rot(vec3 axis, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    vec3 a = axis*(1.0 - c);
    vec4 b = vec4(axis*s, c);
    vec2 n = vec2(-1.0, 1.0);
    return mat3(
        axis.xyx*a.xxz + b.wzy*n.yxy,
        axis.yyz*a.xyy + b.zwx*n.yyx,
        axis.xzz*a.zyz + b.yxw*n.xyy
    );
}

float sdCone( vec3 p, vec2 c )
{
    float q = length(p.xy) * 3.;
    return dot(c,vec2(q,p.z));
}

void pR(inout vec2 p,float a) 
{
	p = cos(a)*p+sin(a)*vec2(p.y,-p.x);
}

float rand( float n )
{
  	return fract(cos(n)*4145.92653);
}

float noise(vec2 p)
{
  	vec2 f  = smoothstep(0.0, 1.0, fract(p));
  	p  = floor(p);
  	float n = p.x + p.y*57.0;
  	return mix(mix(rand(n+0.0), rand(n+1.0),f.x), mix( rand(n+57.0), rand(n+58.0),f.x),f.y);
}

float fbm( vec2 p )
{
	mat2 m2 = mat2(1.6,-1.2,1.2,1.6);	
  	float f = 0.5000*noise( p ); p = m2*p;
  	f += 0.5500*noise( p ); p = m2*p;
  	f += 1.1666*noise( p ); p = m2*p;
  	f += 0.0834*noise( p );
  	return f;
}

float map(in vec3 p){
    
    
    const vec2 n = vec2(0.0, 1.0);
    mat3 r = rot(n.yxx, 0.3*time) * rot(n.xyx, 0.5*time) * rot(n.xxy, 0.7*time);
    mat3 r2 = rot(n.yxx, -0.6*time) * rot(n.xyx, -0.2*time) * rot(n.xxy, 0.3*time);
    vec3 t = vec3(vec2(1.0, .75)*sin(vec2(0.6, 0.3)*time), 0.0);
 
    float d = sdTorus(r * (p - t), vec2(.65, .3)+ 0.016*prod3(sin(40.0*p)));
    
    //float s = sdTorus(r * (p - t - lightpos) ,vec2(.75, .5))/length(lpRot*lpRot);
    //scatter += max(-s,0.)*0.4;
    
    d = smin(d, sdTorus(r2 * (p + t), vec2(.65, .3)+ 0.00025*prod3(sin(60.0*p))), .9);
	
    vec3 pp = p;
    pp *= rot(vec3(0., 0., 1.), time * .6); 
   	lpRot=(pp-lightpos);
    pR(lpRot.zx,0.08);
    pR(lpRot.yz,-.5);
	
    float s = sdBox(lpRot, vec3(.9))/length(lpRot*lpRot);
    scatter += max(-s,0.)*0.17;
    
    return d;
}

vec3 calcNormal( in vec3 pos )
{
    const float ep = 0.0001;
    vec2 e = vec2(1.0,-1.0)*0.5773;
    return normalize( e.xyy*map( pos + e.xyy*ep ) + 
					  e.yyx*map( pos + e.yyx*ep ) + 
					  e.yxy*map( pos + e.yxy*ep ) + 
					  e.xxx*map( pos + e.xxx*ep ) );
}


void main(){
    
    float tt=mod(time,62.8318);
    
   	vec3 tot = vec3(.5,0.0,0.0);
    
 
    vec2 p = (-size.xy + 2.0*gl_FragCoord.xy)/size.y;

    vec3 ro = vec3(0.0,2.25,5.0);
    vec3 rd = normalize(vec3(p-vec2(0.0,1.6),-3.5));

    float t = .1;
    for( int i=0; i<64; i++ ){
        vec3 p = ro + t*rd;
        float h = map(p);
        if( abs(h)<0.001 || t>21.0 ) break;
        t+=h;
       
    }
	
    float theta = time * 3.141592 * 0.20;
    lightpos = vec3(5. * cos(theta), 0.7 + 0.2 * sin(theta*2.0),-2.5); 
    
    float fog = smoothstep(0.0, .95, t/5.);
    
    vec4 col = vec4(0.); 

    
	
    
    if( t<21.0 ){
        
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);
        vec3 refl = reflect(rd, nor);
        vec4 r = vec4(color / 255. / 3., 1.);
        float fre = pow( clamp( 1. + dot(nor,rd),0.0,1.0), 2. ); 
        
        col += vec4(color/255., .1)  * scatter * .5 + r * .5;
        col.a = 1.;
    }

    
	gl_FragColor = vec4( col );
    
}
`;

const BackgroundShader = (props: any) => {
    var { size, offset, color } = props;
    color = color || { r: 0, g: 0, b: 0 };
    
    const uniformsRef = useRef({
        time: { value: offset },
        size: { value: new THREE.Vector2(0, 0) },
        color: { value: new THREE.Vector3(color.r, color.g, color.b) }
    });

    // Update the time uniform in each frame
    useFrame(({ clock }) => {
        uniformsRef.current.time.value = clock.getElapsedTime() / 6 + offset;
    });

    // Update the size uniform when the size changes
    useEffect(() => {
        uniformsRef.current.size.value.set(size.x, size.y);
        uniformsRef.current.color.value.set(color.r,color.g,color.b);
    }, [size, props.color]);

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

const Background4 = (props: {
    offset?: number,
    opacity?: number,
    x?: number,
    y?: number,
    color: { r: number, g: number, b: number },

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
                <BackgroundShader size={size} offset={props.offset || 0} color={props.color} />
            </Canvas>
        </div>
    );
};

export default Background4;
