from flask import Flask, jsonify

app = Flask(__name__, static_url_path='')

@app.route('/', methods=["GET"])
def test():
    return jsonify({"hello": "world"})


if __name__ == "__main__":
    app.run(debug=True)