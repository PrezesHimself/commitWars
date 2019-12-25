#!/bin/bash
DIR="repository/.git"
RESULTS=()
output=$(cd repository && git status)
RESULTS+=("$output")

echo
printf "%s" "${RESULTS[@]}"
echo