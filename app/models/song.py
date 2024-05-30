from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Song(db.Model):
    __tablename__ = 'songs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    creator_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    song_name = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    song_url = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    artist_name = Column(String, nullable=False)

    tracks = relationship('Track', backref='song', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
            return {
            'id': self.id,
            'creator_id': self.creator_id,
            'song_name': self.song_name,
            'duration': self.duration,
            'song_url': self.song_url,
            'image_url': self.image_url,
            'artist_name': self.artist_name
            }
