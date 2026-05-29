from dataclasses import dataclass
from typing import List

@dataclass
class Tool:
    name: str
    type: str
    desc: str

TOOLS: List[Tool] = [
    Tool("TodoWrite", "交互", "创建和管理任务列表"),
    Tool("Skill", "命令", "调用内置技能"),
    Tool("SearchCodebase", "搜索", "语义搜索代码库"),
    Tool("Glob", "文件", "按模式匹配文件"),
    Tool("LS", "文件", "列出目录内容"),
    Tool("Grep", "搜索", "正则搜索文件内容"),
    Tool("Read", "文件", "读取文件内容"),
    Tool("WebSearch", "搜索", "搜索互联网"),
    Tool("WebFetch", "搜索", "获取网页内容"),
    Tool("RunCommand", "命令", "执行终端命令"),
    Tool("Write", "文件", "写入文件"),
    Tool("SearchReplace", "文件", "搜索替换文件内容"),
    Tool("DeleteFile", "文件", "删除文件"),
    Tool("AskUserQuestion", "交互", "向用户提问"),
    Tool("Schedule", "调度", "管理定时调度"),
    Tool("Task", "命令", "启动子代理执行任务"),
]

def get_tools_by_type(tool_type: str) -> List[Tool]:
    return [t for t in TOOLS if t.type == tool_type]

def print_all_tools():
    types = sorted(set(t.type for t in TOOLS))
    for tool_type in types:
        print(f"\n=== {tool_type}类工具 ===")
        for tool in get_tools_by_type(tool_type):
            print(f"  {tool.name}: {tool.desc}")

if __name__ == "__main__":
    print_all_tools()
