from app.models import db, Track, environment, SCHEMA
from sqlalchemy.sql import text


def seed_tracks():
    db.session.commit()


def undo_tracks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tracks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tracks"))

    db.session.commit()
