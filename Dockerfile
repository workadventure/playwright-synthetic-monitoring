FROM mcr.microsoft.com/playwright:v1.45.1-jammy

EXPOSE 3000
WORKDIR /work

# Chromium leaves orphaned helper processes behind on every run. npm as PID 1 never
# reaps them, so they pile up as zombies until the container hits its PID limit and
# fork() starts failing. tini reaps them.
RUN apt-get update && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

COPY . .
RUN npm ci

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "run", "start"]
