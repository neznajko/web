#!/bin/bash

echo "Tes_ings"

for(( j = 1; j <= 20; j++ )); do
    echo $j
    cat _esting/output${j}.json
    echo
    make mindif < _esting/input${j}.json
done
