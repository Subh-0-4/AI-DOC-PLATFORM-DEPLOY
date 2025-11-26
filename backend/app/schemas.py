from typing import List, Optional
from pydantic import BaseModel, EmailStr
from pydantic import ConfigDict  # if not already imported

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True 

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None

class RefinementCreate(BaseModel):
    prompt: str

class CommentBase(BaseModel):
    text: str


class CommentOut(CommentBase):
    id: int
    section_id: int

    class Config:
        from_attributes = True  # Pydantic v2 equivalent of orm_mode = True
class ProjectOut(BaseModel):
    id: int
    name: str
    document_type: str
    main_topic: str
    sections: List["Section"] = []  # forward reference to Section

    class Config:
        from_attributes = True



class SectionCreate(BaseModel):
    order_index: int
    title: str
    content: Optional[str] = None


class ProjectCreate(BaseModel):
    name: str
    document_type: str
    main_topic: str
    sections: List[SectionCreate] = []


class Comment(BaseModel):
    id: int
    text: str

    model_config = ConfigDict(from_attributes=True)


class Section(BaseModel):
    id: int
    order_index: int
    title: str
    content: Optional[str]
    comments: List[Comment] = []

    model_config = ConfigDict(from_attributes=True)


class Project(BaseModel):
    id: int
    name: str
    document_type: str
    main_topic: str
    sections: List[Section] = []

    model_config = ConfigDict(from_attributes=True)

class FeedbackRequest(BaseModel):
    is_like: bool