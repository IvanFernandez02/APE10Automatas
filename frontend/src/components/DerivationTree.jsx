import { useEffect, useRef, useCallback, useState } from 'react';
import cytoscape from 'cytoscape';

/**
 * Calcula las posiciones (x,y) de cada nodo para garantizar estrictamente
 * el orden de izquierda a derecha (siblings order) del árbol de sintaxis.
 */
const calculateTreeElements = (rootTree) => {
  let currentX = 0;
  const X_SPACING = 85;  // Espaciado horizontal entre nodos
  const Y_SPACING = 110; // Espaciado vertical entre niveles

  // 1. Asignar posiciones de forma recursiva (in-order like para X, por nivel para Y)
  function assignPositions(node, depth = 0) {
    if (!node) return null;
    
    const newNode = { ...node, children: [] };
    
    // Si es nodo hoja (terminal o sin hijos)
    if (!node.children || node.children.length === 0) {
      newNode.position = { x: currentX, y: depth * Y_SPACING };
      currentX += X_SPACING;
      return newNode;
    }
    
    // Recursión a los hijos
    newNode.children = node.children.map(child => assignPositions(child, depth + 1));
    
    // El padre se centra respecto a sus hijos
    const firstChildX = newNode.children[0].position.x;
    const lastChildX = newNode.children[newNode.children.length - 1].position.x;
    
    newNode.position = { x: (firstChildX + lastChildX) / 2, y: depth * Y_SPACING };
    return newNode;
  }

  const positionedTree = assignPositions(rootTree);
  
  // 2. Aplanar el árbol para Cytoscape
  function flatten(node, elements = { nodes: [], edges: [] }, parentId = null) {
    if (!node) return elements;

    const nodeId = node.id || `node-${elements.nodes.length}`;
    
    let displayLabel = node.label;
    if (node.type === 'terminal' && node.value && node.value !== node.label) {
      displayLabel = `${node.label}\n${node.value}`;
    }

    elements.nodes.push({
      data: {
        id: nodeId,
        label: node.label,
        value: node.value || '',
        type: node.type,
        productionId: node.productionId || '',
        displayLabel: displayLabel
      },
      position: node.position
    });

    if (parentId) {
      elements.edges.push({
        data: {
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId
        }
      });
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach(child => flatten(child, elements, nodeId));
    }

    return elements;
  }

  return flatten(positionedTree);
};

export default function DerivationTree({ tree }) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Redibujar/Ajustar el lienzo si el tamaño de la ventana cambia
      if (cyRef.current) {
        setTimeout(() => {
          cyRef.current.resize();
          cyRef.current.animate({ fit: { padding: 60 }, duration: 250 });
        }, 100);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (wrapperRef.current) {
        wrapperRef.current.requestFullscreen().catch(err => {
          console.error(`Error entering fullscreen: ${err.message}`);
        });
      }
    } else {
      document.exitFullscreen();
    }
  };

  const initCytoscape = useCallback(() => {
    if (!containerRef.current || !tree) return;

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const elements = calculateTreeElements(tree);

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [...elements.nodes, ...elements.edges],
      style: [
        /* ───── Non-terminal nodes: rectangle with strict borders ───── */
        {
          selector: 'node[type = "nonterminal"]',
          style: {
            'shape': 'rectangle',
            'width': 80,
            'height': 40,
            'background-color': '#132B45',
            'border-width': 1,
            'border-color': '#E2E8F0',
            'label': 'data(displayLabel)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#E2E8F0',
            'font-size': '9px',
            'font-family': "'Inter', sans-serif",
            'font-weight': '600',
            'text-wrap': 'wrap',
            'text-max-width': '60px',
            'overlay-opacity': 0,
            'transition-property': 'border-color, border-width, background-color',
            'transition-duration': '0.2s'
          }
        },
        /* ───── Terminal nodes: smaller rectangles ───── */
        {
          selector: 'node[type = "terminal"]',
          style: {
            'shape': 'rectangle',
            'width': 70,
            'height': 30,
            'background-color': '#0B192C',
            'border-width': 1,
            'border-color': '#4FD1C5',
            'label': 'data(displayLabel)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#4FD1C5',
            'font-size': '8px',
            'font-family': "'JetBrains Mono', monospace",
            'font-weight': '500',
            'text-wrap': 'wrap',
            'text-max-width': '55px',
            'overlay-opacity': 0,
            'transition-property': 'border-color, border-width, background-color',
            'transition-duration': '0.2s'
          }
        },
        /* ───── Edges: orthogonal schematic lines ───── */
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#27486B',
            'target-arrow-color': '#27486B',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1,
            'curve-style': 'taxi',
            'taxi-direction': 'downward',
            'taxi-turn': 20,
            'taxi-turn-min-distance': 5,
            'line-opacity': 1,
            'transition-property': 'line-color, target-arrow-color, width',
            'transition-duration': '0.2s'
          }
        },

        /* ───── Hover states ───── */
        {
          selector: 'node:active',
          style: {
            'overlay-opacity': 0.08,
            'overlay-color': '#7c5cfc'
          }
        },

        /* ───── Highlighted subtree ───── */
        {
          selector: 'node.highlighted[type = "nonterminal"]',
          style: {
            'border-width': 2,
            'border-color': '#FFC857',
            'background-color': '#20456D',
            'color': '#ffffff',
            'font-weight': '700'
          }
        },
        {
          selector: 'node.highlighted[type = "terminal"]',
          style: {
            'border-width': 2,
            'border-color': '#4FD1C5',
            'background-color': '#0B192C',
            'color': '#4FD1C5',
            'font-weight': '700'
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'width': 2,
            'line-color': '#FFC857',
            'target-arrow-color': '#FFC857',
            'line-opacity': 1
          }
        },

        /* ───── Dimmed (when a subtree is selected) ───── */
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.2
          }
        },

        /* ───── Root node special style ───── */
        {
          selector: 'node[type = "nonterminal"][!_parent]',
          style: {}
        }
      ],
      layout: {
        name: 'preset',
        fit: true,
        padding: 60,
        animate: true,
        animationDuration: 300
      },
      minZoom: 0.2,
      maxZoom: 4,
      wheelSensitivity: 0.75, // <--- Faster zooming (was 0.25)
      boxSelectionEnabled: false,
      autounselectify: false,
      userPanningEnabled: true,
      userZoomingEnabled: true
    });

    // Make root node slightly bigger
    const rootNode = cyRef.current.nodes().first();
    if (rootNode) {
      rootNode.style({
        'width': 80,
        'height': 80,
        'border-width': 3,
        'font-size': '10px',
        'border-color': '#9b7dff'
      });
    }

    // Click on node to highlight subtree
    cyRef.current.on('tap', 'node', function (evt) {
      const node = evt.target;
      const cy = cyRef.current;

      cy.elements().removeClass('highlighted dimmed');

      const subtree = node.successors().union(node);
      const others = cy.elements().difference(subtree);

      subtree.addClass('highlighted');
      others.addClass('dimmed');
    });

    // Click background to reset
    cyRef.current.on('tap', function (evt) {
      if (evt.target === cyRef.current) {
        cyRef.current.elements().removeClass('highlighted dimmed');
      }
    });

    // Hover tooltip with production ID
    cyRef.current.on('mouseover', 'node', function (evt) {
      const node = evt.target;
      const prod = node.data('productionId');
      if (prod) {
        node.style('border-width', 2);
      }
    });
    cyRef.current.on('mouseout', 'node', function (evt) {
      const node = evt.target;
      if (!node.hasClass('highlighted')) {
        node.style('border-width', 1);
      }
    });

  }, [tree]);

  useEffect(() => {
    initCytoscape();
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [initCytoscape]);

  const handleZoomIn = () => {
    if (cyRef.current) {
      const zoom = cyRef.current.zoom() * 1.3;
      cyRef.current.animate({ zoom: zoom, duration: 200 });
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      const zoom = cyRef.current.zoom() / 1.3;
      cyRef.current.animate({ zoom: zoom, duration: 200 });
    }
  };

  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.animate({ fit: { padding: 60 }, duration: 300 });
    }
  };

  const handleCenter = () => {
    if (cyRef.current) {
      cyRef.current.animate({ center: {}, duration: 300 });
    }
  };

  if (!tree) {
    return (
      <div className="panel full-width">
        <div className="panel-header">
          <h2>VISTA ESQUEMATICA AST</h2>
        </div>
        <div className="panel-body">
          <div className="empty-state">
            <p>ESPERANDO ANALISIS SINTACTICO...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel full-width">
      <div className="panel-header">
        <h2>VISTA ESQUEMATICA AST</h2>
        <span className="status-indicator success">
          <span className="status-dot success"></span>
          ANALISIS OK
        </span>
      </div>
      <div className="panel-body" style={{ padding: 0 }}>
        <div className={`tree-container ${isFullscreen ? 'fullscreen-mode' : ''}`} ref={wrapperRef}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="cytoscape-tree" />

          {/* Controls */}
          <div className="tree-controls">
            <button onClick={toggleFullscreen} title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}>
              {isFullscreen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              )}
            </button>
            <button onClick={handleZoomIn} title="Acercar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <button onClick={handleZoomOut} title="Alejar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <button onClick={handleFit} title="Ajustar al contenido">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
            </button>
            <button onClick={handleCenter} title="Centrar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
            </button>
          </div>

          {/* Legend */}
          <div className="tree-legend">
            <div className="tree-legend-item">
              <div className="tree-legend-dot nonterminal"></div>
              NODO V
            </div>
            <div className="tree-legend-item">
              <div className="tree-legend-dot terminal"></div>
              NODO T
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
