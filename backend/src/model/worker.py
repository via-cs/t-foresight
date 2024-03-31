import math
import torch
import torch.nn as nn
from torch.nn.modules.transformer import TransformerEncoder, TransformerEncoderLayer, TransformerDecoder, TransformerDecoderLayer


class PositionalEncoding(nn.Module):
    def __init__(self, d_model, dropout=0.1, max_len=5000):
        super(PositionalEncoding, self).__init__()
        self.dropout = nn.Dropout(p=dropout)

        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0).transpose(0, 1)
        self.register_buffer('pe', pe)

    def forward(self, x):
        x = x + self.pe[:x.size(0), :]
        return self.dropout(x)


class Worker(nn.Module):
    def __init__(self, in_dim, out_dim, ninp=32, nhead=8, nhid=32, nlayers=6, dropout=0.2):
        super(Worker, self).__init__()
        self.model_type = 'TICA'
        self.ninp = ninp
        self.encoder_input_layer = nn.Linear(in_dim, ninp)
        self.decoder_input_layer = nn.Linear(out_dim, ninp)
        self.linear_mapping = nn.Linear(ninp, out_dim)
        #         self.normalize_layer = nn.Hardtanh(min_val=0, max_val=1)
        self.normalize_layer = nn.Sigmoid()
        self.pos_encoder = PositionalEncoding(ninp, dropout)
        encoder_layer = TransformerEncoderLayer(ninp, nhead, nhid, dropout)
        self.transformer_encoder = TransformerEncoder(encoder_layer, nlayers)
        decoder_layer = TransformerDecoderLayer(ninp, nhead, nhid, dropout)
        self.transformer_decoder = TransformerDecoder(decoder_layer, nlayers)

        self.src_mask = None
        self.tgt_mask = None

        if torch.cuda.is_available():
            self.device = torch.device('cuda')
        else:
            self.device = torch.device('cpu')

        self.min_coord = torch.Tensor([8240, 8220]).to(self.device)
        self.max_coord = torch.Tensor([24510, 24450]).to(self.device)

        self.init_weights()

    #     def _generate_square_subsequent_mask(self, sz):
    #         mask = (torch.triu(torch.ones(sz, sz)) == 1).transpose(0, 1)
    #         mask = mask.float().masked_fill(mask == 0, float('-inf')).masked_fill(mask == 1, float(0.0))
    #         return mask

    def generate_square_subsequent_mask(self, dim1, dim2):
        return torch.triu(torch.ones(dim1, dim2) * float('-inf'), diagonal=1)

    def init_weights(self):
        #         initrange = 0.1
        #         nn.init.uniform_(self.encoder.weight, -initrange, initrange)
        #         nn.init.zeros_(self.decoder.bias)
        #         nn.init.uniform_(self.decoder.weight, -initrange, initrange)
        nn.init.xavier_uniform_(self.encoder_input_layer.weight)
        nn.init.zeros_(self.encoder_input_layer.bias)
        nn.init.xavier_uniform_(self.decoder_input_layer.weight)
        nn.init.zeros_(self.decoder_input_layer.bias)
        nn.init.xavier_uniform_(self.linear_mapping.weight)
        nn.init.zeros_(self.linear_mapping.bias)

    def tanh(self, z):
        return (torch.exp(z) - torch.exp(-z)) / (torch.exp(z) + torch.exp(-z))

    def normalize_coord(self, coord):
        norm_coord = torch.zeros_like(coord).to(self.device)
        norm_coord[:, :, 0::2] = (coord[:, :, 0::2] - self.min_coord[0]) / (self.max_coord[0] - self.min_coord[0])
        norm_coord[:, :, 1::2] = (coord[:, :, 1::2] - self.min_coord[1]) / (self.max_coord[1] - self.min_coord[1])
        return norm_coord

    def restore_coord(self, coord):
        res_coord = coord * (self.max_coord - self.min_coord) + self.min_coord
        return res_coord

    def cal_pos(self, output, src, tgt, role):
        idx = (int(role) // 10) * 5 + int(role) % 10 - 6
        if tgt is None:
            pos = src[-1, :, idx * 2:idx * 2 + 2].unsqueeze(0)
        else:
            pos = torch.cat((src[-1, :, idx * 2:idx * 2 + 2].unsqueeze(0), tgt[:-1]), dim=0)
        #         pos = []
        #         for i in range(output.shape[0]):
        #             if i == 0:
        #                 pos.append(src[-1, :, idx*2:idx*2+2])
        #             else:
        #                 pos.append(tgt[i-1, :, :])
        #         dpos = torch.stack((output[:, :, 1] * 500 * torch.cos(torch.deg2rad(output[:, :, 0] * 360)), \
        #                             output[:, :, 1] * 500 * torch.sin(torch.deg2rad(output[:, :, 0] * 360))), \
        #                             dim=-1).to(self.device)
        dpos = torch.stack((500 * output[:, :, 0], 500 * output[:, :, 1]), dim=-1)
        #         pos = torch.stack(pos, dim=0)
        output = pos + dpos
        return output

    def forward(self, src, tgt, role, test=False, has_mask=True):
        mem = self.normalize_coord(src)
        mem = self.encoder_input_layer(mem)
        mem = self.pos_encoder(mem)
        mem = self.transformer_encoder(mem)

        role = int(role)
        idx = (role // 10) * 5 + role % 10 - 6
        if test:
            if tgt is None:
                output = src[-1, :, idx * 2:idx * 2 + 2].unsqueeze(0)
            else:
                output = torch.cat((src[-1, :, idx * 2:idx * 2 + 2].unsqueeze(0), tgt), dim=0)
        else:
            output = torch.cat((src[-1, :, idx * 2:idx * 2 + 2].unsqueeze(0), tgt[:-1]), dim=0)
        prev_pos = output
        if has_mask:
            device = mem.device
            if self.src_mask is None or self.src_mask.size(0) != len(mem):
                self.src_mask = self.generate_square_subsequent_mask(len(output), len(mem)).to(device)
            if self.tgt_mask is None or self.tgt_mask.size(0) != len(mem):
                self.tgt_mask = self.generate_square_subsequent_mask(len(output), len(output)).to(device)
        else:
            self.src_mask = None
            self.tgt_mask = None
        output = self.normalize_coord(output)
        output = self.decoder_input_layer(output)
        output = self.pos_encoder(output)
        output = self.transformer_decoder(
            tgt=output,
            memory=mem,
            tgt_mask=self.tgt_mask,
            memory_mask=self.src_mask
        )
        output = self.linear_mapping(output)
        output = self.normalize_layer(torch.clamp(output, min=-50, max=50))
        # output: [direction, distance] both in [0, 1]
        output = self.restore_coord(output)
        #         output = nn.Tanh()(output)
        #         output = torch.stack((500 * output[:, :, 0], 500 * output[:, :, 1]), dim=-1) + prev_pos
        #         output = self.cal_pos(output, src, tgt, role)

        return output