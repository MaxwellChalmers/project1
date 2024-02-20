# Use an official Node.js runtime as the base image for building the React frontend
FROM node:lts AS build-frontend

WORKDIR /app

COPY src/ui/package.json src/ui/package-lock.json ./
RUN npm install

COPY src/ui ./
RUN npm run build

# Use another stage for the backend
FROM python:3.11

WORKDIR /app

# Copy the Python dependencies file
COPY pyproject.toml poetry.lock ./

# Install Poetry
RUN pip install poetry

# Install Python dependencies
RUN poetry install



# Copy the React build from the previous stage
COPY --from=build-frontend /app/build /app/ui/build

# Expose the necessary port(s) if your application requires it
# EXPOSE 8000

# Command to run your application
CMD ["poetry", "run", "uvicorn", "server:app", "--host", "0.0.0.0"]


