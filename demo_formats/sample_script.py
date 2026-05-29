#!/usr/bin/env python3
"""Python脚本示例"""

import sys
import platform


def main():
    print("=== 工具演示脚本 ===")
    print(f"Python版本: {platform.python_version()}")
    print(f"平台: {platform.platform()}")
    print(f"参数: {sys.argv}")
    print("=== 完成 ===")


if __name__ == "__main__":
    main()
