from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, String, Integer, Float, ForeignKey

class Score(db.Model):
    __tablename__ = 'scores'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    track_id = Column(Integer, ForeignKey(add_prefix_for_prod('tracks.id'), ondelete='CASCADE'), nullable=False)
    score = Column(Integer, nullable=False)
    accuracy = Column(Float, nullable=False)
    difficulty = Column(String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'track_id': self.track_id,
            'score': self.score,
            'accuracy': self.accuracy,
            'difficulty': self.difficulty
        }
