#!/bin/bash
echo $(cd $1 && git log --all --no-merges --pretty=format:"%hŶ%anŶ%adŶ%sŶ" --author="$2" --since="$3" --before="$4")