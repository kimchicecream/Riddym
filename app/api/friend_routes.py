from flask import Blueprint, request, jsonify
from app.models import db, Friend
from flask_login import login_required, current_user

friend_routes = Blueprint('friends', __name__)

# Send a friend request (create a new friend)
@friend_routes.route('/request', methods=['POST'])
@login_required
def send_friend_request():
    data = request.get_json()
    new_friend = Friend(
        user_id=current_user.id,
        friend_id=data['friend_id'],
        status='pending'
    )
    db.session.add(new_friend)
    db.session.commit()
    return jsonify(new_friend.to_dict()), 201

# Accept a friend request (update friend status)
@friend_routes.route('/accept/<int:id>', methods=['PUT'])
@login_required
def accept_friend_request(id):
    friend_request = Friend.query.get_or_404(id)
    if friend_request.friend_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    friend_request.status = 'accepted'
    db.session.commit()
    return jsonify(friend_request.to_dict()), 200

# Decline a friend request
@friend_routes.route('/decline/<int:id>', methods=['PUT'])
@login_required
def decline_friend_request(id):
    friend_request = Friend.query.get_or_404(id)
    if friend_request.friend_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(friend_request)
    db.session.commit()
    return jsonify({'message': 'Friend request declined'}), 200

# Get all friends for the current user
@friend_routes.route('/', methods=['GET'])
@login_required
def get_friends():
    friends = Friend.query.filter(
        (Friend.user_id == current_user.id) | (Friend.friend_id == current_user.id),
        Friend.status == 'accepted'
    ).all()
    return jsonify([friend.to_dict() for friend in friends]), 200

# Get all pending friend requests for the current user
@friend_routes.route('/requests', methods=['GET'])
@login_required
def get_friend_requests():
    requests = Friend.query.filter_by(friend_id=current_user.id, status='pending').all()
    return jsonify([request.to_dict() for request in requests]), 200

# Remove a friend (remove friend entry)
@friend_routes.route('/remove/<int:id>', methods=['DELETE'])
@login_required
def remove_friend(id):
    friend = Friend.query.get_or_404(id)
    if friend.user_id != current_user.id and friend.friend_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(friend)
    db.session.commit()
    return jsonify({'message': 'Friend removed'}), 200
