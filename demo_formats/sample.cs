using System;
using System.Collections.Generic;

namespace Demo
{
    class Tool
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            var tools = new List<Tool>
            {
                new Tool { Name = "Write", Category = "文件操作", Description = "写入文件到本地文件系统" },
                new Tool { Name = "Read", Category = "文件操作", Description = "读取本地文件" },
                new Tool { Name = "RunCommand", Category = "命令执行", Description = "执行终端命令" },
                new Tool { Name = "WebSearch", Category = "网络", Description = "搜索互联网" }
            };

            foreach (var tool in tools)
            {
                Console.WriteLine($"[{tool.Category}] {tool.Name}: {tool.Description}");
            }
        }
    }
}
