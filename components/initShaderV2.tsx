"use client"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { PlaneGeometry, Mesh, ShaderMaterial, DoubleSide } from "three"
import { useSoloMode } from './ShaderRecorder'

import VShader from '../shaders/vertex.glsl'
import FShader from '../shaders/fragment.glsl'
import LightVShader from '../shaders/thirdShader/thirdVertex.glsl'
import LightFShader from '../shaders/thirdShader/thirdFragment.glsl'
import StarVShader from '../shaders/sixthShader/sixthVertex.glsl'
import StarFShader from '../shaders/sixthShader/sixthFragment.glsl'

interface InitShaderProps {
  tileScale: number
  dimensionScale: number
}

function InitShader({ tileScale, dimensionScale }: InitShaderProps) {
  const { viewport } = useThree()
  const soloMode = useSoloMode()

  // portrait canvas (phone, or narrow browser) → stack vertically
  // skip while recording: the 540×960 recorder container is portrait too
  const stacked = !soloMode && viewport.aspect < 1

  const vw = viewport.width * 0.6
  const vh = viewport.height * 0.6
  const scale = stacked ? Math.min(vh / 35, vw / 12) : vw / 35
  const spacing = stacked ? vh / 3 : vw / 3

  // offset along the row (x) or the column (y)
  const at = (i: number): [number, number, number] =>
    stacked ? [0, -i * spacing, 40] : [i * spacing, 0, 40]

  const mesh = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
  const mesh01 = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
  const mesh02 = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)

  const uniformsCenter = useMemo(
    () => ({
      uTime: { value: 0 },
      uTileScale: { value: tileScale },
      uDimensionScale: { value: dimensionScale },
      uAlpha: { value: 1.0 },
    }), [])

  const uniformsLeft = useMemo(
    () => ({ uTime: { value: 0 } }), [])

  const uniformsStar = useMemo(
    () => ({
      uTime: { value: 0 },
      uStarTileScale: { value: tileScale },
      uStarDimensionScale: { value: dimensionScale },
      uStarAlpha: { value: 1.0 },
    }), [])

  useFrame((state) => {
    const { clock } = state
    const t = clock.getElapsedTime()
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
      mesh02.current.material.uniforms.uStarTileScale.value = tileScale
      mesh02.current.material.uniforms.uStarDimensionScale.value = dimensionScale
    }
  })

  return (
    <>
      <mesh
        ref={mesh}
        visible={!soloMode}
        position={at(0)}
        scale={scale}
      >
        <planeGeometry args={[10, 10, 200, 200]} />
        <shaderMaterial
          fragmentShader={FShader}
          vertexShader={VShader}
          uniforms={uniformsCenter}
          side={DoubleSide}
        />
      </mesh>

       <mesh
        ref={mesh01}
        position={soloMode ? [0, 0, 40] : at(-1)}
        scale={soloMode ? viewport.width / 10 : scale}
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
        position={at(1)}
        scale={soloMode ? viewport.width / 10 : scale}
      >
        <planeGeometry args={[10, 10, 200, 200]} />
        <shaderMaterial
          fragmentShader={StarFShader}
          vertexShader={StarVShader}
          uniforms={uniformsStar}
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
    <Canvas gl={{ preserveDrawingBuffer: true }}>
      <OrbitControls enabled={false} />
      <PerspectiveCamera fov={30} position={[0, 0, 100]} makeDefault />
      <InitShader tileScale={tileScale} dimensionScale={dimensionScale} />
    </Canvas>
  )
}
