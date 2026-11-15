
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from backend.services.internship_predictor import (
    training_skills,
    training_roles
)


# Split dataset into training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    training_skills,
    training_roles,
    test_size=0.25,
    random_state=42,
    stratify=training_roles
)


# Create a new evaluation model
evaluation_model = Pipeline([
    ("vectorizer", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])


# Train using training data only
evaluation_model.fit(X_train, y_train)


# Predict using unseen test data
predictions = evaluation_model.predict(X_test)


# Calculate evaluation metrics
accuracy = accuracy_score(y_test, predictions)

print("ML MODEL EVALUATION")
print("-------------------")

print("Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(classification_report(y_test, predictions, zero_division=0))
# Generate confusion matrix
cm = confusion_matrix(y_test, predictions)

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=evaluation_model.classes_
)

display.plot(cmap="Blues", values_format="d")

plt.title("Internship Role Prediction - Confusion Matrix")
plt.xticks(rotation=30)
plt.tight_layout()

plt.savefig("internship_confusion_matrix.png")

plt.show()