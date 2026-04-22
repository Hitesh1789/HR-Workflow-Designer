import { useState } from 'react'
import { useWorkflow } from '../hooks/useWorkflow'
import { simulateWorkflow } from '../api/mockApi'
import type { SimulateResponse } from '../types'

export default function SandboxPanel() {
  const { nodes, edges } = useWorkflow()

  const [result, setResult] = useState<SimulateResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const runSimulation = async () => {
    setLoading(true)
    setResult(null)

    try {
      const payload = {
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type || '',
          data: n.data,
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
      }

      const res = await simulateWorkflow(payload)
      setResult(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-96 h-full border-l border-gray-700 p-4 overflow-y-auto">

      <h2 className="text-white text-lg mb-4">
        Sandbox
      </h2>

      <button
        onClick={runSimulation}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded mb-4"
      >
        {loading ? 'Running...' : 'Run Workflow'}
      </button>

      {/* RESULT */}
      {result && (
        <div className="space-y-3">

          {/* ERROR */}
          {!result.success && (
            <div className="bg-red-900/40 border border-red-500 p-3 rounded">
              <p className="text-red-400 font-semibold mb-2">Errors:</p>
              {result.errors.map((err, i) => (
                <p key={i} className="text-sm text-red-300">
                  • {err}
                </p>
              ))}
            </div>
          )}

          {/* SUCCESS */}
          {result.success && (
            <>
              <p className="text-green-400 font-semibold">
                {result.summary}
              </p>

              <div className="space-y-2">
                {result.steps.map(step => (
                  <div
                    key={step.stepNumber}
                    className="bg-[#1a1d2e] border border-gray-600 p-2 rounded text-sm log-step"
                  >
                    <p className="text-white">
                      Step {step.stepNumber}: {step.label}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {step.message}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      )}
    </div>
  )
}