import { ReactFlowProvider } from '@xyflow/react'

import WorkflowCanvas from './components/WorkflowCanvas'
import Sidebar from './components/Sidebar'
import NodeFormPanel from './components/NodeFormPanel'
import SandboxPanel from './components/SandboxPanel'

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen">

        {/* LEFT */}
        <Sidebar />

        {/* CENTER */}
        <div className="flex-1">
          <WorkflowCanvas />
        </div>

        {/* RIGHT */}
        <NodeFormPanel />
        <SandboxPanel />

      </div>
    </ReactFlowProvider>
  )
}