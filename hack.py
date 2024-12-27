# model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder

class LearningModel:
    def __init__(self):
        self.model = DecisionTreeClassifier()
        self.label_encoder = LabelEncoder()
        self.load_data()

    def load_data(self):
        # Load and prepare the data
        data = pd.read_csv('1.csv')
        data['learning_style'] = self.label_encoder.fit_transform(data['learning_style'])
        data['preferred_tool'] = self.label_encoder.fit_transform(data['preferred_tool'])

        # Features and target variable
        X = data[['learning_style', 'performance_score']]
        y = data['preferred_tool']

        # Split the data
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model
        self.model.fit(self.X_train, self.y_train)

    def predict(self, learning_style, performance_score):
        learning_style_encoded = self.label_encoder.transform([learning_style])
        prediction = self.model.predict([[learning_style_encoded[0], performance_score]])
        return self.label_encoder.inverse_transform(prediction)[0]