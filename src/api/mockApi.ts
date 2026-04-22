import type {
  AutomationAction,
  SimulateRequest,
  SimulateResponse,
  ExecutionStep,
  NodeType,
} from '../types'

//MOCK DATA — fake automations list

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary'] },
  { id: 'update_hrms', label: 'Update HRMS Record', params: ['employeeId', 'field'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'title', 'date'] },
]


// fake network delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

//GET /automations
export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300)   // fake loading time
  return MOCK_AUTOMATIONS
}


function detectCycle(nodeIds: string[], edges: SimulateRequest['edges']): boolean {
  const adj: Record<string, string[]> = {}
  nodeIds.forEach(id => adj[id] = [])
  edges.forEach(e => adj[e.source].push(e.target))

  const visited = new Set<string>()
  const stack = new Set<string>()

  function dfs(node: string): boolean {
    if (stack.has(node)) return true
    if (visited.has(node)) return false

    visited.add(node)
    stack.add(node)

    for (const neighbor of adj[node]) {
      if (dfs(neighbor)) return true
    }

    stack.delete(node)
    return false
  }

  return nodeIds.some(id => dfs(id))
}

//sort nodes in correct order

function topologicalSort(
  nodes: SimulateRequest['nodes'],
  edges: SimulateRequest['edges']
): SimulateRequest['nodes'] {
  // Count incoming arrows for each node
  const inDegree: Record<string, number> = {}
  const adj: Record<string, string[]> = {}
  nodes.forEach(n => { inDegree[n.id] = 0; adj[n.id] = [] })
  edges.forEach(e => {
    adj[e.source].push(e.target)
    inDegree[e.target] = (inDegree[e.target] || 0) + 1
  })

  // Start from nodes with no incoming arrows
  const queue = nodes.filter(n => inDegree[n.id] === 0)
  const result: SimulateRequest['nodes'] = []

  while (queue.length > 0) {
    const node = queue.shift()!
    result.push(node)
    for (const neighbor of adj[node.id]) {
      inDegree[neighbor]--
      if (inDegree[neighbor] === 0) {
        const neighborNode = nodes.find(n => n.id === neighbor)
        if (neighborNode) queue.push(neighborNode)
      }
    }
  }

  return result.length === nodes.length ? result : nodes
}


//build one execution step
function buildStep(
  stepNumber: number,
  node: SimulateRequest['nodes'][0],
  duration: number
): ExecutionStep {
  const type = node.data.nodeType as NodeType

  const messages: Record<NodeType, string> = {
    start: `Workflow initiated — "${node.data.label}"`,
    task: `Task assigned and queued for execution`,
    approval: `Approval request sent to designated approver`,
    auto: (() => {
      const action = (node.data.data as any).actionId

      if (action === 'send_email') {
        return `Email sent successfully`
      }

      if (action === 'generate_doc') {
        return `Document generated`
      }

      if (action === 'send_slack') {
        return `Slack message sent`
      }

      return `Automation executed`
    })(),
    end: `Workflow completed!`,
  }

  const details: Record<NodeType, string> = {
    start: 'Entry point validated. Proceeding to next step.',
    task: 'Assignee notified. Due date set.',
    approval: 'Approval threshold checked. Awaiting response.',
    auto: 'Action executed via automation engine.',
    end: 'All steps completed. Summary report generated.',
  }

  return {
    stepNumber,
    nodeId: node.id,
    nodeType: type,
    label: node.data.label,
    status: 'success',
    message: messages[type],
    detail: details[type],
    duration,
  }
}

//POST /simulate

export async function simulateWorkflow(
  req: SimulateRequest
): Promise<SimulateResponse> {
  await delay(600)
  const errors: string[] = []

  // Validation 1 — empty canvas
  if (req.nodes.length === 0) {
    return {
      success: false, totalSteps: 0,
      steps: [], summary: 'Workflow is empty.',
      errors: ['No nodes found in workflow.']
    }
  }

  // Validation 2 — must have start node
  if (!req.nodes.some(n => n.data.nodeType === 'start')) {
    errors.push('Workflow must have a Start node.')
  }

  // Validation 3 — must have end node
  if (!req.nodes.some(n => n.data.nodeType === 'end')) {
    errors.push('Workflow must have an End node.')
  }

  // Validation 4 — disconnected nodes
  const connectedIds = new Set<string>()
  req.edges.forEach(e => {
    connectedIds.add(e.source)
    connectedIds.add(e.target)
  })
  req.nodes.forEach(n => {
    if (req.nodes.length > 1 && !connectedIds.has(n.id)) {
      errors.push(`Node "${n.data.label}" is disconnected.`)
    }
  })

  // Validation 5 — cycles
  if (detectCycle(req.nodes.map(n => n.id), req.edges)) {
    errors.push('Cycle detected in workflow.')
  }

  // Return errors if any
  if (errors.length > 0) {
    return {
      success: false, totalSteps: 0,
      steps: [], summary: 'Validation failed.',
      errors
    }
  }

  const ordered = topologicalSort(req.nodes, req.edges)
  const steps = ordered.map((node, i) =>
    buildStep(i + 1, node, Math.floor(Math.random() * 200) + 50)
  )

  return {
    success: true,
    totalSteps: steps.length,
    steps,
    summary: `Workflow executed successfully across ${steps.length} steps.`,
    errors: [],
  }
}