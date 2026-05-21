from typing import List, Callable, Any, Optional
from dataclasses import dataclass
import random


@dataclass
class SortResult:
    sorted_list: List[Any]
    comparisons: int
    swaps: int


def quick_sort(
    arr: List[Any],
    key: Optional[Callable[[Any], Any]] = None,
    reverse: bool = False,
    inplace: bool = True
) -> SortResult:
    if not arr:
        return SortResult(sorted_list=[], comparisons=0, swaps=0)

    comparisons = 0
    swaps = 0

    if not inplace:
        arr = arr.copy()

    def get_compare_value(x: Any) -> Any:
        return key(x) if key else x

    def partition(low: int, high: int) -> int:
        nonlocal comparisons, swaps

        pivot_idx = random.randint(low, high)
        pivot_val = get_compare_value(arr[pivot_idx])

        arr[low], arr[pivot_idx] = arr[pivot_idx], arr[low]
        swaps += 1

        i = low + 1
        j = high

        while True:
            while i <= j:
                if get_compare_value(arr[i]) > pivot_val if reverse else get_compare_value(arr[i]) < pivot_val:
                    comparisons += 1
                    break
                comparisons += 1
                i += 1

            while i <= j:
                if get_compare_value(arr[j]) < pivot_val if reverse else get_compare_value(arr[j]) > pivot_val:
                    comparisons += 1
                    break
                comparisons += 1
                j -= 1

            if i >= j:
                break

            arr[i], arr[j] = arr[j], arr[i]
            swaps += 1
            i += 1
            j -= 1

        arr[low], arr[j] = arr[j], arr[low]
        swaps += 1

        return j

    def quicksort_recursive(low: int, high: int):
        nonlocal comparisons

        if low < high:
            comparisons += 1
            pivot_idx = partition(low, high)
            quicksort_recursive(low, pivot_idx - 1)
            quicksort_recursive(pivot_idx + 1, high)

    quicksort_recursive(0, len(arr) - 1)

    return SortResult(sorted_list=arr, comparisons=comparisons, swaps=swaps)


def quick_sort_inplace(arr: List[Any], key: Optional[Callable] = None, reverse: bool = False):
    result = quick_sort(arr, key, reverse, inplace=True)
    return result.sorted_list


def three_way_quick_sort(
    arr: List[Any],
    key: Optional[Callable[[Any], Any]] = None,
    reverse: bool = False
) -> SortResult:
    if not arr:
        return SortResult(sorted_list=[], comparisons=0, swaps=0)

    comparisons = 0
    swaps = 0

    arr = arr.copy()

    def get_compare_value(x: Any) -> Any:
        return key(x) if key else x

    def partition(low: int, high: int):
        nonlocal comparisons, swaps

        pivot_val = get_compare_value(arr[low])
        i = low
        lt = low
        gt = high

        while i <= gt:
            val = get_compare_value(arr[i])

            if (val < pivot_val if not reverse else val > pivot_val):
                comparisons += 1
                arr[i], arr[lt] = arr[lt], arr[i]
                swaps += 1
                i += 1
                lt += 1
            elif (val > pivot_val if not reverse else val < pivot_val):
                comparisons += 1
                arr[i], arr[gt] = arr[gt], arr[i]
                swaps += 1
                gt -= 1
            else:
                i += 1

        return lt, gt

    def quicksort_recursive(low: int, high: int):
        nonlocal comparisons

        if low < high:
            comparisons += 1
            lt, gt = partition(low, high)
            quicksort_recursive(low, lt - 1)
            quicksort_recursive(gt + 1, high)

    quicksort_recursive(0, len(arr) - 1)

    return SortResult(sorted_list=arr, comparisons=comparisons, swaps=swaps)


def quick_select(arr: List[Any], k: int, key: Optional[Callable] = None) -> Any:
    if k < 0 or k >= len(arr):
        raise ValueError(f"k 必须在 0 到 {len(arr)-1} 之间")

    arr = arr.copy()

    def get_compare_value(x: Any) -> Any:
        return key(x) if key else x

    def partition(low: int, high: int, pivot_idx: int) -> int:
        pivot_val = get_compare_value(arr[pivot_idx])
        arr[low], arr[pivot_idx] = arr[pivot_idx], arr[low]

        i = low + 1
        j = high

        while True:
            while i <= j and get_compare_value(arr[i]) <= pivot_val:
                i += 1
            while i <= j and get_compare_value(arr[j]) >= pivot_val:
                j -= 1
            if i >= j:
                break
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
            j -= 1

        arr[low], arr[j] = arr[j], arr[low]
        return j

    low = 0
    high = len(arr) - 1

    while True:
        if low == high:
            return arr[low]

        pivot_idx = random.randint(low, high)
        pivot_idx = partition(low, high, pivot_idx)

        if k == pivot_idx:
            return arr[k]
        elif k < pivot_idx:
            high = pivot_idx - 1
        else:
            low = pivot_idx + 1


def print_banner():
    print("╔" + "═" * 48 + "╗")
    print("║" + " 快速排序算法工具 ".center(48) + "║")
    print("╚" + "═" * 48 + "╝")


def print_menu():
    print("\n功能菜单:")
    print("  1. 基本快速排序      2. 三向切分快排")
    print("  3. 获取第K小元素     4. 性能对比测试")
    print("  0. 退出")


def test_basic_quicksort():
    print("\n" + "─" * 40)
    print("基本快速排序演示")
    print("─" * 40)

    test_cases = [
        ("随机数组", [random.randint(1, 100) for _ in range(10)]),
        ("已排序数组", list(range(10))),
        ("逆序数组", list(range(10, 0, -1))),
        ("含重复元素", [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]),
        ("字符串数组", ["banana", "apple", "cherry", "date"]),
        ("字典列表", [
            {"name": "Alice", "age": 25},
            {"name": "Bob", "age": 30},
            {"name": "Charlie", "age": 20}
        ])
    ]

    for name, arr in test_cases:
        original = arr.copy()
        result = quick_sort(arr.copy())

        print(f"\n{name}:")
        print(f"  原始: {original}")
        print(f"  结果: {result.sorted_list}")
        print(f"  比较: {result.comparisons}, 交换: {result.swaps}")


def test_three_way_quicksort():
    print("\n" + "─" * 40)
    print("三向切分快速排序演示")
    print("─" * 40)

    arr_with_dups = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9]

    print(f"\n原数组: {arr_with_dups}")
    result = three_way_quick_sort(arr_with_dups)
    print(f"排序后: {result.sorted_list}")
    print(f"比较次数: {result.comparisons}, 交换次数: {result.swaps}")


def test_quick_select():
    print("\n" + "─" * 40)
    print("快速选择算法演示")
    print("─" * 40)

    arr = [random.randint(1, 100) for _ in range(15)]
    print(f"\n数组: {arr}")

    for k in [0, 4, 7, len(arr) - 1]:
        result = quick_select(arr, k)
        print(f"第 {k+1} 小的元素: {result}")


def benchmark():
    print("\n" + "─" * 40)
    print("性能对比测试")
    print("─" * 40)

    sizes = [100, 1000, 5000]
    results = []

    for size in sizes:
        arr = [random.randint(1, 10000) for _ in range(size)]

        result_basic = quick_sort(arr.copy())
        result_3way = three_way_quick_sort(arr.copy())

        results.append({
            "size": size,
            "basic": result_basic,
            "3way": result_3way
        })

        print(f"\n数组大小: {size}")
        print(f"  基本快排 - 比较: {result_basic.comparisons}, 交换: {result_basic.swaps}")
        print(f"  三向快排 - 比较: {result_3way.comparisons}, 交换: {result_3way.swaps}")

    print("\n" + "─" * 40)
    print("分析: 三向切分对重复元素多的数组效率更高")
    print("─" * 40)


def interactive_mode():
    print("\n" + "─" * 40)
    print("交互模式")
    print("─" * 40)

    print("\n输入数字列表 (空格分隔, 回车确认):")
    user_input = input("> ").strip()

    try:
        if user_input:
            arr = [int(x.strip()) for x in user_input.split()]
        else:
            arr = [random.randint(1, 100) for _ in range(10)]

        print(f"\n原始数组: {arr}")

        reverse = input("降序排列? (y/n): ").lower() == 'y'
        use_3way = input("使用三向切分? (y/n): ").lower() == 'y'

        if use_3way:
            result = three_way_quick_sort(arr, reverse=reverse)
        else:
            result = quick_sort(arr, reverse=reverse)

        print(f"\n排序结果: {result.sorted_list}")
        print(f"比较次数: {result.comparisons}")
        print(f"交换次数: {result.swaps}")

    except ValueError as e:
        print(f"输入错误: {e}")


def main():
    print_banner()

    while True:
        print_menu()
        choice = input("\n请选择功能 (0-4): ").strip()

        if choice == "0":
            print("\n再见!")
            break

        elif choice == "1":
            test_basic_quicksort()

        elif choice == "2":
            test_three_way_quicksort()

        elif choice == "3":
            test_quick_select()

        elif choice == "4":
            benchmark()

        elif choice == "5":
            interactive_mode()


if __name__ == "__main__":
    main()
