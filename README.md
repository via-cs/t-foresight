## T-Foresight

#### This is the repository for submission T-Foresight: Interpret Moving Strategies based on Context-Aware Trajectory Prediction.

This repository provides the source codes.

### How to run it

We have a frontend (T-Foresight, in the folder `frontend\`) and a backend (the implementation of our proposed analytics workflow, in the folder `backend\`).
To save your review time, we provide the analysis progress of our domain experts for review (in the folder `case\`), so that you can just run the frontend and explore our system.

**Frontend**. Our frontend is built based on Vite, React, and MobX. You can run it in three steps.
1. *Install dependencies*. Please run `cd frontend` to change the root directory as `frontend\` and then run `yarn install` to install necessary dependencies.
2. *Run the interface*. Run `run dev` to start the user interface and open `http://localhost:5173` in your explorer (Chrome is recommended). Now, you can see the user interface.
3. *Load the data*. At the app bar, click on `IMPORT DATA` and select the file `case\secret_tundra.json` to load the game. Then click on `IMPORT CASE` and select one of the other two files, either `secret_tundra-case1.json` or `secret_tundra-case2.json`, to load the analysis progress. Now, you can explore the case!

**Backend**. Our backend is build based on FastAPI. You can use it in two steps.
1. *Install dependencies*. Please run `cd backend` to change the root directory as `backend\` and run `pip install -r requirements.text` to install necessary packages.
2. *Run the server*. Please run `uvicorn main:app --reload` to start the server. But we cannot upload our dataset since it is so large. So you cannot use the functions of the backend.
