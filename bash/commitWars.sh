#!/bin/bash
echo $(cd $1 && git log --all --no-merges --pretty=format:"ŶŶŶŶ%hŶŶŶŶ%anŶŶŶŶ%adŶŶŶŶ%sŶŶŶŶ" --name-only --author="$2" --since="$3" --before="$4" -1)