const url = uri => `http://10.76.6.131:8787${uri}`;

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