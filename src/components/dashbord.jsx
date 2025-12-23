import { useState } from "react";

export const Dashboard = ()=>{
    const [names, setNames] = useState("");
      const [leads, setLeads] = useState([]);
      const [loading, setLoading] = useState(false);
    
      const submitNames = async () => {
        if (!names.trim()) return;
        setLoading(true);
        try {
          const res = await fetch("http://localhost:5000/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              names: names.split(",").map(n => n.trim())
            })
          });
          const data = await res.json();
          setLeads(data);
        } catch (error) {
          console.error("Error submitting leads:", error);
        } finally {
          setLoading(false);
        }
      };
    
      const getStatusColor = (status) => {
        const colors = {
          hot: "#10b981",
          warm: "#f59e0b",
          cold: "#6b7280"
        };
        return colors[status?.toLowerCase()] || "#6b7280";
      };
    
      return (
        <div className="app-container">
          <div className="card">
            <h1 className="title">Smart Lead System</h1>
            <p className="subtitle">Enter names separated by commas to analyze leads</p>
    
            <div className="input-section">
              <textarea
                className="input-textarea"
                rows="3"
                value={names}
                onChange={e => setNames(e.target.value)}
                placeholder="Peter, Aditi, Ravi..."
              />
              <button 
                className="submit-btn" 
                onClick={submitNames}
                disabled={loading || !names.trim()}
              >
                {loading ? "Processing..." : "Analyze Leads"}
              </button>
            </div>
    
            {leads.length > 0 && (
              <div className="table-container">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>Probability</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l._id}>
                        <td className="name-cell">{l.name}</td>
                        <td>{l.country}</td>
                        <td>
                          <div className="probability-bar">
                            <div 
                              className="probability-fill" 
                              style={{ width: `${l.probability}%` }}
                            />
                            <span className="probability-text">{l.probability}%</span>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(l.status) }}
                          >
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
    
            {leads.length === 0 && !loading && (
              <div className="empty-state">
                <p>No leads analyzed yet. Enter names above to get started.</p>
              </div>
            )}
          </div>
        </div>
      );
}
