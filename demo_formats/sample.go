package main

import (
	"fmt"
)

type Tool struct {
	Name        string
	Category    string
	Description string
}

func main() {
	tools := []Tool{
		{"Write", "文件操作", "写入文件到本地文件系统"},
		{"Read", "文件操作", "读取本地文件"},
		{"RunCommand", "命令执行", "执行终端命令"},
		{"WebSearch", "网络", "搜索互联网"},
	}

	for _, tool := range tools {
		fmt.Printf("[%s] %s: %s\n", tool.Category, tool.Name, tool.Description)
	}
}
