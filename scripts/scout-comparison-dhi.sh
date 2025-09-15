set -x
trap read debug

docker build -t docker-workshop:dhi .

docker scout compare --to docker-workshop:latest docker-workshop:dhi