#!/bin/bash

echo "=== SOLO 内置工具列表 ==="
echo ""

declare -a TOOLS=(
    "TodoWrite|交互|创建和管理任务列表"
    "Skill|命令|调用内置技能#!/bin/bash

echo "=== SOLO 内置工具列表 ==="
echo ""

declare -a TOOLS=(
    "TodoWrite|交互|创建和管理任务列表"
    "Skill|命令|调用内置技能"
#!/bin/bash

echo "=== SOLO 内置工具列表 ==="
echo ""

declare -a TOOLS=(
    "TodoWrite|交互|创建和管理任务列表"
    "Skill|命令|调用内置技能"
    "SearchCodebase|搜索|语义搜索代码库"
    "Glob|文件|按模式匹配文件"
    "LS|文件|列出目录内容"
    "Grep|搜索|正则搜索文件内容"
    "#!/bin/bash

echo "=== SOLO 内置工具列表 ==="
echo ""

declare -a TOOLS=(
    "TodoWrite|交互|创建和管理任务列表"
    "Skill|命令|调用内置技能"
    "SearchCodebase|搜索|语义搜索代码库"
    "Glob|文件|按模式匹配文件"
    "LS|文件|列出目录内容"
    "Grep|搜索|正则搜索文件内容"
    "Read|文件|读取文件内容"
    "WebSearch|搜索|搜索互联网"
    "WebFetch|搜索|获取网页内容"
    "RunCommand|命令|执行终端命令"
    "Write|文件|写入文件"
    "SearchReplace|文件|搜索替换文件内容"
    "DeleteFile|文件|删除文件"
    "AskUserQuestion|交互|向用户提问"
    "Schedule|调度|管理定时调度"
    "Task|命令|#!/bin/bash

echo "=== SOLO 内置工具列表 ==="
echo ""

declare -a TOOLS=(
    "TodoWrite|交互|创建和管理任务列表"
    "Skill|命令|调用内置技能"
    "SearchCodebase|搜索|语义搜索代码库"
    "Glob|文件|按模式匹配文件"
    "LS|文件|列出目录内容"
    "Grep|搜索|正则搜索文件内容"
    "Read|文件|读取文件内容"
    "WebSearch|搜索|搜索互联网"
    "WebFetch|搜索|获取网页内容"
    "RunCommand|命令|执行终端命令"
    "Write|文件|写入文件"
    "SearchReplace|文件|搜索替换文件内容"
    "DeleteFile|文件|删除文件"
    "AskUserQuestion|交互|向用户提问"
    "Schedule|调度|管理定时调度"
    "Task|命令|启动#!/bin/bash

echo "=== SOLO 内置工具列表 ==="
echo ""

declare -a TOOLS=(
    "TodoWrite|交互|创建和管理任务列表"
    "Skill|命令|调用内置技能"
    "SearchCodebase|搜索|语义搜索代码库"
    "Glob|文件|按模式匹配文件"
    "LS|文件|列出目录内容"
    "Grep|搜索|正则搜索文件内容"
    "Read|文件|读取文件内容"
    "WebSearch|搜索|搜索互联网"
    "WebFetch|搜索|获取网页内容"
    "RunCommand|命令|执行终端命令"
    "Write|文件|写入文件"
    "SearchReplace|文件|搜索替换文件内容"
    "DeleteFile|文件|删除文件"
    "AskUserQuestion|交互|向用户提问"
    "Schedule|调度|管理定时调度"
    "Task|命令|启动子代理执行任务"
)

for tool in "${TOOLS[@]}"; do
    IFS='|' read -r name type desc <<< "$tool"
    printf "%-20s [%s]: %s\n" "$name" "$type