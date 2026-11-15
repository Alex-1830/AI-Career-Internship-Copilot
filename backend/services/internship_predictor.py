
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


# Training dataset
training_skills = [
    # AI/ML Intern
    "python machine learning pandas numpy tensorflow",
    "python deep learning neural networks scikit learn",
    "artificial intelligence python keras data science",
    "machine learning algorithms python numpy pandas",
    "python neural networks tensorflow pytorch",
    "data science machine learning model training",
    "python computer vision image processing",
    "natural language processing python machine learning",

    # Frontend Developer Intern
    "python html css javascript react",
    "javascript react html css frontend development",
    "react javascript bootstrap web design",
    "html css javascript responsive website",
    "frontend development react javascript",
    "javascript html css user interface design",
    "reactjs html css frontend programming",
    "web development javascript react bootstrap",

    # Backend Developer Intern
    "python fastapi django flask api development",
    "python mysql database backend development",
    "java api sql backend programming",
    "python rest api fastapi development",
    "django python mysql backend programming",
    "java spring boot database api",
    "nodejs express javascript backend development",
    "python server side programming database",

    # Data Analyst Intern
    "sql excel pandas data analysis",
    "python power bi tableau statistics",
    "data visualization sql analytics excel",
    "python data cleaning pandas matplotlib",
    "excel sql business intelligence reporting",
    "power bi dashboard data analysis",
    "statistics python data visualization",
    "sql database reporting excel analytics"
]


training_roles = (
    ["AI/ML Intern"] * 8 +
    ["Frontend Developer Intern"] * 8 +
    ["Backend Developer Intern"] * 8 +
    ["Data Analyst Intern"] * 8
)


# Create and train ML model
model = Pipeline([
    ("vectorizer", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])

model.fit(training_skills, training_roles)


# Predict internship role
def predict_internship_role(skills):

    prediction = model.predict([skills])

    return prediction[0]
