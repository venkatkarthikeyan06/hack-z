# app.py
from flask import Flask, request, render_template, jsonify
from model import LearningModel

app = Flask(__name__)
learning_model = LearningModel()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    content = request.json
    learning_style = content['learning_style']
    performance_score = content['performance_score']
    
    recommended_tool = learning_model.predict(learning_style, performance_score)
    
    return jsonify({'recommended_tool': recommended_tool})

if __name__ == '__main__':
    app.run(debug=True)