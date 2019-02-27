from datetime import datetime, timedelta
import jwt
from config.environment import secret
from app import db, ma, bcrypt
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import validates_schema, fields, ValidationError, validate
from .base import BaseModel, BaseSchema

# Base = declarative_base()

# users_users = db.Table('users_users', Base.metadata,
#     db.Column('followings_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
#     db.Column('followers_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
# )

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('users.id'))
)

class User(db.Model, BaseModel):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(128), nullable=True, unique=True)
    password_hash = db.Column(db.String(128), nullable=True)

    followed = db.relationship(
        'User',
        secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )


    @hybrid_property
    def password(self):
        pass

    @password.setter
    def password(self, plaintext):
        self.password_hash = bcrypt.generate_password_hash(plaintext).decode('utf-8')

    def validate_password(self, plaintext):
        return bcrypt.check_password_hash(self.password_hash, plaintext)

    def generate_token(self):
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
            'sub': self.id
        }

        token = jwt.encode(
            payload,
            secret,
            'HS256'
        ).decode('utf-8')

        return token


class UserSchema(ma.ModelSchema, BaseSchema):
    # stories = fields.Nested()

    @validates_schema
    # pylint: disable=R0201
    def check_passwords_match(self, data):
        if data.get('password') != data.get('password_confirmation'):
            raise ValidationError(
                'Passwords do not match',
                'password_confirmation'
            )
    password = fields.String(
        required=True,
        validate=[validate.Length(min=8, max=50)]
    )
    password_confirmation = fields.String(required=True)
    stories = fields.Nested('StorySchema', many=True, exclude=('creator',))

    class Meta:
        model = User
        exclude = ('password_hash',)
        load_only = ('password', 'password_confirmation')
