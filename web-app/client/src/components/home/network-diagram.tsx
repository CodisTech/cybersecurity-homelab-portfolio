import { useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node types
const customNodeStyles = {
  router: {
    background: '#1e1e1e',
    color: '#ffffff',
    border: '1px solid #58a6ff',
    borderRadius: '4px',
    padding: '10px',
    width: 150,
  },
  server: {
    background: '#1e1e1e',
    color: '#ffffff',
    border: '1px solid #7ee787',
    borderRadius: '4px',
    padding: '10px',
    width: 150,
  },
  device: {
    background: '#1e1e1e',
    color: '#ffffff',
    border: '1px solid #f97583',
    borderRadius: '4px',
    padding: '10px',
    width: 150,
  },
};

// Custom node component
const CustomNode = ({ data, type }: { data: any, type: string }) => {
  const style = type === 'router' 
    ? customNodeStyles.router 
    : type === 'server' 
      ? customNodeStyles.server 
      : customNodeStyles.device;
  
  return (
    <div style={style}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <i className={`fas ${data.icon} mr-2`} style={{ color: data.iconColor }}></i>
        <strong>{data.label}</strong>
      </div>
      {data.ip && <div style={{ fontSize: '0.75rem' }}>IP: {data.ip}</div>}
      {data.info && <div style={{ fontSize: '0.75rem' }}>{data.info}</div>}
    </div>
  );
};

// Define the initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'router',
    data: { 
      label: 'pfSense Router', 
      ip: '192.168.1.1', 
      icon: 'fa-shield-alt',
      iconColor: '#58a6ff',
      info: 'Firewall/Gateway' 
    },
    position: { x: 250, y: 50 },
    sourcePosition: Position.Bottom,
  },
  {
    id: '2',
    type: 'server',
    data: { 
      label: 'Proxmox Host', 
      ip: '192.168.1.2', 
      icon: 'fa-server',
      iconColor: '#7ee787',
      info: 'VM Host Server' 
    },
    position: { x: 100, y: 200 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '3',
    type: 'server',
    data: { 
      label: 'NAS', 
      ip: '192.168.1.3', 
      icon: 'fa-database',
      iconColor: '#7ee787',
      info: 'Storage Server' 
    },
    position: { x: 400, y: 200 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '4',
    type: 'device',
    data: { 
      label: 'IoT Network', 
      ip: '192.168.2.0/24', 
      icon: 'fa-lightbulb',
      iconColor: '#f97583',
      info: 'VLAN 20' 
    },
    position: { x: 100, y: 350 },
    targetPosition: Position.Top,
  },
  {
    id: '5',
    type: 'device',
    data: { 
      label: 'Media Devices', 
      ip: '192.168.3.0/24', 
      icon: 'fa-tv',
      iconColor: '#f97583',
      info: 'VLAN 30' 
    },
    position: { x: 400, y: 350 },
    targetPosition: Position.Top,
  },
];

// Define the initial edges
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#58a6ff' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#58a6ff' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#7ee787' } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#7ee787' } },
];

const NetworkDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Register custom node types
  const nodeTypes = {
    router: (props: any) => <CustomNode {...props} type="router" />,
    server: (props: any) => <CustomNode {...props} type="server" />,
    device: (props: any) => <CustomNode {...props} type="device" />,
  };
  
  // Handle zoom controls
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const flowInstance = useRef<any>(null);
  
  const onInit = (instance: any) => {
    flowInstance.current = instance;
    setTimeout(() => {
      instance.fitView();
      setIsLoaded(true);
    }, 100);
  };
  
  const zoomIn = () => {
    if (flowInstance.current) {
      flowInstance.current.zoomIn();
    }
  };
  
  const zoomOut = () => {
    if (flowInstance.current) {
      flowInstance.current.zoomOut();
    }
  };
  
  const resetView = () => {
    if (flowInstance.current) {
      flowInstance.current.fitView();
    }
  };
  
  // Load external CSS for FontAwesome
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="relative border border-gray-700 rounded-lg overflow-hidden" style={{ height: 400 }}>
      <div ref={reactFlowWrapper} className="w-full h-full bg-background">
        {isLoaded ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onInit={onInit}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#334155" gap={16} />
            <Controls showInteractive={false} />
          </ReactFlow>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
            <div className="text-center">
              <i className="fas fa-network-wired text-5xl mb-4 text-gray-600"></i>
              <p>Loading network diagram...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          className="px-3 py-1 bg-gray-800 text-xs text-white rounded hover:bg-gray-700"
          onClick={zoomIn}
        >
          <i className="fas fa-plus mr-1"></i> Zoom In
        </button>
        <button
          className="px-3 py-1 bg-gray-800 text-xs text-white rounded hover:bg-gray-700"
          onClick={zoomOut}
        >
          <i className="fas fa-minus mr-1"></i> Zoom Out
        </button>
        <button
          className="px-3 py-1 bg-gray-800 text-xs text-white rounded hover:bg-gray-700"
          onClick={resetView}
        >
          <i className="fas fa-expand mr-1"></i> Reset
        </button>
      </div>
    </div>
  );
};

export default NetworkDiagram;
