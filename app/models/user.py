from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, Integer, String
from flask_login import UserMixin
from sqlalchemy.orm import relationship

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    image_url = Column(String)

    tracks = relationship('Track', backref='creator', cascade='all, delete-orphan', lazy=True)
    scores = relationship('Score', backref='user', cascade='all, delete-orphan', lazy=True)
    friends = relationship('Friend', foreign_keys='Friend.user_id', cascade='all, delete-orphan', lazy=True)
    friend_of = relationship('Friend', foreign_keys='Friend.friend_id', cascade='all, delete-orphan', lazy=True)
    created_songs = relationship('Song', backref='creator', cascade='all, delete-orphan', lazy=True)


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'image_url': self.image_url
        }
