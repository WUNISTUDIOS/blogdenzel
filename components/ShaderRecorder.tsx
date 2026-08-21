'use client'
import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

const SoloContext = createContext(false)
export const useSoloMode = () => useContext(SoloContext)

export default function ShaderRecorder({ children }: { children: React.ReactNode }) {
  const [soloMode, setSoloMode]   = useState(false)
  const [recording, setRecording] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [elapsed, setElapsed]     = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const chunksRef    = useRef<BlobPart[]>([])
  const recorderRef  = useRef<MediaRecorder | null>(null)
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const finalize = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    chunksRef.current   = []
    recorderRef.current = null
    setPreparing(false)
    setRecording(false)
    setSoloMode(false)
    setElapsed(0)
  }, [])

  const stopRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const recorder = recorderRef.current
    if (!recorder || recorder.state === 'inactive') {
      finalize()
      return
    }
    recorder.stop()
  }, [finalize])

  const startRecording = useCallback(() => {
    chunksRef.current = []
    setPreparing(true)  // resize container to 540×960
    setSoloMode(true)   // apply solo layout now so canvas settles before capture

    // Wait 6 frames for R3F to finish resizing and re-layouting
    const wait = (n: number, fn: () => void) =>
      n <= 0 ? fn() : requestAnimationFrame(() => wait(n - 1, fn))

    wait(6, () => {
      const canvas = containerRef.current?.querySelector('canvas')
      if (!canvas) { setPreparing(false); setSoloMode(false); return }

      const stream = (canvas as HTMLCanvasElement).captureStream(60)
      const mimeType = [
        'video/webm;codecs=vp9',
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm',
      ].find(t => MediaRecorder.isTypeSupported(t)) ?? ''

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 50_000_000,
      })

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.addEventListener('stop', () => {
        const ext  = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url  = URL.createObjectURL(blob)
        Object.assign(document.createElement('a'), {
          href:     url,
          download: `shader-${Date.now()}.${ext}`,
        }).click()
        URL.revokeObjectURL(url)
        finalize()
      }, { once: true })

      recorder.addEventListener('error', () => finalize(), { once: true })

      recorderRef.current = recorder
      recorder.start(100)
      setRecording(true)
      setElapsed(0)
      setPreparing(false)

      intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
    })
  }, [finalize])

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const containerStyle: React.CSSProperties = preparing || recording
    ? {
        position:        'fixed',
        top:             '50%',
        left:            '50%',
        width:           '540px',
        height:          '960px',
        transform:       'translate(-50%, -50%)',
        transformOrigin: 'center center',
      }
    : { position: 'fixed', inset: 0 }

  return (
    <SoloContext.Provider value={soloMode}>
      <div ref={containerRef} style={containerStyle}>
        {children}
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`px-3 py-1.5 text-sm rounded border font-mono ${
            recording
              ? 'bg-red-600 border-red-600 text-white'
              : 'bg-transparent border-white/40 text-white hover:border-white'
          }`}
        >
          {recording ? `■ stop  ${elapsed}s` : '● rec'}
        </button>
      </div>
    </SoloContext.Provider>
  )
}
