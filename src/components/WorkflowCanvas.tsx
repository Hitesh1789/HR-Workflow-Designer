import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
} from '@xyflow/react'
import { useCallback } from 'react'
import { useWorkflow } from '../hooks/useWorkflow'
import WorkflowNode from './WorkflowNode'
import type { NodeType } from '../types'

const nodeTypes = {
  workflowNode: WorkflowNode,
}

export default function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
  } = useWorkflow()

  const { screenToFlowPosition } = useReactFlow()

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData(
        'application/reactflow'
      ) as NodeType

      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      addNode(type, position)
    },
    [screenToFlowPosition, addNode]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div className="w-full h-full">

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}