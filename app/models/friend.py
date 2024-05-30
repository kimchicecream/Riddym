from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey

class Friend(db.Model):
    __tablename__ = 'friends'

    if environment == "production":
            __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    friend_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    status = Column(String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'friend_id': self.friend_id,
            'status': self.status
        }
