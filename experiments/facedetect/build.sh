#!/bin/bash
g++ -g ./objectDetect.cpp `pkg-config --cflags opencv` `pkg-config --libs opencv`
