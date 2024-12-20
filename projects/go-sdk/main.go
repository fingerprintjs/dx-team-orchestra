package main

import (
	"fmt"
	"go-sdk/handlers"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/getEvents", handlers.GetEvents)
	http.HandleFunc("/updateEvent", handlers.UpdateEvent)

	http.HandleFunc("/getVisits", handlers.GetVisits)
	http.HandleFunc("/deleteVisitorData", handlers.DeleteVisitorData)

	http.HandleFunc("/getRelatedVisitors", handlers.GetRelatedVisitors)

	http.HandleFunc("/unseal", handlers.Unseal)

	fmt.Println("Server is running on port 8081...")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal(err)
	}
}
