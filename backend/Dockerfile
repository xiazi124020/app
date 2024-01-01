FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
#RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

RUN wget -O /usr/local/bin/wait-for https://github.com/eficode/wait-for/releases/download/v2.1.0/wait-for && \
    chmod +x /usr/local/bin/wait-for
RUN apt-get update && apt-get install -y netcat-openbsd

#RUN apt-get update && apt-get install -y netcat


# Expose port 8000
EXPOSE 8000

# Start the FastAPI application
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
#CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000"]
ENTRYPOINT ["wait-for", "postgres:5432", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]