#!/usr/bin/env bash
CDN="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
sed -i "s~\..*bootstrap*.css~$CDN~g" dist/index.html
