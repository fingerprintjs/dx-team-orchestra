FROM golang:1.23-alpine

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o myapp .

EXPOSE 8081

CMD ["./myapp"]
