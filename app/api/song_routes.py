from flask import Blueprint, request, jsonify
from app.models import db, Song
from flask_login import login_required, current_user
from app.forms.song_create import SongForm

song_routes = Blueprint('songs', __name__)

# Create a new song
@song_routes.route('/', methods=['POST'])
@login_required
def create_song():
    form = SongForm()
    if form.validate_on_submit():
        new_song = Song(
            creator_id=current_user.id,
                song_name=form.song_name.data,
                duration=form.duration.data,
                song_url=form.song_url.data,
                image_url=form.image_url.data,
                artist_name=form.artist_name.data
        )
        db.session.add(new_song)
        db.session.commit()
        return jsonify(new_song.to_dict()), 201
    return form.errors, 401

# Get all songs
@song_routes.route('/', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify([song.to_dict() for song in songs]), 200

# Get a single song by ID
@song_routes.route('/<int:id>', methods=['GET'])
def get_song(id):
    song = Song.query.get_or_404(id)
    return jsonify(song.to_dict()), 200

# Update a song by ID
@song_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_song(id):
    data = request.get_json()
    song = Song.query.get_or_404(id)
    if song.creator_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    song.song_name = data.get('song_name', song.song_name)
    song.duration = data.get('duration', song.duration)
    song.song_url = data.get('song_url', song.song_url)
    song.image_url = data.get('image_url', song.image_url)
    song.artist_name = data.get('artist_name', song.artist_name)
    db.session.commit()
    return jsonify(song.to_dict()), 200

# Delete a song by ID
@song_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_song(id):
    song = Song.query.get_or_404(id)
    if song.creator_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(song)
    db.session.commit()
    return jsonify({'message': 'Song deleted'}), 200
