#!/bin/bash
g++ -g ./objectDetect.cpp -o objectDetect.exe `pkg-config --cflags opencv` `pkg-config --libs opencv`
