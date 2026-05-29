import kotlin.system.exitProcess

data class Tool(
    val name: String,
    val category: String,
    val description: String
)

fun main() {
    val tools = listOf(
        Tool("Write", "文件操作", "写入文件到本地文件系统"),
        Tool("Read", "文件操作", "读取本地文件"),
        Tool("RunCommand", "命令执行", "执行终端命令"),
        Tool("WebSearch", "网络", "搜索互联网")
    )

    tools.forEach { tool ->
        println("[${tool.category}] ${tool.name}: ${tool.description}")
    }

    exitProcess(0)
}
