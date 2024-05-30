from app.models import db, Score, environment, SCHEMA
from sqlalchemy.sql import text


def seed_scores():
    db.session.commit()


def undo_scores():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.scores RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM scores"))

    db.session.commit()
