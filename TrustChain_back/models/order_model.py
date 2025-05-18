from pydantic import BaseModel,Field
from typing import List, Optional
from datetime import datetime
from models.cart_model import CartItem

class OrderItem(BaseModel):
    product_name: str  
    quantity: int

class Order(BaseModel):
    user_email: str 
    items: List[OrderItem]
    sellerId: str
    total_price: float
    status: Optional[str] = "Pending"
    created_at: Optional[datetime] = None

class OrderResponse(Order):
    id: str  
    created_at: datetime

    class Config:
        orm_mode = True

class OrderCreate(BaseModel):
    user_id: str
    seller_id: str
    items: List[CartItem]
    total_price: float

class OrderInDB(OrderCreate):
    id: str = Field(alias="_id")
    status: str
    created_at: datetime
