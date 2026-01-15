"use client"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { PlaneGeometry, Mesh, ShaderMaterial } from "three"

import VShader from '../shaders/vertex.glsl'
import FShader from '../shaders/fragment.glsl'
import SvShader from '../shaders/secondShader/secondvertex.glsl'
import SfShader from '../shaders/secondShader/secondFragment.glsl'
import LightVShader from '../shaders/thirdShader/thirdVertex.glsl'
import LightFShader from '../shaders/thirdShader/thirdFragment.glsl'


function InitShader() {
	const mesh = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)
	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
		}), [])
	useFrame((state) => {
		const { clock } = state
		if (mesh.current) {
			mesh.current.material.uniforms.uTime.value = clock.getElapsedTime()
		}
	})
	return (
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
				wireframe={false}
			/>
			{/* <meshBasicMaterial color={0xffffff} /> */}
		</mesh>

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


