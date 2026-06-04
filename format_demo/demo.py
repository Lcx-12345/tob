from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    base = Path(__file__).resolve().parent
    data = json.loads((base / "demo.json").read_text(encoding="utf-8"))
    print(f"{data['title']} - generated_at={data['generated_at']}")
    for item in data["items"]:
        print(f"- {item['type']}: {', '.join(item['formats'])}")


if __name__ == "__main__":
    main()

