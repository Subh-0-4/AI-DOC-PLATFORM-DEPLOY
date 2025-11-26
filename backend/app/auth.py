from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import hashlib
from typing import Optional

from .config import settings
from .database import SessionLocal
from . import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===== SIMPLE HASHING USING hashlib (no passlib, no bcrypt) =====

def hash_password(password: str) -> str:
    """
    Hash password using SHA-256.
    This is OK for an assignment/demo. For real production, use a stronger KDF.
    """
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(plain: str, hashed: str) -> bool:
    return hash_password(plain) == hashed


# ===== JWT TOKEN HELPERS =====

def create_access_token(data: dict, expires_minutes: int = settings.access_token_expire_minutes):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),  # token can be None now
    db: Session = Depends(get_db),
) -> models.User:
    """
    Simplified for assignment:
    - Accepts a Bearer token if present (so Swagger shows Authorize),
    - But does NOT strictly require it for now.
    - Always returns the first user in the database.
    """
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No users found in database",
        )
    return user