import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import joblib
import xgboost as xgb

# Step 1: Load the dataset
data = pd.read_csv('cleaned_data.csv')

# Step 2: Separate features (X) and target (y)
X = data.drop(columns=['FALL'])
y = data['FALL']

# Step 3: Split data into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Initialize XGBoost Classifier
xgb_model = xgb.XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='logloss')

# Step 5: Train the model
xgb_model.fit(X_train, y_train)

# Step 6: Make predictions
xgb_preds = xgb_model.predict(X_test)

# Step 7: Define evaluation function
def evaluate_model(name, y_true, y_pred):
    print(f"\n--- {name} Performance ---")
    print(f"Accuracy: {accuracy_score(y_true, y_pred) * 100:.2f}%")
    print(f"Precision: {precision_score(y_true, y_pred) * 100:.2f}%")
    print(f"Recall: {recall_score(y_true, y_pred) * 100:.2f}%")
    print(f"F1-Score: {f1_score(y_true, y_pred) * 100:.2f}%")
    print("Confusion Matrix:")
    print(confusion_matrix(y_true, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred))

# Step 8: Evaluate the XGBoost model
evaluate_model("XGBoost", y_test, xgb_preds)

# Step 9: Save the trained model
joblib.dump(xgb_model, "fall_detection_xgb_model.pkl")
