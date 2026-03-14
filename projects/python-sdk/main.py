from flask import Flask

from handlers.v3 import v3_blueprint

app = Flask(__name__)
app.register_blueprint(v3_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3003, debug=True)
