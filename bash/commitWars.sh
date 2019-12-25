#!/bin/bash
RESULTS=()
output=$(cd repository && git log --all --no-merges --pretty=format:"%hŶ%anŶ%adŶ%sŶ" --author="$1" --since="$2" --before="$3")
RESULTS+=("$output")

echo
printf "%s" "${RESULTS[@]}"
echo