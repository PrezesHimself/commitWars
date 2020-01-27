#!/bin/bash
echo $(cd $1 && git log --all --no-merges --pretty=format:"%hŶŶŶŶ%anŶŶŶŶ%adŶŶŶŶ%sŶŶŶŶ" --author="$2" --since="$3" --before="$4")