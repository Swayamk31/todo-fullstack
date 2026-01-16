import os
from flask import Flask
from flask_cors import CORS
from model import db
from routes import todo_bp

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "todo.db")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(todo_bp)

@app.route("/")
def home():
    return {"message": "Todo API is running"}

if __name__ == "__main__":
    app.run(debug=True)
