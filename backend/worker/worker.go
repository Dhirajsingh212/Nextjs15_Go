package worker

import "fmt"

func Notification(i int) {
	for {
		fmt.Printf("Working on it %v\n", i)
	}
}
