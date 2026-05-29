#include <iostream>
#include <string>
#include <vector>

struct Tool {
    std::string name;
    std::string category;
    std::string description;
};

int main() {
    std::vector<Tool> tools = {
        {"Write", "文件操作", "写入文件到本地文件系统"},
        {"Read", "文件操作", "读取本地文件"},
        {"RunCommand", "命令执行", "执行终端命令"},
        {"WebSearch", "网络", "搜索互联网"},
    };

    for (const auto& tool : tools) {
        std::cout << "[" << tool.category << "] " << tool.name << ": " << tool.description << std::endl;
    }

    return 0;
}
