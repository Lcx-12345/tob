import os
import shutil
import re
from pathlib import Path
from typing import List, Optional, Callable
from datetime import datetime


class FileProcessor:
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        if not self.root_path.exists():
            raise ValueError(f"路径不存在: {root_path}")
        self.operation_log: List[str] = []

    def batch_rename(
        self,
        pattern: str,
        replacement: str,
        file_ext: Optional[str] = None,
        dry_run: bool = True
    ) -> List[tuple]:
        results = []
        regex = re.compile(pattern)
        
        for file_path in self.root_path.rglob(f"*{file_ext}" if file_ext else "*"):
            if file_path.is_file() and regex.search(file_path.name):
                new_name = regex.sub(replacement, file_path.name)
                old_path = file_path
                new_path = file_path.parent / new_name
                
                results.append((str(old_path), str(new_path)))
                
                if not dry_run:
                    old_path.rename(new_path)
                    self.log_operation(f"重命名: {old_path.name} -> {new_name}")
        
        return results

    def copy_files(
        self,
        dest_dir: str,
        pattern: str = "*",
        file_ext: Optional[str] = None
    ) -> int:
        dest_path = Path(dest_dir)
        dest_path.mkdir(parents=True, exist_ok=True)
        copied_count = 0
        
        for file_path in self.root_path.rglob(pattern):
            if file_path.is_file():
                if file_ext and not file_path.suffix == file_ext:
                    continue
                dest_file = dest_path / file_path.name
                shutil.copy2(file_path, dest_file)
                copied_count += 1
                self.log_operation(f"复制: {file_path} -> {dest_file}")
        
        return copied_count

    def move_files(
        self,
        dest_dir: str,
        pattern: str = "*"
    ) -> int:
        dest_path = Path(dest_dir)
        dest_path.mkdir(parents=True, exist_ok=True)
        moved_count = 0
        
        for file_path in self.root_path.rglob(pattern):
            if file_path.is_file():
                dest_file = dest_path / file_path.name
                shutil.move(str(file_path), str(dest_file))
                moved_count += 1
                self.log_operation(f"移动: {file_path} -> {dest_file}")
        
        return moved_count

    def search_files(
        self,
        keyword: str,
        case_sensitive: bool = False,
        search_in_content: bool = False
    ) -> List[Path]:
        results = []
        keyword_to_search = keyword if case_sensitive else keyword.lower()
        
        for file_path in self.root_path.rglob("*"):
            if not file_path.is_file():
                continue
            
            if not case_sensitive:
                file_name = file_path.name.lower()
            else:
                file_name = file_path.name
            
            if keyword_to_search in file_name:
                results.append(file_path)
            elif search_in_content:
                try:
                    content = file_path.read_text(
                        encoding='utf-8', 
                        errors='ignore'
                    )
                    content_to_search = content if case_sensitive else content.lower()
                    if keyword_to_search in content_to_search:
                        results.append(file_path)
                except Exception:
                    continue
        
        return results

    def get_file_stats(self, recursive: bool = True) -> dict:
        stats = {
            "total_files": 0,
            "total_dirs": 0,
            "total_size": 0,
            "file_types": {},
            "largest_files": []
        }
        
        files_info = []
        search_pattern = "**/*" if recursive else "*"
        
        for item in self.root_path.glob(search_pattern):
            if item.is_file():
                size = item.stat().st_size
                stats["total_files"] += 1
                stats["total_size"] += size
                
                ext = item.suffix.lower() or "无扩展名"
                stats["file_types"][ext] = stats["file_types"].get(ext, 0) + 1
                
                files_info.append((str(item), size))
            elif item.is_dir():
                stats["total_dirs"] += 1
        
        files_info.sort(key=lambda x: x[1], reverse=True)
        stats["largest_files"] = files_info[:10]
        
        return stats

    def log_operation(self, message: str):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        self.operation_log.append(log_entry)
        print(log_entry)

    def save_log(self, log_file: Optional[str] = None):
        if not log_file:
            log_file = f"file_processor_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(self.operation_log))
        
        print(f"日志已保存至: {log_file}")


def main():
    print("=" * 50)
    print("文件处理工具")
    print("=" * 50)
    
    root = input("请输入目标文件夹路径: ").strip()
    
    try:
        processor = FileProcessor(root)
    except ValueError as e:
        print(f"错误: {e}")
        return
    
    while True:
        print("\n功能菜单:")
        print("1. 批量重命名")
        print("2. 复制文件")
        print("3. 移动文件")
        print("4. 搜索文件")
        print("5. 文件统计")
        print("6. 保存操作日志")
        print("0. 退出")
        
        choice = input("\n请选择功能 (0-6): ").strip()
        
        if choice == "0":
            print("再见!")
            break
        
        elif choice == "1":
            pattern = input("匹配模式 (正则): ")
            replacement = input("替换内容: ")
            ext = input("文件扩展名 (如 .txt, 空则全部): ").strip() or None
            dry = input("预览模式? (y/n): ").lower() == 'y'
            
            results = processor.batch_rename(pattern, replacement, ext, dry)
            print(f"\n找到 {len(results)} 个匹配文件")
            for old, new in results[:10]:
                print(f"  {os.path.basename(old)} -> {os.path.basename(new)}")
        
        elif choice == "2":
            dest = input("目标目录: ")
            pattern = input("匹配模式: ")
            ext = input("扩展名过滤 (空则全部): ").strip() or None
            
            count = processor.copy_files(dest, pattern, ext)
            print(f"已复制 {count} 个文件")
        
        elif choice == "3":
            dest = input("目标目录: ")
            pattern = input("匹配模式: ")
            
            count = processor.move_files(dest, pattern)
            print(f"已移动 {count} 个文件")
        
        elif choice == "4":
            keyword = input("搜索关键词: ")
            case = input("区分大小写? (y/n): ").lower() == 'y'
            content = input("搜索文件内容? (y/n): ").lower() == 'y'
            
            results = processor.search_files(keyword, case, content)
            print(f"\n找到 {len(results)} 个结果:")
            for path in results[:20]:
                print(f"  {path}")
        
        elif choice == "5":
            stats = processor.get_file_stats()
            print("\n文件统计:")
            print(f"  文件总数: {stats['total_files']}")
            print(f"  目录总数: {stats['total_dirs']}")
            print(f"  总大小: {stats['total_size'] / (1024*1024):.2f} MB")
            print("\n  文件类型分布:")
            for ext, count in sorted(stats['file_types'].items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"    {ext}: {count}")
        
        elif choice == "6":
            processor.save_log()


if __name__ == "__main__":
    main()
