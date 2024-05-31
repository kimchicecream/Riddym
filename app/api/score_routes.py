from flask import Blueprint, request, jsonify
from app.models import db, Score
from flask_login import login_required, current_user

score_routes = Blueprint('scores', __name__)

# Create a new score
@score_routes.route('/', methods=['POST'])
@login_required
def create_score():
    data = request.get_json()
    new_score = Score(
        user_id=current_user.id,
        track_id=data['track_id'],
        score=data['score'],
        accuracy=data['accuracy'],
        difficulty=data['difficulty']
    )
    db.session.add(new_score)
    db.session.commit()
    return jsonify(new_score.to_dict()), 201

# Get all scores for a specific track
@score_routes.route('/track/<int:track_id>', methods=['GET'])
def get_scores_for_track(track_id):
    scores = Score.query.filter_by(track_id=track_id).all()
    return jsonify([score.to_dict() for score in scores]), 200

# Get all scores for a specific user
@score_routes.route('/user/<int:user_id>', methods=['GET'])
def get_scores_for_user(user_id):
    scores = Score.query.filter_by(user_id=user_id).all()
    return jsonify([score.to_dict() for score in scores]), 200

# Get a single score by ID
@score_routes.route('/<int:id>', methods=['GET'])
def get_score(id):
    score = Score.query.get_or_404(id)
    return jsonify(score.to_dict()), 200

# Update a score by ID
@score_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_score(id):
    data = request.get_json()
    score = Score.query.get_or_404(id)
    if score.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    score.track_id = data.get('track_id', score.track_id)
    score.score = data.get('score', score.score)
    score.accuracy = data.get('accuracy', score.accuracy)
    score.difficulty = data.get('difficulty', score.difficulty)
    db.session.commit()
    return jsonify(score.to_dict()), 200

# Delete a score by ID
@score_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_score(id):
    score = Score.query.get_or_404(id)
    if score.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(score)
    db.session.commit()
    return jsonify({'message': 'Score deleted'}), 200
