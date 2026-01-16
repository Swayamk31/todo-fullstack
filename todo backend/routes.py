from flask import Blueprint, request, jsonify
from model import db, Todo

todo_bp = Blueprint("todo_bp", __name__)

# CREATE
@todo_bp.route("/todos", methods=["POST"])
def create_todo():
    data = request.get_json()
    title = data.get("title")

    if not title:
        return jsonify({"error": "Title is required"}), 400

    todo = Todo(title=title)
    db.session.add(todo)
    db.session.commit()

    return jsonify(todo.to_dict()), 201


# READ ALL
@todo_bp.route("/todos", methods=["GET"])
def get_todos():
    todos = Todo.query.order_by(Todo.created_at.desc()).all()
    return jsonify([todo.to_dict() for todo in todos])


# UPDATE
@todo_bp.route("/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    todo = Todo.query.get_or_404(id)
    data = request.get_json()

    todo.title = data.get("title", todo.title)
    todo.completed = data.get("completed", todo.completed)

    db.session.commit()
    return jsonify(todo.to_dict())


# DELETE
@todo_bp.route("/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()

    return jsonify({"message": "Todo deleted"})
