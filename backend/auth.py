from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException

SECRET_KEY = "mysecret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 10


# CREATE TOKEN
def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


# VERIFY TOKEN
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Ensure required fields exist
        if "user_id" not in payload or "role" not in payload:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")