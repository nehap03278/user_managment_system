from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# HASH PASSWORD
def hash_password(password: str):
    # bcrypt limit fix (VERY IMPORTANT)
    password = password[:72]
    return pwd_context.hash(password)

# VERIFY PASSWORD
def verify_password(plain: str, hashed: str):
    plain = plain[:72]
    return pwd_context.verify(plain, hashed)