from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, String, Integer, ForeignKey, Float
from uuid import uuid4

class Note(db.Model):
    __tablename__ = 'notes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    track_id = Column(Integer, ForeignKey(add_prefix_for_prod('tracks.id'), ondelete='CASCADE'), nullable=True)
    temp_track_id = Column(String, nullable=True, default=str(uuid4())) # temporary track id
    time = Column(Float, nullable=False)
    lane = Column(Integer, nullable=False)
    note_type = Column(String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'track_id': self.track_id,
            'time': self.time,
            'lane': self.lane,
            'note_type': self.note_type
        }
