import { Handle, Position } from '@xyflow/react'
import type { WorkflowNodeData } from '../types'

interface Props {
  data: WorkflowNodeData
}

export default function WorkflowNode({ data }: Props) {
  const { nodeType, label } = data

  const colors: Record<string, string> = {
    start: 'bg-green-600',
    task: 'bg-blue-600',
    approval: 'bg-yellow-600',
    auto: 'bg-purple-600',
    end: 'bg-red-600',
  }

  const actionLabels: Record<string, string> = {
    send_email: 'Send Email',
    generate_doc: 'Generate Document',
    send_slack: 'Send Slack Message',
    create_ticket: 'Create JIRA Ticket',
    update_hrms: 'Update HRMS Record',
    schedule_meeting: 'Schedule Meeting',
  }

  const d = data.data as any

  const displayText =
    data.nodeType === 'end'
      ? d.endMessage
      : data.nodeType === 'auto'
        ? actionLabels[d.actionId] || 'Auto'
        : d.title

  return (
    <div className="rounded shadow-md border border-gray-600 bg-[#1a1d2e] text-white text-sm min-w-[150px]">

      {/* TOP HANDLE */}
      {nodeType !== 'start' && (
        <Handle type="target" position={Position.Top} />
      )}

      {/* BODY */}
      <div className={`px-3 py-2 ${colors[nodeType] || 'bg-gray-600'}`}>
        {displayText || label}
      </div>

      {/* FOOTER */}
      <div className="px-3 py-2 text-xs text-gray-300">
        {nodeType.toUpperCase()}
      </div>
      {/* BOTTOM HANDLE */}
      {nodeType !== 'end' && (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  )
}