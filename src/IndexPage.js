import React, { useRef, useEffect, useState, Suspense } from "react";
import { Section } from "./components/section";
import state from "./components/state";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useProgress, useGLTFLoader } from "@react-three/drei";
import { a, useTransition } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import Classes from './LogIn.module.css'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import { useGLTF } from '@react-three/drei'
import SignUp from "./SignUp";
import LogIn from "./LogIn"
import Home from "./Home"
// import {AuthProvider} from './Context/AuthContext'
import "./3DStyles.css";
function Model({ url }) {
  const gltf = useLoader( GLTFLoader , url);
  return <primitive object={gltf.scene} dispose={null} />;
}

const Lights = () => {
  return (
    <>
      {/* Ambient Light illuminates lights for all objects */}
      <ambientLight intensity={0.3} />
      {/* Diretion light 10 10 5  0 10 0 */}
      <directionalLight position={[10 , 10 , 5 ]} intensity={1} />
      <directionalLight
        castShadow position={[0, 10, 0]} intensity={1.5} shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-far={50} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Spotlight Large overhead light */}
      <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
    </>
  );
};




  function ModelO(props) {
    const group = useRef()
    useFrame((state, delta) => (group.current.rotation.y += 0.01))
    return (
      <group  {...props} dispose={null} >
        {/* <mesh castShadow receiveShadow geometry={nodes.Curve007_1.geometry} material={materials['Material.001']} />
        <mesh castShadow receiveShadow geometry={nodes.Curve007_2.geometry} material={materials['Material.002']} /> */}
        <mesh ref={group} position={[5, 0, -10]} scale={[.1,.1,.1]}><Model url='/guitar5/scene.gltf' ></Model></mesh>
        <Html>
            <Router>
                            <Switch>
                                <Route path="/" exact component={LogIn}></Route>
                                <Route path="/signup" exact component={SignUp}></Route>                    
                            </Switch>
            </Router>
        </Html>
      </group>
    )
  }


export default function App() {

  return (
    <>
      {/* R3F Canvas */}
      <Canvas concurrent colorManagement camera={{ position: [0, 0, 0], fov: 70 }}>
        {/* Lights Component */}
        <Lights />
        <Suspense fallback={null}>
          
        
        <ModelO position={[1,0,0]}></ModelO>
        </Suspense>
      </Canvas>
    </>
  );
}
