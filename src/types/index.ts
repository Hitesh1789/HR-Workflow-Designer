// Node Types
export type NodeType = 'start' | 'task' | 'approval' | 'auto' | 'end'

//Node Data Interfaces

export interface StartNodeData {
  title: string
  metadata?: Record<string, string>   // key-value pairs
}

export interface TaskNodeData {
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields?: Record<string, string>
}

export interface ApprovalNodeData {
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export interface AutoNodeData {
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndNodeData {
  endMessage: string
  showSummary: boolean //
}

// Union — this means node data can be ANY one of these types
export type AnyNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutoNodeData
  | EndNodeData

//Main Workflow Node
export interface WorkflowNodeData extends Record<string, unknown> {
  nodeType: NodeType
  data: AnyNodeData
  label: string
}

//  Mock API Types

export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface SimulateRequest {
  nodes: Array<{
    id: string
    type: string
    data: WorkflowNodeData
  }>
  edges: Array<{
    id: string
    source: string
    target: string
  }>
}

export interface ExecutionStep {
  stepNumber: number
  nodeId: string
  nodeType: NodeType
  label: string
  status: 'success' | 'error' | 'warning'
  message: string
  detail?: string       
  duration: number
}


export interface SimulateResponse {
  success: boolean
  totalSteps: number
  steps: ExecutionStep[]
  summary: string
  errors: string[]
}