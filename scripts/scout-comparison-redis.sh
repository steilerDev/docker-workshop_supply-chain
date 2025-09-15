set -x
trap read debug

docker scout compare --to redis:7 docker/dhi-redis:7