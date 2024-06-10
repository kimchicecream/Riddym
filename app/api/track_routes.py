from flask import Blueprint, request, jsonify
from app.models import db, Track, Note
from flask_login import login_required, current_user
# from app.forms.track_create import TrackForm

track_routes = Blueprint('tracks', __name__)

# Create a new track
@track_routes.route('/create', methods=['POST'])
@login_required
def create_track():
    data = request.get_json()
    new_track = Track(
        creator_id=current_user.id,
        song_id=data['song_id'],
        difficulty=data.get('difficulty', 'normal'),
        duration=data['duration']
    )
    db.session.add(new_track)
    db.session.commit()

    # create and add notes to the track
    notes_data = data.get('notes', [])
    unique_notes = {f"{note['time']}-{note['lane']}": note for note in notes_data}.values()

    for note_data in unique_notes:
        new_note = Note(
            track_id=new_track.id,
            time=note_data['time'],
            lane=note_data['lane'],
            note_type=note_data['note_type']
        )
        db.session.add(new_note)

    db.session.commit()

    print(f"Created track with ID {new_track.id} and {len(unique_notes)} unique notes")
    return jsonify(new_track.to_dict()), 201

# Get all tracks
@track_routes.route('/all', methods=['GET'])
def get_tracks():
    tracks = Track.query.all()
    return jsonify([track.to_dict() for track in tracks]), 200

# Get a track by ID
@track_routes.route('/<int:id>', methods=['GET'])
def get_track_by_id(id):
    track = Track.query.get_or_404(id)

    notes_count = Note.query.filter_by(track_id=id).count()
    print(f"Fetched track with ID {id} with {notes_count} notes")

    return jsonify(track.to_dict()), 200

# Update a track by ID
@track_routes.route('/<int:id>/edit', methods=['PUT'])
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
@track_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_track(id):
    track = Track.query.get_or_404(id)
    if track.creator_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(track)
    db.session.commit()
    return jsonify({'message': 'Track deleted'}), 200
