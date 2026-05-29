interface Tool {
    name: string;
    type: string;
    desc: string;
}

const TOOLS: Tool[] = [
    { name: "TodoWrite", type: "交互", desc: "创建和管理任务列表" },
    { name: "Skill", type: "命令", desc: "调用内置技能" },
    { name: "SearchCodebase", type: "搜索", desc: "语义搜索代码库" },
    { name: "Glob", type: "文件", desc: "按模式匹配文件" },
    { name: "LS", type: "文件", desc: "列出目录内容" },
    { name: "Grep", type: "搜索", desc: "正则搜索文件内容" },
    { name: "Read", type: "文件", desc: "读取文件内容" },
    { name: "WebSearch", type: "搜索", desc: "搜索互联网" },
    { name: "WebFetch", type: "搜索", desc: "获取网页内容" },
    { name: "RunCommand", type: "命令", desc: "执行终端命令" },
    { name: "Write", type: "文件", desc: "写入文件" },
    { name: "SearchReplace", type: "文件", desc: "搜索替换文件内容" },
    { name: "DeleteFile", type: "文件", desc: "删除文件" },
    { name: "AskUserQuestion", type: "交互", desc: "向用户提问" },
    { name: "Schedule", type: "调度", desc: "管理定时调度" },
    { name: "Task", type: "命令", desc: "启动子代理执行任务" },
];

function getToolsByType(type: string): Tool[] {
    return TOOLS.filter(t => t.type === type);
}

function printAllTools(): void {
    const types = [...new Set(TOOLS.map(t => t.type))];
    types.forEach(type => {
        console.log(`\n=== ${type}类工具 ===`);
        getToolsByType(type).forEach(t => {
            console.log(`  ${t.name}: ${t.desc}`);
        });
    });
}

printAllTools();
