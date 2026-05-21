#!/usr/bin/env python3


def main():
    messages = ["Hello", "World", "Python", "Loop", "Demo"]

    for i, msg in enumerate(messages, 1):
        print(f"{i}. {msg}")

    print("\n逆序输出:")
    for msg in reversed(messages):
        print(f"- {msg}")


if __name__ == "__main__":
    main()
