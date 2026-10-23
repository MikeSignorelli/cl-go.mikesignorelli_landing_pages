import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Users,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CCPARequest {
  id: string;
  type: "do-not-sell" | "data-deletion" | "data-access";
  name: string;
  email: string;
  message?: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  date: string;
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  "in-progress": { label: "In Progress", icon: RefreshCw, color: "text-blue-600 bg-blue-50 border-blue-200" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
};

const typeLabels: Record<string, string> = {
  "do-not-sell": "Do Not Sell",
  "data-deletion": "Data Deletion",
  "data-access": "Data Access",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CCPARequest[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth");
    if (!auth) {
      navigate("/admin");
      return;
    }
    loadRequests();
  }, [navigate]);

  const loadRequests = () => {
    const stored = JSON.parse(localStorage.getItem("ccpa-requests") || "[]") as CCPARequest[];
    setRequests(stored);
  };

  const updateStatus = (id: string, status: CCPARequest["status"]) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status } : r));
    setRequests(updated);
    localStorage.setItem("ccpa-requests", JSON.stringify(updated));
    toast.success(`Request status updated to "${status}"`);
  };

  const deleteRequest = (id: string) => {
    const updated = requests.filter((r) => r.id !== id);
    setRequests(updated);
    localStorage.setItem("ccpa-requests", JSON.stringify(updated));
    toast.success("Request deleted");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin-auth");
    navigate("/admin");
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-secondary" />
            <h1 className="font-heading text-xl font-bold text-foreground">CCPA Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="border border-border rounded-sm p-5">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">{requests.length}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </div>
          <div className="border border-border rounded-sm p-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="border border-border rounded-sm p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {["all", "pending", "in-progress", "completed", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-sm font-heading font-medium py-1.5 px-4 rounded-sm border transition-colors capitalize",
                filter === f
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:bg-muted"
              )}
            >
              {f === "all" ? "All" : f.replace("-", " ")}
            </button>
          ))}
          <button
            onClick={loadRequests}
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Requests */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-sm">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-body">No requests found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Requests submitted through the "Do Not Sell My Info" page will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => {
              const config = statusConfig[req.status];
              const StatusIcon = config.icon;
              return (
                <div key={req.id} className="border border-border rounded-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-heading font-semibold text-foreground">{req.name}</p>
                        <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-sm">
                          {typeLabels[req.type] || req.type}
                        </span>
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-sm border", config.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{req.email}</p>
                      {req.message && (
                        <p className="text-sm text-foreground/70 mt-2 font-body">{req.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        Submitted: {new Date(req.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={req.status}
                        onChange={(e) => updateStatus(req.id, e.target.value as CCPARequest["status"])}
                        className="text-sm border border-border rounded-sm px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete request"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
