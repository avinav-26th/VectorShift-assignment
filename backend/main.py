from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all sources, just for demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Define the data structure we expect from the frontend
class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineData):
    nodes = pipeline.nodes
    edges = pipeline.edges
    
    # Calculate basic stats
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if it is a DAG (Directed Acyclic Graph)
    is_dag = check_if_dag(nodes, edges)

    return {
        'num_nodes': num_nodes, 
        'num_edges': num_edges, 
        'is_dag': is_dag
    }

def check_if_dag(nodes, edges):
    # Build Adjacency List: { 'node_id': ['target_id_1', 'target_id_2'] }
    adj_list = {node['id']: [] for node in nodes}
    for edge in edges:
        source = edge['source']
        target = edge['target']
        if source in adj_list:
            adj_list[source].append(target)
    
    # Cycle Detection using DFS
    visited = set()
    recursion_stack = set()

    def has_cycle(node_id):
        visited.add(node_id)
        recursion_stack.add(node_id)

        # Check all neighbors
        for neighbor in adj_list.get(node_id, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in recursion_stack:
                return True  # Cycle detected!

        recursion_stack.remove(node_id)
        return False

    # Run DFS from every unvisited node
    for node in nodes:
        node_id = node['id']
        if node_id not in visited:
            if has_cycle(node_id):
                return False  # If cycle found, it is NOT a DAG

    return True  # No cycles found