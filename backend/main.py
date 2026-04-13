from fastapi import FastAPI, HTTPException, Depends
import database
from schemas import TaskCreate, UserSignup, UserLogin
from utils import hash_password, verify_password
from auth import create_token, verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# =========================
# CORS (for React)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


# =========================
# AUTH HELPER
# =========================
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user = verify_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return user


# =========================
# SIGNUP
# =========================
@app.post("/signup")
def signup(user: UserSignup):
    try:
        cursor = database.conn.cursor()

        hashed = hash_password(user.password)

        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            (user.name, user.email, hashed, user.role)
        )
        database.conn.commit()

        return {"message": "User created successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# LOGIN
# =========================
@app.post("/login")
def login(user: UserLogin):
    cursor = database.conn.cursor()

    cursor.execute(
        "SELECT id, name, email, password, role FROM users WHERE email = ?",
        (user.email,)
    )
    db_user = cursor.fetchone()

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user[3]):
        raise HTTPException(status_code=400, detail="Incorrect password")

    token = create_token({
        "user_id": db_user[0],
        "role": db_user[4]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# =========================
# PROFILE
# =========================
@app.get("/profile")
def profile(user=Depends(get_current_user)):
    cursor = database.conn.cursor()

    cursor.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        (user["user_id"],)
    )

    db_user = cursor.fetchone()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": db_user[0],
        "name": db_user[1],
        "email": db_user[2]
    }


# =========================
# CREATE TASK (ADMIN ONLY)
# =========================
@app.post("/tasks")
def create_task(task: TaskCreate, user=Depends(get_current_user)):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admin can assign tasks")

    #  prevent empty fields
    if not task.title.strip() or not task.description.strip():
        raise HTTPException(status_code=400, detail="Fields cannot be empty")

    cursor = database.conn.cursor()

    # check user exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (task.user_id,))
    exists = cursor.fetchone()

    if not exists:
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute(
        "INSERT INTO tasks (title, description, status, user_id, assigned_by) VALUES (?, ?, ?, ?, ?)",
        (task.title, task.description, "Pending", task.user_id, user["user_id"])
    )
    database.conn.commit()

    return {"message": "Task created"}


# =========================
# ADMIN: VIEW ASSIGNED TASKS
# =========================
@app.get("/assigned-tasks")
def get_assigned_tasks(user=Depends(get_current_user)):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    cursor = database.conn.cursor()

    cursor.execute("""
        SELECT tasks.id, tasks.title, tasks.status,
               users.name, users.id
        FROM tasks
        JOIN users ON tasks.user_id = users.id
        WHERE tasks.assigned_by = ?
        ORDER BY users.id
    """, (user["user_id"],))

    rows = cursor.fetchall()

    return [
        {
            "task_id": r[0],
            "title": r[1],
            "status": r[2],
            "assigned_to": r[3],
            "user_id": r[4]
        }
        for r in rows
    ]


# =========================
# GET MY TASKS (USER)
# =========================
@app.get("/my-tasks")
def get_tasks(user=Depends(get_current_user)):

    cursor = database.conn.cursor()

    cursor.execute(
        "SELECT id, title, description, status FROM tasks WHERE user_id = ?",
        (user["user_id"],)
    )

    rows = cursor.fetchall()

    return [
        {"id": r[0], "title": r[1], "description": r[2], "status": r[3]}
        for r in rows
    ]


# =========================
# UPDATE TASK (USER ONLY)
# =========================
@app.put("/tasks/{task_id}")
def update_task(task_id: int, user=Depends(get_current_user)):

    cursor = database.conn.cursor()

    cursor.execute(
        "SELECT user_id FROM tasks WHERE id = ?", (task_id,)
    )
    task = cursor.fetchone()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task[0] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    cursor.execute(
        "UPDATE tasks SET status = 'Completed' WHERE id = ?",
        (task_id,)
    )
    database.conn.commit()

    return {"message": "Task updated"}


# =========================
# GET USERS (ADMIN ONLY)
# =========================
@app.get("/users")
def get_users(user=Depends(get_current_user)):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    cursor = database.conn.cursor()

    cursor.execute(
        "SELECT id, name, email FROM users WHERE role = 'user'"
    )

    rows = cursor.fetchall()

    return [
        {"id": r[0], "name": r[1], "email": r[2]}
        for r in rows
    ]