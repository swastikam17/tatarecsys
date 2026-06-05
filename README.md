# Tata Steel Product Recommendation System

A hybrid product recommendation system built during an internship at Tata Steel. The system recommends relevant steel products to customers based on their segment, region, application sector, and buying behaviour.

**Live Demo → [tatarecsys.onrender.com](https://tatarecsys.onrender.com)**

---

## Dataset

**Tata Steel Products Dataset**
- 2,070 product transactions
- 22 features including product attributes, customer details, pricing, and ratings
- Covers 14 sub-categories across Long and Flat steel product families

---

## How It Works

The system uses a 3-layer hybrid architecture:

**Layer 1 — Customer Clustering (KMeans)**
Product transactions are clustered into 5 groups based on buying behaviour. Sub-category purchased, application sector, price range, sales volume, and region. Each cluster represents a distinct buying pattern (e.g. high-volume commodity buyers, premium B2B industrial buyers).

**Layer 2 — Cluster Prediction (Random Forest)**
A Random Forest classifier is trained on customer attributes. Segment, region, application sector, and sales volume — to predict which behavioural cluster a new customer belongs to. The top 8 most popular products from that cluster are then recommended, ranked by a combined popularity score of customer rating and sales volume.

**Layer 3 — Content Based Similarity (Cosine Similarity)**
When a customer selects a product from the recommendations, cosine similarity is computed across 14 sub-category profiles (built from median price, margin, rating, category, grade, and brand) to surface the 5 most similar product types.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Data Analysis & Modelling | Python, Pandas, NumPy, Scikit-learn |
| Visualisation | Matplotlib, Seaborn |
| Backend API | Flask, Flask-CORS |
| Frontend | React |
| Deployment | Render |

---

## Repository Structure

```
tatarecsys/
├── Backend/
│   ├── app.py                  # Flask API
│   ├── requirements.txt
│   ├── products.pkl            # Product dataset
│   ├── encoders.pkl            # Trained label encoders
│   ├── scaler.pkl              # Feature scaler
│   ├── kmeans.pkl              # KMeans clustering model
│   ├── random_forest.pkl       # Random forest model
│   ├── similarity_matrix.pkl   # Precomputed similarity matrix
│   ├── Products_EDA.ipynb      # Exploratory data analysis
│   └── RecSys.ipynb            # Recommendation system notebook
├── Frontend/
│   └── tata-recsys/
│       ├── public/
│       └── src/
│           └── App.js          # Main React app
├── .gitignore
└── README.md                   # Project documentation
```

---

## Models

| Model | Purpose | Evaluation |
|---|---|---|
| KMeans (K=5) | Cluster buying behaviour | Elbow method — optimal K=5 |
| Random Forest | Predict customer cluster | Accuracy 99.28%, CV 99.58% |
| Cosine Similarity | Find similar products | Validated by business logic |


---

## EDA Highlights

Exploratory data analysis was performed across three levels:

- **Univariate** — distribution analysis, skewness, and outlier detection across all numerical features
- **Bivariate** — correlation analysis between price, volume, rating, and profit margin; revenue breakdown by region and segment
- **Multivariate** — heatmaps revealing which customer segments buy which sub-categories and brands, and profitability by segment-product combinations


---

## Local Setup

**Backend**
```bash
cd Backend
pip install -r requirements.txt
python app.py
```

**Frontend**
```bash
cd Frontend/tata-recsys
npm install
npm start
```

Set the API URL in `App.js`:
```js
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
```
