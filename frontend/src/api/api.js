const url = uri => `http://127.0.0.1:5000${uri}`;

const api = {
    /**
     * @param {import('src/api/API.js').PredictionRequest} params
     * @return {Promise<import('src/api/API.js').PredictionResponse>}
     */
    predict: (params) =>
        fetch(url('/prediction'), {
            method: "POST",
            body: JSON.stringify(params)
        })
}

export default api;