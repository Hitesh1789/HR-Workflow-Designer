import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import type { Connection, NodeChange, EdgeChange } from '@xyflow/react'
import type { NodeType, WorkflowNodeData } from '../types'
import {
  onNodesChange as onNodesChangeAction,
  onEdgesChange as onEdgesChangeAction,
  onConnect as onConnectAction,
  addNode as addNodeAction,
  updateNodeData as updateNodeDataAction,
  deleteNode as deleteNodeAction,
  setSelectedNodeId as setSelectedNodeIdAction,
  clearWorkflow as clearWorkflowAction,
  importWorkflow as importWorkflowAction,
} from '../store/workflowSlice'

export function useWorkflow() {
  const dispatch = useDispatch<AppDispatch>()

  //  Read state from Redux
  const nodes         = useSelector((s: RootState) => s.workflow.nodes)
  const edges         = useSelector((s: RootState) => s.workflow.edges)
  const selectedNodeId = useSelector((s: RootState) => s.workflow.selectedNodeId)
  const selectedNode  = nodes.find(n => n.id === selectedNodeId) ?? null

  //  Dispatch actions
  const onNodesChange = (changes: NodeChange[]) =>
    dispatch(onNodesChangeAction(changes))

  const onEdgesChange = (changes: EdgeChange[]) =>
    dispatch(onEdgesChangeAction(changes))

  const onConnect = (connection: Connection) =>
    dispatch(onConnectAction(connection))

  const addNode = (type: NodeType, position: { x: number; y: number }) =>
    dispatch(addNodeAction({ type, position }))

  const updateNodeData = (nodeId: string, data: WorkflowNodeData) =>
    dispatch(updateNodeDataAction({ nodeId, data }))

  const deleteNode = (nodeId: string) =>
    dispatch(deleteNodeAction(nodeId))

  const setSelectedNodeId = (id: string | null) =>
    dispatch(setSelectedNodeIdAction(id))

  const clearWorkflow = () =>
    dispatch(clearWorkflowAction())

  const exportWorkflow = () =>
    JSON.stringify({ nodes, edges }, null, 2)

  const importWorkflow = (json: string) => {
    try {
      const { nodes: n, edges: e } = JSON.parse(json)
      dispatch(importWorkflowAction({ nodes: n, edges: e }))
    } catch {
      alert('Invalid workflow JSON')
    }
  }

  return {
    nodes, edges, selectedNode, selectedNodeId,
    onNodesChange, onEdgesChange, onConnect,
    addNode, updateNodeData, deleteNode,
    setSelectedNodeId, clearWorkflow,
    exportWorkflow, importWorkflow,
  }
}