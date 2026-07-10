#!/usr/bin/env python3
"""Normalize public resume PDF metadata while preserving tags and links."""

from __future__ import annotations

import argparse
from pathlib import Path

from pypdf import PdfWriter
from pypdf.generic import NameObject


TITLE = "Aiden Rhaa - Cloud Platform & Reliability Engineer Resume"
AUTHOR = "Aiden Rhaa"


def finalize(source: Path, output: Path) -> None:
    writer = PdfWriter(clone_from=source)
    writer.pdf_header = b"%PDF-1.7"
    writer.root_object.pop(NameObject("/Metadata"), None)
    writer.metadata.clear()
    writer.add_metadata(
        {
            "/Title": TITLE,
            "/Author": AUTHOR,
            "/Subject": "Cloud platform and reliability engineering resume",
            "/Creator": "",
            "/Producer": "",
            "/CreationDate": "",
            "/ModDate": "",
        }
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("wb") as handle:
        writer.write(handle)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    finalize(args.source, args.output)
    print(args.output)


if __name__ == "__main__":
    main()
