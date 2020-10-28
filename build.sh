#! /bin/sh
python3 script/autherList.py
mkdocs build
cat cslg.info > docs/CNAME