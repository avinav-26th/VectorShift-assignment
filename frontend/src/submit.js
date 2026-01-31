// frontend/src/submit.js
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";

export const SubmitButton = () => {
  const { nodes, edges } = useStore(
    (state) => ({ nodes: state.nodes, edges: state.edges }),
    shallow,
  );

  const handleSubmit = async () => {
    const toastId = toast.loading("Checking Pipeline...");

    try {
      const response = await fetch("http://127.0.0.1:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await response.json();

      // Update loading toast to success/error
      toast.update(toastId, {
        render: (
          <div
            style={{
              fontSize: "13px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <strong style={{ fontSize: "14px" }}>Submission Successful!</strong>
            Nodes: {data.num_nodes} | Edges: {data.num_edges}
            <br />
            Is DAG: {data.is_dag ? "Yes ✅" : "No ❌"}
          </div>
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000,
        position: "bottom-right",
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error: Backend not reachable",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={handleSubmit}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          backgroundColor: "forestgreen",
          color: "#fff",
          border: "none",
          fontSize: "15px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Submit Pipeline
      </button>
    </div>
  );
};
