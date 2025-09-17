#!/usr/bin/env bash
set -x
trap read debug

docker scout quickview redis:7

docker scout quickview docker-workshop:latest
docker scout cves docker-workshop:latest