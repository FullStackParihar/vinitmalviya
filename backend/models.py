from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class LeadBase(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10)
    email: Optional[EmailStr] = None
    interest: str = "General Inquiry"
    created_at: datetime = Field(default_factory=datetime.now)

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: str

# Auth Models
class User(BaseModel):
    username: str
    password_hash: str
    role: str = "admin"

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Portfolio Models
class PortfolioItemBase(BaseModel):
    title: str
    category: str
    scope: str
    image_url: str  # Path to stored image
    size: str = "small" # "small", "large"
    media_type: str = "image" # "image", "video"

class PortfolioItemCreate(PortfolioItemBase):
    pass

class PortfolioItem(PortfolioItemBase):
    id: str

# Hardware Models
class HardwareProductBase(BaseModel):
    name: str
    description: str
    price: str
    tag: str = "New Arrival"
    image_url: str

class HardwareProductCreate(HardwareProductBase):
    pass

class HardwareProduct(HardwareProductBase):
    id: str
