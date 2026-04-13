from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# USER SIGNUP
class UserSignup(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=4)
    role: str = Field(..., pattern="^(admin|user)$")  # restrict values

# USER LOGIN
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# TASK CREATE (Admin assigns task to user)
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    user_id: int

# TASK RESPONSE (for frontend display)
class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str

# USER RESPONSE (for admin user list)
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr