"use client"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { PlaneGeometry, Mesh, ShaderMaterial, DoubleSide } from "three"
import { useSoloMode } from './ShaderRecorder'

import VShader from '../shaders/vertex.glsl'
import FShader from '../shaders/fragment.glsl'
import SvShader from '../shaders/secondShader/secondvertex.glsl'
import SfShader from '../shaders/secondShader/secondFragment.glsl'
import LightVShader from '../shaders/thirdShader/thirdVertex.glsl'
import LightFShader from '../shaders/thirdShader/thirdFragment.glsl'
import FourthVShader from '../shaders/fourthShader/fourthVertex.glsl'
import FourthFShader from '../shaders/fourthShader/fourthFragment.glsl'
import FifthVShader from '../shaders/fifthShader/fifthVertex.glsl'
import FifthFShader from '../shaders/fifthShader/fifthFragment.glsl'

interface InitShaderProps {
  tileScale: number
  dimensionScale: number
}

function InitShader({ tileScale, dimensionScale }: InitShaderProps) {
  const { viewport } = useThree()
  const soloMode = useSoloMode()
  const vw = viewport.width * (60 / 100)
  const scale = vw / 35
  const spacing = vw / 3

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

  const uniformsRight = useMemo(
    () => ({ uTime: { value: 0 } }), [])

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
    }
  })

  return (
    <>
      <mesh
        ref={mesh}
        visible={!soloMode}
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
        position={soloMode ? [0, 0, 40] : [-spacing, 0, 40]}
        scale={soloMode ? viewport.width / 10 : scale}
      >
        <planeGeometry args={[10, 10, 200, 200]} />
        <shaderMaterial
          fragmentShader={FourthFShader}
          vertexShader={FourthVShader}
          uniforms={uniformsLeft}
          side={DoubleSide}
        />
      </mesh>

      <mesh
        ref={mesh02}
        visible={!soloMode}
        position={[spacing, 0, 40]}
        scale={scale}
      >
        <planeGeometry args={[10, 10, 200, 200]} />
        <shaderMaterial
          fragmentShader={FifthFShader}
          vertexShader={FifthVShader}
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
    <Canvas gl={{ preserveDrawingBuffer: true }}>
      <OrbitControls enabled={false} />
      <PerspectiveCamera fov={30} position={[0, 0, 100]} makeDefault />
      <InitShader tileScale={tileScale} dimensionScale={dimensionScale} />
    </Canvas>
  )
}
