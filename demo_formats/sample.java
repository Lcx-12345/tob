public class Sample {
    public static void main(String[] args) {
        Tool[] tools = {
            new Tool("Write", "文件操作", "写入文件到本地文件系统"),
            new Tool("Read", "文件操作", "读取本地文件"),
            new Tool("RunCommand", "命令执行", "执行终端命令"),
            new Tool("WebSearch", "网络", "搜索互联网")
        };

        for (Tool tool : tools) {
            System.out.println(tool);
        }
    }
}

class Tool {
    String name;
    String category;
    String description;

    Tool(String name, String category, String description) {
        this.name = name;
        this.category = category;
        this.description = description;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s: %s", category, name, description);
    }
}
