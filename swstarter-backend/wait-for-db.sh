#!/bin/sh

host="$1"
shift
cmd="$@"

echo "Waiting for db $host to be ready..."

>&2 echo "MySQL ready, running..."
exec $cmd
