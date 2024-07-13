FROM mcr.microsoft.com/playwright:v1.45.1-jammy

EXPOSE 3000
WORKDIR /work

COPY . .
RUN npm ci

CMD ["npm", "run", "start"]
