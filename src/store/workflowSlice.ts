import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { addEdge, applyNodeChanges, applyEdgeChanges,
  type Node, type Edge, type Connection,
  type NodeChange, type EdgeChange,
} from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'
import type {
  NodeType, WorkflowNodeData,
  StartNodeData, TaskNodeData,
  ApprovalNodeData, AutoNodeData, EndNodeData,
} from '../types'

// State Shape
interface WorkflowState {
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
}

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
}

// Default data when node is first dropped
function defaultData(type: NodeType): WorkflowNodeData {
  const defaults: Record<NodeType, WorkflowNodeData> = {
    start: {
      nodeType: 'start',
      label: 'Start',
      data: {
        title: 'Workflow Start',
        metadata: {}
      } as StartNodeData,
    },
    task: {
      nodeType: 'task',
      label: 'Task',
      data: {
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      } as TaskNodeData,
    },
    approval: {
      nodeType: 'approval',
      label: 'Approval',
      data: {
        title: 'Approval Step',
        approverRole: 'Manager',
        autoApproveThreshold: 0
      } as ApprovalNodeData,
    },
    auto: {
      nodeType: 'auto',
      label: 'Automated Step',
      data: {
        title: 'Auto Action',
        actionId: '',
        actionParams: {}
      } as AutoNodeData,
    },
    end: {
      nodeType: 'end',
      label: 'End',
      data: {
        endMessage: 'Workflow Complete!',
        showSummary: true
      } as EndNodeData,
    },
  }
  return defaults[type]
}

// Slice — actions + reducers together
const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    // Called when nodes are moved/selected/deleted
    // React Flow calls this automatically
    onNodesChange(state, action: PayloadAction<NodeChange[]>) {
      state.nodes = applyNodeChanges(
        action.payload,
        state.nodes
      ) as Node[]
    },

    // Called when edges change
    onEdgesChange(state, action: PayloadAction<EdgeChange[]>) {
      state.edges = applyEdgeChanges(
        action.payload,
        state.edges
      ) as Edge[]
    },

    // Called when two nodes are connected
    onConnect(state, action: PayloadAction<Connection>) {
      state.edges = addEdge(
        {
          ...action.payload,
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 }
        },
        state.edges
      )
    },

    // Drop a node on canvas → add it
    addNode(
      state,
      action: PayloadAction<{
        type: NodeType
        position: { x: number; y: number }
      }>
    ) {
      const { type, position } = action.payload
      const newNode: Node = {
        id: uuidv4(),
        type: 'workflowNode',
        position,
        data: defaultData(type)
      }
      state.nodes.push(newNode)
    },

    // Save form → update node data
    updateNodeData(
      state,
      action: PayloadAction<{
        nodeId: string
        data: WorkflowNodeData
      }>
    ) {
      const { nodeId, data } = action.payload
      const node = state.nodes.find(n => n.id === nodeId)
      if (node) {
        node.data = data   // mutate directly — Redux Toolkit handles immutability
      }
    },

    // Delete button → remove node + its edges
    deleteNode(state, action: PayloadAction<string>) {
      const id = action.payload
      state.nodes = state.nodes.filter(n => n.id !== id)
      state.edges = state.edges.filter(
        e => e.source !== id && e.target !== id
      )
      state.selectedNodeId = null
    },

    // Click node → select it
    setSelectedNodeId(state, action: PayloadAction<string | null>) {
      state.selectedNodeId = action.payload
    },

    // Clear all
    clearWorkflow(state) {
      state.nodes = []
      state.edges = []
      state.selectedNodeId = null
    },

    // Import workflow from JSON
    importWorkflow(
      state,
      action: PayloadAction<{ nodes: Node[]; edges: Edge[] }>
    ) {
      state.nodes = action.payload.nodes
      state.edges = action.payload.edges
      state.selectedNodeId = null
    },
  },
})

// Export actions — used in components
export const {
  onNodesChange,
  onEdgesChange,
  onConnect,
  addNode,
  updateNodeData,
  deleteNode,
  setSelectedNodeId,
  clearWorkflow,
  importWorkflow,
} = workflowSlice.actions

// Export reducer — used in store.ts
export default workflowSlice.reducer