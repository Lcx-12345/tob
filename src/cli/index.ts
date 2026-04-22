#!/usr/bin/env node
import { defineCommands } from './commands';

// 定义命令
const program = defineCommands();

// 解析命令行参数
program.parse(process.argv);
