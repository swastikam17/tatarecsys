from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app, origins=["*"])

# ── Load all pickle files ──────────────────────────────────────────
df               = pickle.load(open('products.pkl', 'rb'))
kmeans           = pickle.load(open('kmeans.pkl', 'rb'))
rf               = pickle.load(open('random_forest.pkl', 'rb'))
encoders         = pickle.load(open('encoders.pkl', 'rb'))
scaler           = pickle.load(open('scaler.pkl', 'rb'))
similarity_matrix= pickle.load(open('similarity_matrix.pkl', 'rb'))
subcat_df        = pickle.load(open('subcat_df.pkl', 'rb'))

# Column order scaler was fit on
all_cols_to_scale = [
    'Category', 'Sub_Category', 'Grade', 'Brand',
    'Application_Sector', 'Customer_Segment', 'Region',
    'Selling_Price_per_Tonne_INR', 'Sales_Volume_Tonnes',
    'Profit_Margin_Pct', 'Customer_Rating'
]

customer_features = ['Customer_Segment', 'Region',
                     'Sales_Volume_Tonnes', 'Application_Sector']

# ── Helper: recommend popular ──────────────────────────────────────
def recommend_popular(customer_segment, region, application_sector,
                      sales_volume, n=8):
    seg_encoded = encoders['Customer_Segment'].transform([customer_segment])[0]
    reg_encoded = encoders['Region'].transform([region])[0]
    app_encoded = encoders['Application_Sector'].transform([application_sector])[0]

    input_df = pd.DataFrame([[
        0, 0, 0, 0,
        app_encoded, seg_encoded, reg_encoded,
        0, sales_volume, 0, 0
    ]], columns=all_cols_to_scale)

    input_scaled    = scaler.transform(input_df)
    input_scaled_df = pd.DataFrame(input_scaled, columns=all_cols_to_scale)
    customer_input  = input_scaled_df[customer_features]

    predicted_cluster = rf.predict(customer_input)[0]

    cluster_products = df[
        (df['Cluster'] == predicted_cluster) &
        (df['Customer_Segment'] == customer_segment)
    ]
    if len(cluster_products) < n:
        cluster_products = df[df['Cluster'] == predicted_cluster]

    recs = (cluster_products
            .sort_values('popularity_score', ascending=False)
            .drop_duplicates(subset=['Sub_Category'])
            .head(n))

    return predicted_cluster, recs[['Sub_Category', 'Brand', 'Grade',
                                     'Selling_Price_per_Tonne_INR',
                                     'Customer_Rating', 'popularity_score']]

# ── Helper: recommend similar ──────────────────────────────────────
def recommend_similar(selected_subcategory, n=5):
    idx    = subcat_df[subcat_df['Sub_Category'] == selected_subcategory].index[0]
    scores = sorted(enumerate(similarity_matrix[idx]),
                    key=lambda x: x[1], reverse=True)[1:n+1]

    similar_subcats  = [subcat_df.iloc[i[0]]['Sub_Category'] for i in scores]
    similar_products = df[df['Sub_Category'].isin(similar_subcats)]

    return (similar_products
            .sort_values('popularity_score', ascending=False)
            .drop_duplicates(subset=['Sub_Category'])
            [['Sub_Category', 'Brand', 'Grade',
              'Selling_Price_per_Tonne_INR', 'Customer_Rating']])

# ── Routes ─────────────────────────────────────────────────────────
@app.route('/api/options', methods=['GET'])
def get_options():
    """Return valid dropdown options for the form."""
    return jsonify({
        'segments':  sorted(df['Customer_Segment'].unique().tolist()),
        'regions':   sorted(df['Region'].unique().tolist()),
        'sectors':   sorted(df['Application_Sector'].unique().tolist()),
        'subcategories': sorted(df['Sub_Category'].unique().tolist()),
    })

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    customer_segment   = data.get('customer_segment')
    region             = data.get('region')
    application_sector = data.get('application_sector')
    sales_volume       = float(data.get('sales_volume', 2000))

    cluster, popular_df = recommend_popular(
        customer_segment, region, application_sector, sales_volume
    )

    return jsonify({
        'cluster': int(cluster),
        'recommendations': popular_df.to_dict(orient='records')
    })

@app.route('/api/similar', methods=['POST'])
def similar():
    data = request.get_json()
    subcategory = data.get('subcategory')
    similar_df  = recommend_similar(subcategory)
    return jsonify({
        'similar': similar_df.to_dict(orient='records')
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
