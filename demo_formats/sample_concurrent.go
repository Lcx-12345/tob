package main

import (
	"fmt"
)

func main() {
	channel := make(chan string, 4)

	go func() {
		channel <- "Write: 写入文件到本地文件系统"
		channel <- "Read: 读取本地文件"
		channel <- "RunCommand: 执行终端命令"
		channel <- "WebSearch: 搜索互联网"
		close(channel)
	}()

	for msg := range channel {
		fmt.Println(msg)
	}
}
