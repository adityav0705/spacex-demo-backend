#!/bin/bash

docker-compose -p spacex -f infrastructure/common.yml up --build --remove-orphans --abort-on-container-exit
