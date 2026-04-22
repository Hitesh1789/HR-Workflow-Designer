import type { NodeType } from '../types'

const nodeTypes: { type: NodeType; label: string }[] = [
  { type: 'start', label: 'Start Node' },
  { type: 'task', label: 'Task Node' },
  { type: 'approval', label: 'Approval Node' },
  { type: 'auto', label: 'Automated Step' },
  { type: 'end', label: 'End Node' },
]

export default function Sidebar() {

  const onDragStart = (event: React.DragEvent, type: NodeType) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-60 h-full border-r border-gray-700 p-4 bg-[#0f1117]">

      <h2 className="text-white text-lg mb-4">
        Nodes
      </h2>

      <div className="flex flex-col gap-3">

        {nodeTypes.map(node => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className="cursor-grab bg-[#1a1d2e] border border-gray-600 
                       text-white px-3 py-2 rounded hover:bg-[#2d3148] transition"
          >
            {node.label}
          </div>
        ))}

      </div>
    </div>
  )
}