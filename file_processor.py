import os
import shutil
import re
import json
import hashlib
import logging
from pathlib import Path
from typing import List, Optional, Dict, Callable, Any, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass, field, asdict
from enum import Enum
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('file_processor.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class FileSizeUnit(Enum):
    B = 1
    KB = 1024
    MB = 1024 ** 2
    GB = 1024 ** 3


@dataclass
class FileInfo:
    path: Path
    size: int
    modified_time: datetime
    created_time: datetime
    extension: str

    def to_dict(self) -> dict:
        return {
            "path": str(self.path),
            "size": self.size,
            "size_formatted": self.format_size(),
            "modified_time": self.modified_time.isoformat(),
            "created_time": self.created_time.isoformat(),
            "extension": self.extension
        }

    @staticmethod
    def format_size(size: int) -> str:
        for unit in [FileSizeUnit.GB, FileSizeUnit.MB, FileSizeUnit.KB, FileSizeUnit.B]:
            if size >= unit.value:
                return f"{size / unit.value:.2f} {unit.name}"
        return "0 B"


@dataclass
class OperationResult:
    success: bool
    operation: str
    source: str
    destination: Optional[str] = None
    error: Optional[str] = None
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class SearchFilter:
    pattern: Optional[str] = None
    extension: Optional[str] = None
    min_size: Optional[int] = None
    max_size: Optional[int] = None
    modified_after: Optional[datetime] = None
    modified_before: Optional[datetime] = None
    case_sensitive: bool = False
    regex: bool = False


class ProgressTracker:
    def __init__(self, total: int, description: str = "Processing"):
        self.total = total
        self.current = 0
        self.description = description
        self.lock = threading.Lock()
        self._running = True

    def update(self, increment: int = 1):
        with self.lock:
            self.current += increment
            if self.current % 100 == 0 or self.current == self.total:
                self._print_progress()

    def _print_progress(self):
        percent = (self.current / self.total) * 100 if self.total > 0 else 0
        bar_length = 40
        filled = int(bar_length * self.current / self.total) if self.total > 0 else 0
        bar = '█' * filled + '░' * (bar_length - filled)
        print(f"\r{self.description}: |{bar}| {self.current}/{self.total} ({percent:.1f}%)", end='', flush=True)

    def finish(self):
        with self.lock:
            self._running = False
        print()


class FileProcessor:
    def __init__(self, root_path: str, max_workers: int = 4):
        self.root_path = Path(root_path)
        if not self.root_path.exists():
            raise ValueError(f"路径不存在: {root_path}")
        self.max_workers = max_workers
        self.operation_history: List[OperationResult] = []
        self._undo_stack: List[Tuple[str, Path, Path]] = []

    def _scan_files(self, filter_obj: Optional[SearchFilter] = None) -> List[FileInfo]:
        files = []
        for file_path in self.root_path.rglob("*"):
            if not file_path.is_file():
                continue

            stat = file_path.stat()
            file_info = FileInfo(
                path=file_path,
                size=stat.st_size,
                modified_time=datetime.fromtimestamp(stat.st_mtime),
                created_time=datetime.fromtimestamp(stat.st_ctime),
                extension=file_path.suffix.lower() or "无扩展名"
            )

            if filter_obj and not self._matches_filter(file_info, filter_obj):
                continue

            files.append(file_info)
        return files

    def _matches_filter(self, file_info: FileInfo, filter_obj: SearchFilter) -> bool:
        if filter_obj.extension and file_info.extension != filter_obj.extension:
            return False
        if filter_obj.min_size and file_info.size < filter_obj.min_size:
            return False
        if filter_obj.max_size and file_info.size > filter_obj.max_size:
            return False
        if filter_obj.modified_after and file_info.modified_time < filter_obj.modified_after:
            return False
        if filter_obj.modified_before and file_info.modified_time > filter_obj.modified_before:
            return False
        if filter_obj.pattern:
            if filter_obj.regex:
                pattern = re.compile(filter_obj.pattern, 0 if filter_obj.case_sensitive else re.I)
                if not pattern.search(file_info.path.name):
                    return False
            else:
                name = file_info.path.name if filter_obj.case_sensitive else file_info.path.name.lower()
                pattern = filter_obj.pattern if filter_obj.case_sensitive else filter_obj.pattern.lower()
                if pattern not in name:
                    return False
        return True

    def batch_rename(
        self,
        pattern: str,
        replacement: str,
        filter_obj: Optional[SearchFilter] = None,
        dry_run: bool = True,
        use_regex: bool = True
    ) -> Tuple[List[Tuple[Path, Path]], List[OperationResult]]:
        results = []
        operations = []

        if use_regex:
            regex = re.compile(pattern, re.I)
        else:
            regex = None

        files = self._scan_files(filter_obj)

        for file_info in files:
            if use_regex:
                if regex.search(file_info.path.name):
                    new_name = regex.sub(replacement, file_info.path.name)
                else:
                    continue
            else:
                if pattern.lower() in file_info.path.name.lower():
                    new_name = file_info.path.name.replace(pattern, replacement)
                else:
                    continue

            if new_name == file_info.path.name:
                continue

            new_path = file_info.path.parent / new_name

            if new_path.exists() and not dry_run:
                result = OperationResult(
                    success=False,
                    operation="rename",
                    source=str(file_info.path),
                    destination=str(new_path),
                    error="目标文件已存在"
                )
                operations.append(result)
                continue

            results.append((file_info.path, new_path))
            self._undo_stack.append(("rename", file_info.path, new_path))

            if not dry_run:
                try:
                    file_info.path.rename(new_path)
                    result = OperationResult(
                        success=True,
                        operation="rename",
                        source=str(file_info.path),
                        destination=str(new_path)
                    )
                    logger.info(f"重命名: {file_info.path.name} -> {new_name}")
                except Exception as e:
                    result = OperationResult(
                        success=False,
                        operation="rename",
                        source=str(file_info.path),
                        destination=str(new_path),
                        error=str(e)
                    )
                operations.append(result)

        self.operation_history.extend(operations)
        return results, operations

    def copy_files(
        self,
        dest_dir: str,
        filter_obj: Optional[SearchFilter] = None,
        overwrite: bool = False,
        show_progress: bool = True
    ) -> List[OperationResult]:
        dest_path = Path(dest_dir)
        dest_path.mkdir(parents=True, exist_ok=True)
        operations = []

        files = self._scan_files(filter_obj)
        tracker = ProgressTracker(len(files), "复制文件") if show_progress else None

        def copy_single(file_info: FileInfo) -> OperationResult:
            dest_file = dest_path / file_info.path.name
            try:
                if dest_file.exists() and not overwrite:
                    return OperationResult(
                        success=False,
                        operation="copy",
                        source=str(file_info.path),
                        destination=str(dest_file),
                        error="目标文件已存在"
                    )
                shutil.copy2(file_info.path, dest_file)
                return OperationResult(
                    success=True,
                    operation="copy",
                    source=str(file_info.path),
                    destination=str(dest_file)
                )
            except Exception as e:
                return OperationResult(
                    success=False,
                    operation="copy",
                    source=str(file_info.path),
                    destination=str(dest_file),
                    error=str(e)
                )
            finally:
                if tracker:
                    tracker.update()

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {executor.submit(copy_single, f): f for f in files}
            for future in as_completed(futures):
                operations.append(future.result())

        if tracker:
            tracker.finish()

        self.operation_history.extend(operations)
        return operations

    def move_files(
        self,
        dest_dir: str,
        filter_obj: Optional[SearchFilter] = None,
        overwrite: bool = False
    ) -> List[OperationResult]:
        dest_path = Path(dest_dir)
        dest_path.mkdir(parents=True, exist_ok=True)
        operations = []

        files = self._scan_files(filter_obj)
        tracker = ProgressTracker(len(files), "移动文件")

        for file_info in files:
            dest_file = dest_path / file_info.path.name
            self._undo_stack.append(("move", file_info.path, dest_file))

            try:
                if dest_file.exists():
                    if overwrite:
                        dest_file.unlink()
                    else:
                        tracker.update()
                        result = OperationResult(
                            success=False,
                            operation="move",
                            source=str(file_info.path),
                            destination=str(dest_file),
                            error="目标文件已存在"
                        )
                        operations.append(result)
                        continue

                shutil.move(str(file_info.path), str(dest_file))
                result = OperationResult(
                    success=True,
                    operation="move",
                    source=str(file_info.path),
                    destination=str(dest_file)
                )
                logger.info(f"移动: {file_info.path} -> {dest_file}")
            except Exception as e:
                result = OperationResult(
                    success=False,
                    operation="move",
                    source=str(file_info.path),
                    destination=str(dest_file),
                    error=str(e)
                )

            operations.append(result)
            tracker.update()

        tracker.finish()
        self.operation_history.extend(operations)
        return operations

    def delete_files(
        self,
        filter_obj: Optional[SearchFilter] = None,
        use_trash: bool = True,
        dry_run: bool = True
    ) -> List[OperationResult]:
        operations = []
        trash_path = self.root_path / ".trash"
        trash_path.mkdir(exist_ok=True)

        files = self._scan_files(filter_obj)
        tracker = ProgressTracker(len(files), "删除文件")

        for file_info in files:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            trashed_name = f"{timestamp}_{file_info.path.name}"
            trashed_path = trash_path / trashed_name

            if dry_run:
                logger.info(f"将删除: {file_info.path}")
                tracker.update()
                continue

            try:
                if use_trash:
                    shutil.move(str(file_info.path), str(trashed_path))
                    result = OperationResult(
                        success=True,
                        operation="delete",
                        source=str(file_info.path),
                        destination=str(trashed_path)
                    )
                else:
                    file_info.path.unlink()
                    result = OperationResult(
                        success=True,
                        operation="delete",
                        source=str(file_info.path)
                    )
                logger.info(f"删除: {file_info.path}")
            except Exception as e:
                result = OperationResult(
                    success=False,
                    operation="delete",
                    source=str(file_info.path),
                    error=str(e)
                )

            operations.append(result)
            tracker.update()

        tracker.finish()
        self.operation_history.extend(operations)
        return operations

    def search_files(
        self,
        filter_obj: SearchFilter,
        search_in_content: bool = False
    ) -> List[FileInfo]:
        results = self._scan_files(filter_obj)

        if not search_in_content:
            return results

        content_results = []
        pattern = filter_obj.pattern or ""

        for file_info in results:
            try:
                content = file_info.path.read_text(encoding='utf-8', errors='ignore')
                if filter_obj.case_sensitive:
                    if pattern in content:
                        content_results.append(file_info)
                else:
                    if pattern.lower() in content.lower():
                        content_results.append(file_info)
            except Exception:
                continue

        return content_results

    def find_duplicates(self) -> Dict[str, List[Path]]:
        hash_map = defaultdict(list)

        files = self._scan_files()
        tracker = ProgressTracker(len(files), "查找重复文件")

        for file_info in files:
            try:
                with open(file_info.path, 'rb') as f:
                    file_hash = hashlib.md5(f.read()).hexdigest()
                    hash_map[file_hash].append(file_info.path)
            except Exception:
                pass
            tracker.update()

        tracker.finish()

        return {k: v for k, v in hash_map.items() if len(v) > 1}

    def get_file_stats(self, filter_obj: Optional[SearchFilter] = None) -> Dict[str, Any]:
        files = self._scan_files(filter_obj)

        stats = {
            "total_files": len(files),
            "total_size": sum(f.size for f in files),
            "total_size_formatted": FileInfo.format_size(sum(f.size for f in files)),
            "file_types": defaultdict(int),
            "size_distribution": {
                "tiny": 0,
                "small": 0,
                "medium": 0,
                "large": 0,
                "huge": 0
            },
            "largest_files": [],
            "recently_modified": []
        }

        for file_info in files:
            stats["file_types"][file_info.extension] += 1

            if file_info.size < 1024:
                stats["size_distribution"]["tiny"] += 1
            elif file_info.size < 1024 * 1024:
                stats["size_distribution"]["small"] += 1
            elif file_info.size < 10 * 1024 * 1024:
                stats["size_distribution"]["medium"] += 1
            elif file_info.size < 100 * 1024 * 1024:
                stats["size_distribution"]["large"] += 1
            else:
                stats["size_distribution"]["huge"] += 1

        files.sort(key=lambda x: x.size, reverse=True)
        stats["largest_files"] = [f.to_dict() for f in files[:10]]

        files.sort(key=lambda x: x.modified_time, reverse=True)
        stats["recently_modified"] = [f.to_dict() for f in files[:10]]

        return stats

    def undo_last(self) -> Optional[OperationResult]:
        if not self._undo_stack:
            return None

        operation, source, destination = self._undo_stack.pop()

        try:
            if operation == "rename":
                destination.rename(source)
                logger.info(f"撤销重命名: {destination.name} -> {source.name}")
            elif operation == "move":
                shutil.move(str(destination), str(source))
                logger.info(f"撤销移动: {destination} -> {source}")
            return OperationResult(
                success=True,
                operation=f"undo_{operation}",
                source=str(destination),
                destination=str(source)
            )
        except Exception as e:
            return OperationResult(
                success=False,
                operation=f"undo_{operation}",
                source=str(destination),
                destination=str(source),
                error=str(e)
            )

    def export_results(self, filepath: str, format: str = "json"):
        data = {
            "timestamp": datetime.now().isoformat(),
            "root_path": str(self.root_path),
            "operations": [asdict(op) for op in self.operation_history]
        }

        if format == "json":
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        elif format == "csv":
            import csv
            with open(filepath, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=data["operations"][0].keys())
                writer.writeheader()
                writer.writerows(data["operations"])

        logger.info(f"结果已导出至: {filepath}")


def print_banner():
    print("╔" + "═" * 56 + "╗")
    print("║" + " 文件处理工具 v2.0 ".center(56) + "║")
    print("╚" + "═" * 56 + "╝")


def print_menu():
    print("\n功能菜单:")
    print("  1. 批量重命名        2. 复制文件")
    print("  3. 移动文件          4. 删除文件")
    print("  5. 搜索文件          6. 文件统计")
    print("  7. 查找重复文件      8. 导出结果")
    print("  9. 撤销操作          0. 退出")


def get_filter_from_input() -> Optional[SearchFilter]:
    print("\n筛选条件 (直接回车跳过):")

    pattern = input("  关键词: ").strip() or None
    ext = input("  扩展名 (.txt): ").strip()
    ext = f".{ext.lstrip('.')}" if ext else None

    min_size_str = input("  最小大小 (KB): ").strip()
    min_size = int(min_size_str) * 1024 if min_size_str else None

    max_size_str = input("  最大大小 (MB): ").strip()
    max_size = int(max_size_str) * 1024 * 1024 if max_size_str else None

    days_str = input("  最近N天内: ").strip()
    modified_after = datetime.now() - timedelta(days=int(days_str)) if days_str else None

    if not any([pattern, ext, min_size, max_size, modified_after]):
        return None

    return SearchFilter(
        pattern=pattern,
        extension=ext,
        min_size=min_size,
        max_size=max_size,
        modified_after=modified_after,
        case_sensitive=input("  区分大小写? (y/n): ").lower() == 'y',
        regex=input("  使用正则? (y/n): ").lower() == 'y'
    )


def main():
    print_banner()

    root = input("\n请输入目标文件夹路径: ").strip()

    try:
        processor = FileProcessor(root)
    except ValueError as e:
        print(f"错误: {e}")
        return

    print(f"\n✓ 已加载目录: {root}")

    while True:
        print_menu()
        choice = input("\n请选择功能 (0-9): ").strip()

        if choice == "0":
            print("\n再见!")
            break

        elif choice == "1":
            pattern = input("匹配模式: ").strip()
            replacement = input("替换内容: ").strip()
            use_regex = input("使用正则? (y/n): ").lower() == 'y'
            filter_obj = get_filter_from_input()
            dry_run = input("预览模式? (y/n): ").lower() == 'y'

            results, ops = processor.batch_rename(pattern, replacement, filter_obj, dry_run, use_regex)
            print(f"\n✓ 找到 {len(results)} 个匹配文件")

            for old, new in results[:10]:
                print(f"  {old.name} → {new.name}")

            success = sum(1 for o in ops if o.success)
            if not dry_run:
                print(f"✓ 成功重命名 {success} 个文件")

        elif choice == "2":
            dest = input("目标目录: ").strip()
            filter_obj = get_filter_from_input()
            overwrite = input("覆盖已有文件? (y/n): ").lower() == 'y'
            show_progress = input("显示进度? (y/n): ").lower() == 'y'

            ops = processor.copy_files(dest, filter_obj, overwrite, show_progress)
            success = sum(1 for o in ops if o.success)
            print(f"\n✓ 成功复制 {success}/{len(ops)} 个文件")

        elif choice == "3":
            dest = input("目标目录: ").strip()
            filter_obj = get_filter_from_input()
            overwrite = input("覆盖已有文件? (y/n): ").lower() == 'y'

            ops = processor.move_files(dest, filter_obj, overwrite)
            success = sum(1 for o in ops if o.success)
            print(f"\n✓ 成功移动 {success}/{len(ops)} 个文件")

        elif choice == "4":
            filter_obj = get_filter_from_input()
            use_trash = input("移至回收站? (y/n): ").lower() == 'y'
            dry_run = input("预览模式? (y/n): ").lower() == 'y'

            ops = processor.delete_files(filter_obj, use_trash, dry_run)
            print(f"\n✓ 删除 {len(ops)} 个文件")

        elif choice == "5":
            filter_obj = SearchFilter()
            filter_obj.pattern = input("搜索关键词: ").strip()
            filter_obj.case_sensitive = input("区分大小写? (y/n): ").lower() == 'y'
            search_content = input("搜索文件内容? (y/n): ").lower() == 'y'

            results = processor.search_files(filter_obj, search_content)
            print(f"\n✓ 找到 {len(results)} 个结果:")
            for f in results[:20]:
                print(f"  {f.path}")

        elif choice == "6":
            filter_obj = get_filter_from_input()
            stats = processor.get_file_stats(filter_obj)

            print("\n文件统计:")
            print(f"  文件总数: {stats['total_files']}")
            print(f"  总大小: {stats['total_size_formatted']}")

            print("\n  文件大小分布:")
            for k, v in stats['size_distribution'].items():
                print(f"    {k}: {v} 个")

            print("\n  文件类型 (Top 10):")
            sorted_types = sorted(stats['file_types'].items(), key=lambda x: x[1], reverse=True)[:10]
            for ext, count in sorted_types:
                print(f"    {ext}: {count}")

        elif choice == "7":
            duplicates = processor.find_duplicates()
            total_dups = sum(len(v) - 1 for v in duplicates.values())
            print(f"\n✓ 发现 {total_dups} 个重复文件:")
            for hash_val, paths in list(duplicates.items())[:10]:
                print(f"  {FileInfo.format_size(os.path.getsize(paths[0]))}:")
                for p in paths:
                    print(f"    - {p}")

        elif choice == "8":
            filepath = input("导出路径: ").strip()
            fmt = input("格式 (json/csv): ").strip() or "json"
            processor.export_results(filepath, fmt)
            print(f"✓ 已导出至: {filepath}")

        elif choice == "9":
            result = processor.undo_last()
            if result:
                print(f"✓ 已撤销: {result.source} → {result.destination}")
            else:
                print("✗ 没有可撤销的操作")


if __name__ == "__main__":
    main()
