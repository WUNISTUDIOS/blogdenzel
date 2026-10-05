"use client"
import { useState } from "react"
import InitOne from "@/components/initShaderV2"
import { NameTransition } from "../name"
import ShaderControls, { ParamMap, SliderParam } from "@/components/ShaderControls"
import ShaderRecorder from "@/components/ShaderRecorder"

export default function WebShaderV2() {
  const [params, setParams] = useState<ParamMap>({
    tileScale:      { value: 100, min: 1,   max: 300, step: 1,   type: "slider" },
    dimensionScale: { value: 10,  min: 0.1, max: 50,  step: 0.1, type: "slider" },
  })

  const tileScale      = (params.tileScale      as SliderParam).value
  const dimensionScale = (params.dimensionScale as SliderParam).value

  return (
    <ShaderRecorder>
      <InitOne tileScale={tileScale} dimensionScale={dimensionScale} />
      <div className="absolute top-0 left-0 p-8">
        <NameTransition />
      </div>
      {/* <ShaderControls */}
      {/*   title="shaders v2" */}
      {/*   params={params} */}
      {/*   onChange={setParams} */}
      {/* /> */}
    </ShaderRecorder>
  )
}
