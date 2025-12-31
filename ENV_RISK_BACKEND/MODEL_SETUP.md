# ML Model Setup

## Important: Model File Not Included

The `flood_prediction_model.pkl` file (103 MB) has been excluded from this repository because it exceeds GitHub's 100 MB file size limit.

## Regenerating the Model

To use the flood prediction system, you need to regenerate the model file:

### Option 1: Run the Jupyter Notebook

1. Navigate to the backend directory:
   ```bash
   cd ENV_RISK_BACKEND
   ```

2. Open the Jupyter notebook:
   ```bash
   jupyter notebook Kelani_Ganga_Flood_Prediction.ipynb
   ```

3. Run all cells to train the model
4. The model will be saved as `flood_prediction_model.pkl`

### Option 2: Download Pre-trained Model

If you have the pre-trained model file:

1. Place `flood_prediction_model.pkl` in the `ENV_RISK_BACKEND` directory
2. Ensure it's at the same level as `server.js`

### Model Details

- **Type**: Random Forest Classifier
- **Accuracy**: 98.2%
- **Training Data**: River_Water.csv (Kelani Ganga Basin historical data)
- **Input Features**: 
  - Temperature
  - Rainfall (1h and 3h)
  - Humidity
  - Wind Speed
  - Cloudiness
  - Pressure

### Verify Model is Working

Once the model file is in place, test the prediction endpoint:

```bash
curl http://localhost:5000/api/predictions
```

You should see flood predictions for all monitoring stations.

## Alternative: Git LFS (For Advanced Users)

If you want to include large files in git, you can use Git Large File Storage:

```bash
# Install Git LFS
git lfs install

# Track the model file
git lfs track "*.pkl"

# Add and commit
git add .gitattributes flood_prediction_model.pkl
git commit -m "Add ML model with Git LFS"
git push
```

**Note**: Git LFS requires additional setup and may have storage costs on GitHub.
