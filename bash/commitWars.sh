#!/bin/bash
echo $(cd repository && git log --all --no-merges --pretty=format:"%hŶ%anŶ%adŶ%sŶ" --author="$1" --since="$2" --before="$3")