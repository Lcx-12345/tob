from __future__ import annotations

import zipfile
from pathlib import Path


def _write_zip(output_path: Path, files: dict[str, bytes]) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for name, content in files.items():
            zf.writestr(name, content)


def build_minimal_pptx(output_path: Path) -> None:
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/_rels/presentation.xml.rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Override PartName="/_rels/.rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
</Types>
"""

    rels_root = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>
"""

    presentation = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
 <p:sldIdLst>
  <p:sldId id="256" r:id="rId1"/>
 </p:sldIdLst>
 <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
 <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>
"""

    presentation_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
</Relationships>
"""

    slide1 = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
 <p:cSld>
  <p:spTree>
   <p:nvGrpSpPr>
    <p:cNvPr id="1" name=""/>
    <p:cNvGrpSpPr/>
    <p:nvPr/>
   </p:nvGrpSpPr>
   <p:grpSpPr>
    <a:xfrm>
     <a:off x="0" y="0"/>
     <a:ext cx="0" cy="0"/>
     <a:chOff x="0" y="0"/>
     <a:chExt cx="0" y="0"/>
    </a:xfrm>
   </p:grpSpPr>
   <p:sp>
    <p:nvSpPr>
     <p:cNvPr id="2" name="TextBox 1"/>
     <p:cNvSpPr txBox="1"/>
     <p:nvPr/>
    </p:nvSpPr>
    <p:spPr>
     <a:xfrm>
      <a:off x="914400" y="914400"/>
      <a:ext cx="7315200" cy="1371600"/>
     </a:xfrm>
     <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
    </p:spPr>
    <p:txBody>
     <a:bodyPr wrap="square"/>
     <a:lstStyle/>
     <a:p>
      <a:r>
       <a:rPr lang="zh-CN" sz="4400"/>
       <a:t>格式示例 PPTX（最小包）</a:t>
      </a:r>
      <a:endParaRPr lang="zh-CN"/>
     </a:p>
     <a:p>
      <a:r>
       <a:rPr lang="zh-CN" sz="2400"/>
       <a:t>此 PPTX 由纯 Python 手工拼装 OpenXML 部件生成。</a:t>
      </a:r>
      <a:endParaRPr lang="zh-CN"/>
     </a:p>
    </p:txBody>
   </p:sp>
  </p:spTree>
 </p:cSld>
 <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>
"""

    _write_zip(
        output_path,
        {
            "[Content_Types].xml": content_types.encode("utf-8"),
            "_rels/.rels": rels_root.encode("utf-8"),
            "ppt/presentation.xml": presentation.encode("utf-8"),
            "ppt/_rels/presentation.xml.rels": presentation_rels.encode("utf-8"),
            "ppt/slides/slide1.xml": slide1.encode("utf-8"),
        },
    )


def build_bundle_zip(output_path: Path, base_dir: Path) -> None:
    include = [
        "demo.md",
        "demo.html",
        "demo.svg",
        "demo.py",
        "demo.json",
        "demo.pptx",
    ]

    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for name in include:
            p = base_dir / name
            zf.write(p, arcname=name)


def main() -> None:
    base_dir = Path(__file__).resolve().parent
    pptx_path = base_dir / "demo.pptx"
    zip_path = base_dir / "demo_bundle.zip"

    build_minimal_pptx(pptx_path)
    build_bundle_zip(zip_path, base_dir)

    print(f"Wrote: {pptx_path}")
    print(f"Wrote: {zip_path}")


if __name__ == "__main__":
    main()
