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
  // Network Infrastructure
  {
    id: '1',
    type: 'router',
    data: { 
      label: 'Internet', 
      ip: 'WAN', 
      icon: 'fa-globe',
      iconColor: '#58a6ff',
      info: 'ISP Connection' 
    },
    position: { x: 250, y: 0 },
    sourcePosition: Position.Bottom,
  },
  {
    id: '2',
    type: 'router',
    data: { 
      label: 'pfSense Router', 
      ip: '192.168.1.1', 
      icon: 'fa-shield-alt',
      iconColor: '#58a6ff',
      info: 'Firewall/Gateway' 
    },
    position: { x: 250, y: 100 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '3',
    type: 'router',
    data: { 
      label: 'UniFi Switch', 
      ip: '192.168.1.2', 
      icon: 'fa-network-wired',
      iconColor: '#58a6ff',
      info: '24-Port PoE Pro' 
    },
    position: { x: 250, y: 200 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  
  // Servers
  {
    id: '4',
    type: 'server',
    data: { 
      label: 'Proxmox Node 1', 
      ip: '192.168.1.10', 
      icon: 'fa-server',
      iconColor: '#7ee787',
      info: 'Main VM Host' 
    },
    position: { x: 50, y: 300 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '5',
    type: 'server',
    data: { 
      label: 'Proxmox Node 2', 
      ip: '192.168.1.11', 
      icon: 'fa-server',
      iconColor: '#7ee787',
      info: 'Secondary VM Host' 
    },
    position: { x: 200, y: 300 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '6',
    type: 'server',
    data: { 
      label: 'NAS Server', 
      ip: '192.168.1.20', 
      icon: 'fa-database',
      iconColor: '#7ee787',
      info: 'Storage Array' 
    },
    position: { x: 350, y: 300 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '7',
    type: 'server',
    data: { 
      label: 'Backup Server', 
      ip: '192.168.1.21', 
      icon: 'fa-copy',
      iconColor: '#7ee787',
      info: 'Offsite Replication' 
    },
    position: { x: 500, y: 300 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  
  // VLANs and Subnets
  {
    id: '8',
    type: 'device',
    data: { 
      label: 'Management', 
      ip: '192.168.1.0/24', 
      icon: 'fa-cogs',
      iconColor: '#f97583',
      info: 'VLAN 1 (Default)' 
    },
    position: { x: 50, y: 450 },
    targetPosition: Position.Top,
  },
  {
    id: '9',
    type: 'device',
    data: { 
      label: 'IoT Devices', 
      ip: '192.168.20.0/24', 
      icon: 'fa-lightbulb',
      iconColor: '#f97583',
      info: 'VLAN 20' 
    },
    position: { x: 200, y: 450 },
    targetPosition: Position.Top,
  },
  {
    id: '10',
    type: 'device',
    data: { 
      label: 'Media', 
      ip: '192.168.30.0/24', 
      icon: 'fa-tv',
      iconColor: '#f97583',
      info: 'VLAN 30' 
    },
    position: { x: 350, y: 450 },
    targetPosition: Position.Top,
  },
  {
    id: '11',
    type: 'device',
    data: { 
      label: 'Guest Network', 
      ip: '192.168.40.0/24', 
      icon: 'fa-users',
      iconColor: '#f97583',
      info: 'VLAN 40' 
    },
    position: { x: 500, y: 450 },
    targetPosition: Position.Top,
  },
  
  // Wireless
  {
    id: '12',
    type: 'device',
    data: { 
      label: 'UniFi AP 1', 
      ip: '192.168.1.31', 
      icon: 'fa-wifi',
      iconColor: '#d8b4fe',
      info: 'Living Room' 
    },
    position: { x: 150, y: 400 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '13',
    type: 'device',
    data: { 
      label: 'UniFi AP 2', 
      ip: '192.168.1.32', 
      icon: 'fa-wifi',
      iconColor: '#d8b4fe',
      info: 'Office' 
    },
    position: { x: 400, y: 400 },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
];

// Define the initial edges
const initialEdges: Edge[] = [
  // WAN to Router
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#58a6ff' } },
  
  // Router to Switch
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#58a6ff' } },
  
  // Switch to Servers
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#7ee787' } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#7ee787' } },
  { id: 'e3-6', source: '3', target: '6', animated: true, style: { stroke: '#7ee787' } },
  { id: 'e3-7', source: '3', target: '7', animated: true, style: { stroke: '#7ee787' } },
  
  // Switch to APs
  { id: 'e3-12', source: '3', target: '12', animated: true, style: { stroke: '#d8b4fe' } },
  { id: 'e3-13', source: '3', target: '13', animated: true, style: { stroke: '#d8b4fe' } },
  
  // APs to VLANs
  { id: 'e12-9', source: '12', target: '9', animated: false, style: { stroke: '#d8b4fe', strokeDasharray: '5,5' } },
  { id: 'e12-10', source: '12', target: '10', animated: false, style: { stroke: '#d8b4fe', strokeDasharray: '5,5' } },
  { id: 'e12-11', source: '12', target: '11', animated: false, style: { stroke: '#d8b4fe', strokeDasharray: '5,5' } },
  { id: 'e13-9', source: '13', target: '9', animated: false, style: { stroke: '#d8b4fe', strokeDasharray: '5,5' } },
  { id: 'e13-10', source: '13', target: '10', animated: false, style: { stroke: '#d8b4fe', strokeDasharray: '5,5' } },
  { id: 'e13-11', source: '13', target: '11', animated: false, style: { stroke: '#d8b4fe', strokeDasharray: '5,5' } },
  
  // Servers to Management VLAN
  { id: 'e4-8', source: '4', target: '8', animated: false, style: { stroke: '#7ee787', strokeDasharray: '5,5' } },
  { id: 'e5-8', source: '5', target: '8', animated: false, style: { stroke: '#7ee787', strokeDasharray: '5,5' } },
  { id: 'e6-8', source: '6', target: '8', animated: false, style: { stroke: '#7ee787', strokeDasharray: '5,5' } },
  { id: 'e7-8', source: '7', target: '8', animated: false, style: { stroke: '#7ee787', strokeDasharray: '5,5' } },
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
