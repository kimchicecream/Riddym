from flask.cli import AppGroup
from .users import seed_users, undo_users
from .tracks import seed_tracks, undo_tracks
from .songs import seed_songs, undo_songs
from .scores import seed_scores, undo_scores
from .notes import seed_notes, undo_notes
from .friends import seed_friends, undo_friends
from app.models.db import db, environment, SCHEMA
from app.models import User, Track, Song, Score, Note, Friend

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        if User.query.count() == 0 and Track.query.count() == 0 and Song.query.count() == 0 and \
           Score.query.count() == 0 and Note.query.count() == 0 and Friend.query.count() == 0:
            undo_users()
            undo_tracks()
            undo_songs()
            undo_scores()
            undo_notes()
            undo_friends()
    seed_users()
    seed_tracks()
    seed_songs()
    seed_scores()
    seed_notes()
    seed_friends()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_tracks()
    undo_songs()
    undo_scores()
    undo_notes()
    undo_friends()
