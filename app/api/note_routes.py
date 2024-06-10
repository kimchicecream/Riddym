from flask import Blueprint, request, jsonify
from app.models import db, Note, Track
from flask_login import login_required, current_user

note_routes = Blueprint('notes', __name__)

# Create a new note
@note_routes.route('/create', methods=['POST'])
@login_required
def create_note():
    data = request.get_json()
    print("Data received:", data)

    track_id = data.get('track_id') or data.get('song_id')
    print("Track ID:", track_id)

    track = Track.query.get(track_id)
    if not track:
        print("Track ID does not exist")  # Add logging here
        return jsonify({"error": "Track ID does not exist"}), 400

    new_note = Note(
        track_id=track_id,
        time=data['time'],
        lane=data['lane'],
        note_type=data['note_type']
    )
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict()), 201

# Get all notes for a specific track
@note_routes.route('/track/<int:track_id>', methods=['GET'])
def get_notes_for_track(track_id):
    notes = Note.query.filter_by(track_id=track_id).all()
    return jsonify([note.to_dict() for note in notes]), 200

# Get a single note by ID
@note_routes.route('/<int:id>', methods=['GET'])
def get_note(id):
    note = Note.query.get_or_404(id)
    return jsonify(note.to_dict()), 200

# Update a note by ID
@note_routes.route('/<int:id>/edit', methods=['PUT'])
@login_required
def update_note(id):
    data = request.get_json()
    note = Note.query.get_or_404(id)
    note.track_id = data.get('track_id', note.track_id)
    note.time = data.get('time', note.time)
    note.lane = data.get('lane', note.lane)
    note.note_type = data.get('note_type', note.note_type)
    db.session.commit()
    return jsonify(note.to_dict()), 200

# Delete a note by ID
@note_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_note(id):
    note = Note.query.get_or_404(id)
    db.session.delete(note)
    db.session.commit()
    return jsonify({'message': 'Note deleted'}), 200
