"use client"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { PlaneGeometry, Mesh, ShaderMaterial, DoubleSide } from "three"

import VShader from '../shaders/vertex.glsl'
import FShader from '../shaders/fragment.glsl'
import SvShader from '../shaders/secondShader/secondvertex.glsl'
import SfShader from '../shaders/secondShader/secondFragment.glsl'
import LightVShader from '../shaders/thirdShader/thirdVertex.glsl'
import LightFShader from '../shaders/thirdShader/thirdFragment.glsl'
import FourthVShader from '../shaders/fourthShader/fourthVertex.glsl'
import FourthFShader from '../shaders/fourthShader/fourthFragment.glsl'

interface InitShaderProps {
  tileScale: number
  dimensionScale: number
}

function InitShader({ tileScale, dimensionScale }: InitShaderProps) {
  const { viewport } = useThree()
  const vw = viewport.width * (60 / 100)
  const scale = vw / 35
  const spacing = vw / 3

  const mesh = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
  const mesh01 = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
  const mesh02 = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
  const meshBg = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)

  const uniformsCenter = useMemo(
    () => ({
      uTime: { value: 0 },
      uTileScale: { value: tileScale },
      uDimensionScale: { value: dimensionScale },
      uAlpha: { value: 1.0 },
    }), [])

  const uniformsBg = useMemo(
    () => ({
      uTime: { value: 0 },
      uTileScale: { value: tileScale },
      uDimensionScale: { value: dimensionScale },
      uAlpha: { value: 0.15 },
    }), [])

  const uniformsLeft = useMemo(
    () => ({ uTime: { value: 0 } }), [])

  const uniformsRight = useMemo(
    () => ({ uTime: { value: 0 } }), [])

  useFrame((state) => {
    const { clock } = state
    const t = clock.getElapsedTime()
    if (meshBg.current) {
      meshBg.current.material.uniforms.uTime.value = t
      meshBg.current.material.uniforms.uTileScale.value = tileScale
      meshBg.current.material.uniforms.uDimensionScale.value = dimensionScale
    }
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = t
      mesh.current.material.uniforms.uTileScale.value = tileScale
      mesh.current.material.uniforms.uDimensionScale.value = dimensionScale
    }
    if (mesh01.current) {
      mesh01.current.material.uniforms.uTime.value = t
    }
    if (mesh02.current) {
      mesh02.current.material.uniforms.uTime.value = t
    }
  })

  return (
    <>
      <mesh
        ref={meshBg}
        position={[0, 0, 0]}
        scale={[viewport.width / 10, viewport.height / 10, 1]}
      >
        <planeGeometry args={[10, 10, 50, 50]} />
        <shaderMaterial
          fragmentShader={SfShader}
          vertexShader={SvShader}
          uniforms={uniformsBg}
          side={DoubleSide}
          transparent
        />
      </mesh>

      <mesh
        ref={mesh}
        position={[0, 0, 40]}
        scale={scale}
      >
        <planeGeometry args={[10, 10, 200, 200]} />
        <shaderMaterial
          fragmentShader={SfShader}
          vertexShader={SvShader}
          uniforms={uniformsCenter}
          side={DoubleSide}
        />
      </mesh>

      <mesh
        ref={mesh01}
        position={[-spacing, 0, 40]}
        scale={scale}
      >
        <planeGeometry args={[10, 10, 200, 200]} />
        <shaderMaterial
          fragmentShader={LightFShader}
          vertexShader={LightVShader}
          uniforms={uniformsLeft}
          side={DoubleSide}
        />
      </mesh>

      <mesh
        ref={mesh02}
        position={[spacing, 0, 40]}
        scale={scale}
      >
        <planeGeometry args={[10, 10, 200, 200]} />
        <shaderMaterial
          fragmentShader={FourthFShader}
          vertexShader={FourthVShader}
          uniforms={uniformsRight}
          side={DoubleSide}
        />
      </mesh>
    </>
  )
}

interface InitOneProps {
  tileScale: number
  dimensionScale: number
}

export default function InitOne({ tileScale, dimensionScale }: InitOneProps) {
  return (
    <Canvas>
      <OrbitControls enabled={false} />
      <PerspectiveCamera fov={30} position={[0, 0, 100]} makeDefault />
      <InitShader tileScale={tileScale} dimensionScale={dimensionScale} />
    </Canvas>
  )
}
