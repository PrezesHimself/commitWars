#!/bin/bash
DIR="repository/.git"
if [ -d "$DIR" ]; then
  RESULTS=()
  output=$(cd repository && git status)
  RESULTS+=("$output")

  echo
  printf "%s" "${RESULTS[@]}"
  echo
else
    ###  Control will jump here if $DIR does NOT exists ###
  echo "Error: ${DIR} not found. Can not continue."
  exit 1
fi