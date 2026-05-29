#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    char category[50];
    char description[100];
} Tool;

int main() {
    Tool tools[] = {
        {"Write", "文件操作", "写入文件到本地文件系统"},
        {"Read", "文件操作", "读取本地文件"},
        {"RunCommand", "命令执行", "执行终端命令"},
        {"WebSearch", "网络", "搜索互联网"},
    };

    int count = sizeof(tools) / sizeof(tools[0]);

    for (int i = 0; i < count; i++) {
        printf("[%s] %s: %s\n", tools[i].category, tools[i].name, tools[i].description);
    }

    return 0;
}
