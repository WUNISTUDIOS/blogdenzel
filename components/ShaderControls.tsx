"use client"
import { useState, useCallback } from "react"
import styles from "./ShaderControls.module.css"

// ── Param config types ──────────────────────────────────────────────────────

export type SliderParam = {
  type?: "slider"
  value: number
  min?: number
  max?: number
  step?: number
}

export type ColorParam = {
  type: "color"
  value: string
}

export type ToggleParam = {
  type: "toggle"
  value: boolean
}

export type SelectParam = {
  type: "select"
  value: string
  options: string[]
}

export type SectionParam = {
  type: "section"
  label?: string
}

export type ParamConfig = SliderParam | ColorParam | ToggleParam | SelectParam | SectionParam

export type ParamMap = Record<string, ParamConfig>

// ── Sub-controls ────────────────────────────────────────────────────────────

function SliderControl({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.001,
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  const decimals = step < 0.01 ? 3 : step < 0.1 ? 2 : 1
  return (
    <>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value.toFixed(decimals)}</div>
      <div className={styles.sliderWrap}>
        <input
          className={styles.slider}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ ["--sc-pct" as string]: `${pct}%` }}
          onChange={e => onChange(parseFloat(e.target.value))}
        />
      </div>
    </>
  )
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      <div className={styles.colorWrap}>
        <div className={styles.colorSwatch} style={{ background: value }}>
          <input
            className={styles.colorInput}
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        </div>
        <span className={styles.colorLabel}>{value}</span>
      </div>
    </>
  )
}

function ToggleControl({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className={styles.toggleWrap}>
      <div className={styles.label}>{label}</div>
      <div
        className={`${styles.toggle} ${value ? styles.toggleOn : ""}`}
        onClick={() => onChange(!value)}
      >
        <div className={styles.toggleThumb} />
      </div>
    </div>
  )
}

function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      <select
        className={styles.select}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

interface ShaderControlsProps {
  title?: string
  params: ParamMap
  onChange: (updater: (prev: ParamMap) => ParamMap) => void
  style?: React.CSSProperties
}

export default function ShaderControls({
  title = "uniforms",
  params = {},
  onChange,
  style,
}: ShaderControlsProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleChange = useCallback(
    (key: string, val: number | string | boolean) => {
      onChange(prev => ({
        ...prev,
        [key]: { ...prev[key], value: val } as ParamConfig,
      }))
    },
    [onChange]
  )

  return (
    <div className={`${styles.root} ${collapsed ? styles.collapsed : ""}`} style={style}>
      <div className={styles.header} onClick={() => setCollapsed(c => !c)}>
        <div className={styles.dot} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.rule} />
      <div className={styles.body}>
        {Object.entries(params).map(([key, cfg]) => {
          if (cfg.type === "section") {
            return (
              <div key={key} className={styles.row}>
                <div className={styles.sectionRule} />
                <div className={styles.sectionLabel}>{cfg.label ?? key}</div>
              </div>
            )
          }
          return (
            <div key={key} className={styles.row}>
              {(cfg.type === "slider" || cfg.type === undefined) && (
                <SliderControl
                  label={key}
                  value={(cfg as SliderParam).value}
                  min={(cfg as SliderParam).min}
                  max={(cfg as SliderParam).max}
                  step={(cfg as SliderParam).step}
                  onChange={v => handleChange(key, v)}
                />
              )}
              {cfg.type === "color" && (
                <ColorControl
                  label={key}
                  value={(cfg as ColorParam).value}
                  onChange={v => handleChange(key, v)}
                />
              )}
              {cfg.type === "toggle" && (
                <ToggleControl
                  label={key}
                  value={(cfg as ToggleParam).value}
                  onChange={v => handleChange(key, v)}
                />
              )}
              {cfg.type === "select" && (
                <SelectControl
                  label={key}
                  value={(cfg as SelectParam).value}
                  options={(cfg as SelectParam).options}
                  onChange={v => handleChange(key, v)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
