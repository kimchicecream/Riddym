from flask import Blueprint, request, jsonify
from .models import db, Track
from flask_login import login_required, current_user

track_routes = Blueprint('tracks', __name__)

#Create a new track
@track_routes.route('/', methods=['POST'])
@login_required
def create_track():
    data = request.get_json()
    new_track = Track(
        creator_id=current_user.id,
        song_id=data['song_id']
        difficulty=data['difficulty'],
        duration=data['duration']
    )
    db.session.add(new_track)
    db.session.commit()
    return jsonify(new_track.to_dict()), 201

# Get all tracks
@track_routes.route('/', methods=['GET'])
def get_tracks():
    tracks = Track.query.all()
    return jsonify([track.to_dict() for track in tracks]), 200

# Update a track by ID
@track_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_track(id):
    data = request.get_json()
    track = Track.query.get_or_404(id)
    if track.creator_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    track.song_id = data.get('song_id', track.song_id)
    track.difficulty = data.get('difficulty', track.difficulty)
    track.duration = data.get('duration', track.duration)
    db.session.commit()
    return jsonify(track.to_dict()), 200

# Delete a track by ID
@track_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_track(id):
    track = Track.query.get_or_404(id)
    if track.creator_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(track)
    db.session.commit()
    return jsonify({'message': 'Track deleted'}), 200
