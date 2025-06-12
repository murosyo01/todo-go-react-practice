FROM golang:1.24

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

RUN GOOS=linux GOARCH=arm64 go build -o main .

CMD ["./main"]
