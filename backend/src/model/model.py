import json
import os

import torch

from src.model.mng import Manager
from src.model.worker import Worker


class Model:
    @staticmethod
    def load(model_folder, M=283, lc=10, lx=30, ly=10):
        with open(os.path.join(model_folder, "config.json")) as f:
            config = json.load(f)
        mng = Manager(in_dim=M * lc, out_dim=20)
        mng.load_state_dict(torch.load(os.path.join(model_folder, "mng.pt")))
        workers = []
        for i in range(config['num_workers']):
            worker = Worker(in_dim=lx, out_dim=ly)
            worker.load_state_dict(torch.load(os.path.join(model_folder, "w{i}.pt")))
            workers.append(worker)
        model = Model(mng, workers)
        return model

    def __init__(self, mng, workers):
        self.K = len(workers)
        self.mng = mng
        self.workers = workers

    def predict(self, inst):
        probs = self.mng(inst['c'])
        return [{
            "idx": i,
            "trajectory": self.workers[i](inst['tx']),
            "probability": probs[i],
            "attention": self.mng.att_map[i],
        } for i in range(self.K)]
