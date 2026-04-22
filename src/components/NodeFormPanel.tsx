import { useState, useEffect } from 'react'
import { useWorkflow } from '../hooks/useWorkflow'
import type { WorkflowNodeData } from '../types'
import { getAutomations } from '../api/mockApi'

export default function NodeFormPanel() {
  const { selectedNode, updateNodeData } = useWorkflow()

  const [form, setForm] = useState<Record<string, unknown>>({})
  const [automations, setAutomations] = useState<{ id: string; label: string; params: string[] }[]>([])

  // load automations ONCE (correct useEffect usage)
  useEffect(() => {
    getAutomations().then(setAutomations)
  }, [])

  // sync form ONLY when node changes (this is valid usage)
  useEffect(() => {
    if (selectedNode) {
      setForm(selectedNode.data.data)
    }
  }, [selectedNode?.id]) //

  if (!selectedNode) {
    return <div className="p-4 text-gray-400">Select a node</div>
  }

  const nodeType = selectedNode.data.nodeType

  const handleChange = (key: string, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const updated: WorkflowNodeData = {
      ...selectedNode.data,   // keeps nodeType + label
      data: form,
    }

    updateNodeData(selectedNode.id, updated)
  }

  return (
    <div className="w-80 p-4 border-l flex flex-col gap-5 border-gray-100 h-full overflow-y-auto">

      <h2 className="text-white mb-4">
        {selectedNode.data.label}
      </h2>

      {/* START */}
      {nodeType === 'start' && (
        <>
          <input
            className="w-full mb-2"
            placeholder="Title"
            value={(form.title as string) || ''}
            onChange={e => handleChange('title', e.target.value)}
          />
        </>
      )}

      {/* TASK */}
      {nodeType === 'task' && (
        <>
          <input
            placeholder="Title"
            value={(form.title as string) || ''}
            onChange={e => handleChange('title', e.target.value)}
          />
          <input
            placeholder="Description"
            value={(form.description as string) || ''}
            onChange={e => handleChange('description', e.target.value)}
          />
          <input
            placeholder="Assignee"
            value={(form.assignee as string) || ''}
            onChange={e => handleChange('assignee', e.target.value)}
          />
        </>
      )}

      {/* APPROVAL */}
      {nodeType === 'approval' && (
        <>
          <input
            placeholder="Title"
            value={(form.title as string) || ''}
            onChange={e => handleChange('title', e.target.value)}
          />
          <input
            placeholder="Role"
            value={(form.approverRole as string) || ''}
            onChange={e => handleChange('approverRole', e.target.value)}
          />
        </>
      )}

      {/* AUTO */}
      {nodeType === 'auto' && (
        <>
          <select
            value={(form.actionId as string) || ''}
            onChange={e => handleChange('actionId', e.target.value)}
            className="w-full bg-[#1a1d2e] text-white border border-gray-600 
                 rounded px-2 py-1 focus:outline-none focus:ring-2 
                 focus:ring-indigo-500"
          >
            <option value="" className="bg-[#1a1d2e] text-gray-400">
              Select action
            </option>

            {automations.map(a => (
              <option
                key={a.id}
                value={a.id}
                className="bg-[#1a1d2e] text-white"
              >
                {a.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* END */}
      {nodeType === 'end' && (
        <>
          <input
            placeholder="End Message"
            value={(form.endMessage as string) || ''}
            onChange={e => handleChange('endMessage', e.target.value)}
          />
        </>
      )}

      <button
        onClick={handleSave}
        className="mt-4 my-12 bg-indigo-600 text-white px-3 py-1"
      >
        Save
      </button>
    </div>
  )
}