#! /bin/sh
python3 script/autherList.py
mkdocs build
echo cslg.info > docs/CNAME