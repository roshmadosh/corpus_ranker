#!/bin/bash

# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 939823452077.dkr.ecr.us-east-1.amazonaws.com

npm run build

docker build -t corpus-ranker .

docker tag corpus-ranker:latest 939823452077.dkr.ecr.us-east-1.amazonaws.com/corpus-ranker:latest

docker push 939823452077.dkr.ecr.us-east-1.amazonaws.com/corpus-ranker:latest