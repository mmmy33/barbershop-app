from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from src.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, nullable=True)
    hashed_password = Column(String)
    role = Column(String, default="user")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
