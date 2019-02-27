from app import db, ma
from .base import BaseModel, BaseSchema

class Message(db.Model, BaseModel):

    __tablename__ = 'messages'

    content = db.Column(db.Text(), nullable=False)


class MessageSchema(ma.ModelSchema, BaseSchema):

    class Meta:
        model = Message
