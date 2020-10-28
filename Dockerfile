FROM squidfunk/mkdocs-material
# WORKDIR /plugins
# COPY plugins /plugins
# RUN \
#   pip install --no-cache-dir .

WORKDIR /site
# Start development server by default
ENTRYPOINT ["/site/build.sh"]
