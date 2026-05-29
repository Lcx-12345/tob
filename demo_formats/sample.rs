#[derive(Debug)]
struct Tool {
    name: &'static str,
    tool_type: &'static str,
    desc: &'static str,
}

fn main() {
    let tools = vec![
        Tool { name: "TodoWrite", tool_type: "交互", desc: "创建和管理任务列表" },
        Tool { name: "Skill", tool_type: "命令", desc: "调用内置技能" },
        Tool { name: "SearchCodebase", tool_type: "搜索", desc: "语义搜索代码库" },
        Tool { name: "Glob", tool_type: "文件", desc: "按模式匹配文件" },
        Tool { name: "LS", tool_type: "文件", desc: "列出目录内容" },
        Tool { name: "Grep", tool_type: "搜索", desc: "正则搜索文件内容" },
        Tool { name: "Read", tool_type: "文件", desc: "读取文件内容" },
        Tool { name: "WebSearch", tool_type: "搜索", desc: "搜索互联网" },
        Tool { name: "WebFetch", tool_type: "搜索", desc: "获取网页内容" },
        Tool { name: "RunCommand", tool_type: "命令", desc: "执行终端命令" },
        Tool { name: "Write", tool_type: "文件", desc: "写入文件" },
        Tool { name: "SearchReplace", tool_type: "文件", desc: "搜索替换文件内容" },
        Tool { name: "DeleteFile", tool_type: "文件", desc: "删除文件" },
        Tool { name: "AskUserQuestion", tool_type: "交互", desc: "向用户提问" },
        Tool { name: "Schedule", tool_type: "调度", desc: "管理定时调度" },
        Tool { name: "Task", tool_type: "命令", desc: "启动子代理执行任务" },
    ];

    for tool in &tools {
        println!("{:?}: {} - {}", tool.name, tool.tool_type, tool.desc);
    }
}
