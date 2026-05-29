from dataclasses import dataclass
from typing import List


@dataclass
class Tool:
    name: str
    category: str
    description: str


def main():
    tools: List[Tool] = [
        Tool("Write", "文件操作", "写入文件到本地文件系统"),
        Tool("Read", "文件操作", "读取本地文件"),
        Tool("RunCommand", "命令执行", "执行终端命令"),
        Tool("WebSearch", "网络", "搜索互联网"),
    ]

    for tool in tools:
        print(f"[{tool.category}] {tool.name}: {tool.description}")


if __name__ == "__main__":
    main()
