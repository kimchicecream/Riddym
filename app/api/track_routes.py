from flask import Blueprint, request, jsonify
from app.models import db, Track, Note, User
from flask_login import login_required, current_user
# from app.forms.track_create import TrackForm

track_routes = Blueprint('tracks', __name__)

# Create a new track
@track_routes.route('/create', methods=['POST'])
@login_required
def create_track():
    data = request.get_json()
    print('Received track data:', data)

    new_track = Track(
        creator_id=current_user.id,
        song_id=data['song_id'],
        difficulty=data.get('difficulty', 'normal'),
        duration=data['duration']
    )
    db.session.add(new_track)
    db.session.commit()

    # Create and add notes to the track
    notes_data = data.get('notes', [])
    print('Received notes data:', notes_data)
    unique_notes = {f"{note['time']}-{note['lane']}": note for note in notes_data}.values()

    for note_data in unique_notes:
        new_note = Note(
            track_id=new_track.id,
            time=note_data['time'],
            lane=note_data['lane'],
            note_type=note_data['note_type']
        )
        db.session.add(new_note)

    db.session.commit()  # Commit the notes

    print(f"Created track with ID {new_track.id} and {len(unique_notes)} unique notes")
    print(f"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Track notes after creation: {[note.to_dict() for note in new_track.notes]}")

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

    # handle notes
    notes_data = data.get('notes', [])
    existing_notes = Note.query.filter_by(track_id=id).all()
    existing_notes_dict = {note.id: note for note in existing_notes}

    updated_note_ids = set()

    for note_data in notes_data:
        if 'id' in note_data and note_data['id'] in existing_notes_dict:
            # update existing note
            note = existing_notes_dict[note_data['id']]
            note.time = note_data['time']
            note.lane = note_data['lane']
            note.note_type = note_data['note_type']
            updated_note_ids.add(note.id)
        else:
            # Create new note
            new_note = Note(
                track_id=track.id,
                time=note_data['time'],
                lane=note_data['lane'],
                note_type=note_data['note_type']
            )
            db.session.add(new_note)

    for note_id, note in existing_notes_dict.items():
        if note_id not in updated_note_ids:
            db.session.delete(note)

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

# Get all tracks by a specific user
@track_routes.route('/user/<int:user_id>', methods=['GET'])
@login_required
def get_user_tracks(user_id):
    user = User.query.get_or_404(user_id)
    tracks = Track.query.filter_by(creator_id=user.id).all()
    return jsonify([track.to_dict() for track in tracks]), 200
