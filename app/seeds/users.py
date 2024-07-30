from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_users():
    if User.query.filter_by(username='Demo-lition').first() is None:
        demo = User(username='Demo-lition', first_name='Demo', last_name='User', email='demo@aa.io', password='password')
        db.session.add(demo)

    if User.query.filter_by(username='pyth1a').first() is None:
        alex = User(username='pyth1a', first_name='Alex', last_name='Go', email='alex@aa.io', password='password')
        db.session.add(alex)

    db.session.commit()

def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
