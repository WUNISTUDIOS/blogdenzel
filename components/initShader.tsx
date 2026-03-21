"use client"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
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

function InitShader() {
	const mesh = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
	const mesh01 = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
	const mesh02 = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
		}), [])
	useFrame((state) => {
		const { clock } = state
		const t = clock.getElapsedTime()
		if (mesh.current) {
			mesh.current.material.uniforms.uTime.value = t
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
				position={[0, 0, 0]}
				scale={1.5}
			>
				<planeGeometry args={[10, 10, 200, 200]} />
				<shaderMaterial
					fragmentShader={LightFShader}
					vertexShader={LightVShader}
					uniforms={uniforms}
				/>
			</mesh>

			<mesh
				ref={mesh01}
				position={[0, 20, 0]}
				scale={1.5}
			>
				<planeGeometry args={[10, 10, 200, 200]} />
				<shaderMaterial
					fragmentShader={SfShader}
					vertexShader={SvShader}
					uniforms={uniforms}
				/>
			</mesh>

      <mesh
				ref={mesh02}
				position={[0, -20, 0]}
				scale={1.5}
			>
				<planeGeometry args={[10, 10, 200, 200]} />
				<shaderMaterial
					fragmentShader={FourthFShader}
					vertexShader={FourthVShader}
					uniforms={uniforms}
				/>
			</mesh>
		</>
	)
}
export default function InitOne() {
	return (
		<Canvas>
			<OrbitControls />
			<PerspectiveCamera fov={30} position={[0, 0, 100]} makeDefault />
			<InitShader />
		</Canvas>

	)
}


