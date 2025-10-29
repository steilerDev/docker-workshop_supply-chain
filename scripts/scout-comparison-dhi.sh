set -x
trap read debug

docker build --provenance=mode=max -t docker-workshop:dhi .

docker scout compare --to docker-workshop:latest docker-workshop:dhi