import java.util.ArrayList;
import java.util.List;

public class Sample {
    static class Tool {
        String name;
        String type;
        String desc;

        Tool(String name, String type, String desc) {
            this.name = name;
            this.type = type;
            this.desc = desc;
        }
    }

    public static void main(String[] args) {
        List<Tool> tools = new ArrayList<>();
        tools.add(new Tool("TodoWrite", "交互", "创建和管理任务列表"));
        tools.add(new Tool("Skill", "命令", "调用内置技能"));
        tools.add(new Tool("SearchCodebase", "搜索", "语义搜索代码库"));
        tools.add(new Tool("Glob", "文件", "按模式匹配文件"));
        tools.add(new Tool("LS", "文件", "列出目录内容"));
        tools.add(new Tool("Grep", "搜索", "正则搜索文件内容"));
        tools.add(new Tool("Read", "文件", "读取文件内容"));
        tools.add(new Tool("WebSearch", "搜索", "搜索互联网"));
        tools.add(new Tool("WebFetch", "搜索", "获取网页内容"));
        tools.add(new Tool("RunCommand", "命令", "执行终端命令"));
        tools.add(new Tool("Write", "文件", "写入文件"));
        tools.add(new Tool("SearchReplace", "文件", "搜索替换文件内容"));
        tools.add(new Tool("DeleteFile", "文件", "删除文件"));
        tools.add(new Tool("AskUserQuestion", "交互", "向用户提问"));
        tools.add(new Tool("Schedule", "调度", "管理定时调度"));
        tools.add(new Tool("Task", "命令", "启动子代理执行任务"));

        for (Tool t : tools) {
            System.out.printf("%s [%s]: %s%n", t.name, t.type, t.desc);
        }
    }
}
