import torch
import torch.nn as nn

# Define a simple neural network
model = nn.Sequential(
    nn.Linear(10, 20),
    nn.ReLU(),
    nn.Linear(20, 1)
)

# Random input
x = torch.randn(5, 10)

# Forward pass
output = model(x)
print(output)

