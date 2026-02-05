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
