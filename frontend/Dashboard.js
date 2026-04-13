import { useEffect, useState } from "react";
import {
  getTasks,
  updateTask,
  createTask,
  getUsers,
  getAssignedTasks,
} from "./api";

export default function Dashboard({ token, logout }) {
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");

  const user = JSON.parse(atob(token.split(".")[1]));
  const [showDropdown, setShowDropdown] = useState(false);
  // =====================
  // LOAD DATA
  // =====================

  const loadTasks = async () => {
    setLoading(true);
    const data = await getTasks(token);
    if (!data.error) setTasks(data);
    setLoading(false);
  };

  const loadUsers = async () => {
    const data = await getUsers(token);
    if (!data.error) setUsers(data);
  };

  const loadAssignedTasks = async () => {
    const data = await getAssignedTasks(token);
    if (!data.error) setAssignedTasks(data);
  };

  useEffect(() => {
    loadTasks();

    if (user.role === "admin") {
      loadUsers();
      loadAssignedTasks();
    }
  }, []);

  // =====================
  // ACTIONS
  // =====================

  const markComplete = async (id) => {
    await updateTask(id, token);
    loadTasks();
    if (user.role === "admin") loadAssignedTasks(); // keep admin view synced
  };

  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || !selectedUser) {
      alert("All fields required");
      return;
    }

    const res = await createTask(
      {
        title,
        description,
        user_id: selectedUser,
      },
      token
    );

    if (res.error) {
      alert(res.error);
    } else {
      setTitle("");
      setDescription("");
      setSelectedUser("");

      loadTasks();
      loadAssignedTasks();
    }
  };

  // =====================
  // FILTER (USER)
  // =====================

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "All" || t.status === statusFilter)
  );
  const filteredUsers = users.filter((u) =>
  u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
  u.email.toLowerCase().includes(userSearch.toLowerCase())
);

  // =====================
  // GROUP (ADMIN)
  // =====================

 const groupedTasks = assignedTasks
  .filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "All" || t.status === statusFilter)
  )
  .reduce((acc, task) => {
    if (!acc[task.user_id]) {
      acc[task.user_id] = {
        name: task.assigned_to,
        user_id: task.user_id,
        tasks: [],
      };
    }

    acc[task.user_id].tasks.push(task);
    return acc;
  }, {});

  // =====================
  // UI
  // =====================

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <h2>User Management System</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {/* ===================== ADMIN PANEL ===================== */}
      {user.role === "admin" && (
        <>
          {/* ASSIGN TASK */}
          <div className="card">
            <h3>Assign Task</h3>

           {/* SEARCH INPUT */}
<input
  placeholder="Search user by name or email..."
  value={userSearch}
  onChange={(e) => {
    setUserSearch(e.target.value);
    setShowDropdown(true); // show while typing
  }}
  onFocus={() => setShowDropdown(true)}
/>

{/* DROPDOWN RESULTS */}
{showDropdown && (
  <div className="dropdown">
    {filteredUsers.length === 0 ? (
      <div className="dropdown-item">No users found</div>
    ) : (
      filteredUsers.map((u) => (
        <div
  key={u.id}
  className="dropdown-item"
  onClick={() => {
    setSelectedUser(u.id);
    setUserSearch(u.name);
    setShowDropdown(false); 
  }}
>
  {u.name} ({u.email})
</div>
      ))
    )}
  </div>
)}

            <input
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={handleCreate}>Assign Task</button>
          </div>

        {/* ===================== SEARCH ===================== */}
      <div className="card">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>


          {/* ASSIGNED TASKS */}
          <div className="card">
            <h3>Tasks Assigned by You</h3>

            {Object.keys(groupedTasks).length === 0 ? (
              <p>No tasks assigned yet</p>
            ) : (
              Object.values(groupedTasks).map((u) => (
                <div key={u.user_id} style={{ marginBottom: "20px" }}>
                  <h4>
                    {u.name} (ID: {u.user_id})
                  </h4>

                  {u.tasks.map((t) => (
                    <div key={t.task_id} className="task-row">
                      <strong>{t.title}</strong>

                      <span
                        className={
                          t.status === "Pending" ? "pending" : "completed"
                        }
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </>
      )}
  {/* ===================== USER PANEL ===================== */}
{user.role !== "admin" && (
  <>
    {/* USER HEADER */}
    <div className="card">
      <h3>My Tasks</h3>
    </div>

    {/* SEARCH + FILTER */}
    <div className="card">
      <input
        placeholder="Search my tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option>All</option>
        <option>Pending</option>
        <option>Completed</option>
      </select>
    </div>

    {/* TASK LIST */}
    <div className="card">
      {filteredTasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        filteredTasks.map((t) => (
          <div key={t.task_id} className="task-row">
            <div>
              <strong>{t.title}</strong>
              <p style={{ margin: "5px 0" }}>{t.description}</p>
            </div>

            <span
              className={t.status === "Pending" ? "pending" : "completed"}
            >
              {t.status}
            </span>

            {t.status !== "Completed" && (
              <button onClick={() => markComplete(t.task_id)}>
                Mark Complete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  </>
)}

    </div>
  );
}
