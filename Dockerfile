# ---------- Build Stage ----------
  FROM node:20-alpine AS build
  WORKDIR /app
  
  # Copy dependency definitions
  COPY package.json yarn.lock ./
  RUN yarn install --frozen-lockfile
  
  # Copy source code and other necessary files
  COPY . .
  
  # Build the application (outputs to /app/dist)
  RUN yarn build
  
  # ---------- Run Stage ----------
  FROM node:20-alpine AS run
  WORKDIR /app
  
  # Copy built app and dependencies only
  COPY --from=build /app/dist ./dist
  COPY --from=build /app/node_modules ./node_modules
  COPY --from=build /app/package.json ./
  COPY --from=build /app/tsconfig.json ./
  
  # ✅ Add Firebase service account file
  COPY jokeninja-firebase-adminsdk.json ./jokeninja-firebase-adminsdk.json
  
  # You can switch between dev and prod below:
  CMD ["yarn", "start:dev"]
  # For production: CMD ["yarn", "start:prod"]
  
  EXPOSE 3000