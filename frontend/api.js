const BASE_URL = "http://127.0.0.1:8000";

// =====================
// COMMON REQUEST FUNCTION
// =====================
const request = async (url, method = "GET", data = null, token = null) => {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: data ? JSON.stringify(data) : null,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.detail || "Something went wrong");
    }

    return result;
  } catch (err) {
    console.error("API ERROR:", err.message);
    return { error: err.message };
  }
};



// =====================
// AUTH
// =====================

export const loginUser = (data) => {
  return request("/login", "POST", data);
};

export const signupUser = (data) => {
  return request("/signup", "POST", data);
};



// =====================
// TASKS
// =====================

export const getTasks = (token) => {
  return request("/my-tasks", "GET", null, token);
};

export const createTask = (data, token) => {
  return request("/tasks", "POST", data, token);
};

export const updateTask = (id, token) => {
  return request(`/tasks/${id}`, "PUT", null, token);
};



// =====================
// USERS (ADMIN)
// =====================

export const getUsers = (token) => {
  return request("/users", "GET", null, token);
};



// =====================
// ADMIN TASK VIEW
// =====================

export const getAssignedTasks = (token) => {
  return request("/assigned-tasks", "GET", null, token);
};