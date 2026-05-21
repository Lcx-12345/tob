package main

import "fmt"

func main() {
    messages := []string{"Hello", "World", "Go", "Loop", "Demo"}

    for i, msg := range messages {
        fmt.Printf("%d. %s\n", i+1, msg)
    }

    fmt.Println("\n逆序输出:")
    for i := len(messages) - 1; i >= 0; i-- {
        fmt.Printf("- %s\n", messages[i])
    }
}
