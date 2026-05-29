use std::fmt;

struct Tool {
    name: &'static str,
    category: &'static str,
    description: &'static str,
}

impl fmt::Display for Tool {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{}] {}: {}", self.category, self.name, self.description)
    }
}

fn main() {
    let tools = vec![
        Tool { name: "Write", category: "文件操作", description: "写入文件到本地文件系统" },
        Tool { name: "Read", category: "文件操作", description: "读取本地文件" },
        Tool { name: "RunCommand", category: "命令执行", description: "执行终端命令" },
        Tool { name: "WebSearch", category: "网络", description: "搜索互联网" },
    ];

    for tool in &tools {
        println!("{}", tool);
    }
}
