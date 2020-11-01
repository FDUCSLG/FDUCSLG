FROM squidfunk/mkdocs-material
RUN pip3 install mkdocs-git-authors-plugin
# WORKDIR /plugins
# COPY plugins /plugins
# RUN \
#   pip install --no-cache-dir .
WORKDIR /site
# Start development server by default
EXPOSE 8000
ENTRYPOINT ["/bin/sh"]
CMD ["build.sh"]
