import sqlite3

# Create connection
conn = sqlite3.connect("ems.db", check_same_thread=False)
cursor = conn.cursor()

# Enable foreign key support (IMPORTANT)
cursor.execute("PRAGMA foreign_keys = ON")

# USERS TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
)
""")

# TASKS TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    status TEXT,
    user_id INTEGER,
    assigned_by INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(assigned_by) REFERENCES users(id)
)
""")

conn.commit()