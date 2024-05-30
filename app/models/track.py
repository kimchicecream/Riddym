from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

class Track(db.Model):
    __tablename__ = 'tracks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    creator_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    song_id = Column(Integer, ForeignKey(add_prefix_for_prod('songs.id'), ondelete='CASCADE'), nullable=False)
    difficulty = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)

    notes = relationship('Note', backref='track', cascade='all, delete-orphan', lazy=True)
    scores = relationship('Score', backref='track', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'creator_id': self.creator_id,
            'song_id': self.song_id,
            'difficulty': self.difficulty,
            'duration': self.duration
        }
