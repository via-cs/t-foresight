import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.nn.modules.transformer import TransformerEncoder, TransformerEncoderLayer, TransformerDecoder, TransformerDecoderLayer
import numpy as np

class Manager(nn.Module):
    def __init__(self, in_dim, out_dim, ninp=32, nhead=8, nhid=32, nlayers=6, dropout=0.2):
        super(Manager, self).__init__()
        self.model_type = 'Manager'
        self.src_mask = None
        encoder_layers = TransformerEncoderLayer(ninp, nhead, nhid, dropout)
        self.transformer_encoder = TransformerEncoder(encoder_layers, nlayers)
        self.encoder = nn.Linear(in_dim, ninp)
        self.ninp = ninp
        self.in_dim = in_dim
        self.out_dim = out_dim
        self.decoder = nn.Linear(ninp, out_dim)
        self.att_map = np.array(out_dim, ninp)

    #         self.init_weights()

    def _generate_square_subsequent_mask(self, sz):
        mask = (torch.triu(torch.ones(sz, sz)) == 1).transpose(0, 1)
        mask = mask.float().masked_fill(mask == 0, float('-inf')).masked_fill(mask == 1, float(0.0))
        return mask

    def init_weights(self):
        #         initrange = 0.1
        #         nn.init.uniform_(self.encoder.weight, -initrange, initrange)
        #         nn.init.zeros_(self.decoder.bias)
        #         nn.init.uniform_(self.decoder.weight, -initrange, initrange)
        nn.init.xavier_uniform_(self.encoder.weight)
        nn.init.zeros_(self.encoder.bias)
        nn.init.xavier_uniform_(self.decoder.weight)
        nn.init.zeros_(self.decoder.bias)

    def forward(self, src, has_mask=True):
        if has_mask:
            device = src.device
            if self.src_mask is None or self.src_mask.size(0) != len(src):
                mask = self._generate_square_subsequent_mask(len(src)).to(device)
                self.src_mask = mask
        else:
            self.src_mask = None

        output = self.encoder(src)
        #         output = self.var_embedding(output)
        #         output = self.pos_encoder(output)
        output = self.transformer_encoder(output, self.src_mask)
        output = self.decoder(output)
        output = F.softmax(output, dim=-1)

        temp = np.diag(np.ones(self.in_dim))
        for block in self.blocks:
            qkv = block.qkv(src).reshape()
            q, k, v = qkv.unbind(0)
            attn = (q @ k.transpose(-2, -1)) * self.scale
            attn = attn.softmax(dim=-1)
            attn = self.attn_drop(attn)
            temp = np.matmul(attn, temp)
        self.att_map = temp

        return output