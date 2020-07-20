#!/usr/bin/env sh


git checkout test
git checkout dev -- build/**
git checkout dev -- config/**
git checkout dev -- src/**
git checkout dev -- static/**
git checkout dev -- package.json
git checkout dev -- index.html