"""Python 演示文件 - Write 工具生成，Edit 工具已修改此行"""


def fibonacci(n: int) -> list[int]:
    """计算斐波那契数列"""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]


if __name__ == "__main__":
    print(fibonacci(10))
