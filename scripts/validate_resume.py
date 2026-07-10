#!/usr/bin/env python3
"""Validate the public resume's ATS, privacy, link, font, and PDF invariants."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from pypdf import PdfReader


TITLE = "Aiden Rhaa - Cloud Platform & Reliability Engineer Resume"
AUTHOR = "Aiden Rhaa"
HEADLINE = "Cloud Platform & Reliability Engineer | AWS Infrastructure | Terraform | DevSecOps"
CREDENTIALS = (
    "Previously earned credentials (not currently active): AWS Certified Solutions Architect - "
    "Associate; AWS Certified Developer - Associate; HashiCorp Certified: Terraform Associate."
)
EXPECTED_LINKS = {
    "mailto:aidenrhaacloud@gmail.com",
    "https://manynames3.github.io/cloudresume/",
    "https://github.com/manynames3",
    "https://linkedin.com/in/aidenrhaa",
    "https://github.com/manynames3/clearpath-fargate-api",
    "https://github.com/manynames3/terragate",
    "https://github.com/manynames3/inspectiq",
    "https://github.com/manynames3/pulpit-v2",
    "https://github.com/manynames3/super-transcriber-api",
    "https://github.com/manynames3/aegisdesk-cloudops-control-plane",
    "https://github.com/manynames3/pulpit",
    "https://github.com/manynames3/photoscribe-ai",
    "https://github.com/manynames3/docuflow-ocr",
    "https://github.com/manynames3/faceid",
}


def normalized(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def font_status(reader: PdfReader) -> dict[str, bool]:
    fonts: dict[str, bool] = {}
    for page in reader.pages:
        resources = page.get("/Resources", {})
        for reference in resources.get("/Font", {}).values():
            font = reference.get_object()
            descriptor = font.get("/FontDescriptor")
            if descriptor is None and font.get("/DescendantFonts"):
                descriptor = font["/DescendantFonts"][0].get_object().get("/FontDescriptor")
            descriptor_object = descriptor.get_object() if descriptor else {}
            embedded = any(
                key in descriptor_object for key in ("/FontFile", "/FontFile2", "/FontFile3")
            )
            fonts[str(font.get("/BaseFont"))] = embedded
    return fonts


def links(reader: PdfReader) -> list[str]:
    destinations: list[str] = []
    for page in reader.pages:
        for reference in page.get("/Annots", []):
            annotation = reference.get_object()
            action = annotation.get("/A")
            if action and action.get("/URI"):
                destinations.append(str(action["/URI"]))
    return destinations


def validate(path: Path) -> None:
    reader = PdfReader(path)
    assert len(reader.pages) == 2, f"expected 2 pages, got {len(reader.pages)}"
    for index, page in enumerate(reader.pages, start=1):
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)
        assert abs(width - 612) < 0.01 and abs(height - 792) < 0.01, (
            f"page {index} is not US Letter: {width} x {height} pt"
        )

    metadata = reader.metadata or {}
    assert metadata.get("/Title") == TITLE
    assert metadata.get("/Author") == AUTHOR
    for key in ("/Creator", "/Producer", "/CreationDate", "/ModDate"):
        assert not metadata.get(key), f"{key} should be scrubbed"

    root = reader.trailer["/Root"]
    assert root.get("/MarkInfo") and bool(root["/MarkInfo"].get("/Marked"))
    assert root.get("/StructTreeRoot"), "tagged structure tree is missing"
    assert not root.get("/Metadata"), "XMP metadata stream should be scrubbed"
    assert not root.get("/OpenAction"), "unexpected document open action"
    assert not root.get("/Names") or not root["/Names"].get("/JavaScript"), "JavaScript found"

    page_text = [normalized(page.extract_text() or "") for page in reader.pages]
    text = normalized(" ".join(page_text))
    assert page_text[0].startswith("AIDEN RHAA")
    assert page_text[1].startswith("PROFESSIONAL EXPERIENCE")
    assert HEADLINE in text
    assert CREDENTIALS in text
    assert "617-939-1648" in text
    assert "36 passing FastAPI tests" in text
    assert "339 passing Terraform Checkov checks (0 failed, 44 skipped)" in text
    assert "Terraform destroy removed 93 managed resources" in text

    credential_neutral_text = text.replace(CREDENTIALS, "")
    forbidden = {
        "Hartford": r"(?i)\bHartford\b",
        "IE07OE": r"(?i)\bIE07OE\b",
        "AWS-certified": r"(?i)\bAWS-certified\b",
        "AWS certified outside credential names": r"(?i)\bAWS certified\b",
        "26 API tests": r"(?i)\b26\s+API tests\b",
        "production-grade": r"(?i)\bproduction-grade\b",
        "enterprise-ready": r"(?i)\benterprise-ready\b",
        "OPA/Rego": r"(?i)\bOPA/Rego\b",
        "machine path": r"/Users/",
        "AWS ARN": r"(?i)\barn:aws(?:-[a-z]+)?:",
        "AWS account ID": r"\b\d{12}\b",
        "private IPv4": r"\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b",
        "access key": r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b",
        "secret assignment": r"(?i)\b(?:password|secret|token)\s*[:=]\s*\S+",
    }
    for label, pattern in forbidden.items():
        haystack = credential_neutral_text if "AWS certified" in label else text
        assert not re.search(pattern, haystack), f"forbidden {label} found"

    pdf_links = links(reader)
    assert len(pdf_links) == len(EXPECTED_LINKS), "unexpected duplicate or missing PDF links"
    assert set(pdf_links) == EXPECTED_LINKS
    for destination in EXPECTED_LINKS:
        if destination.startswith("https://"):
            assert destination in text, f"visible URL does not match {destination}"

    fonts = font_status(reader)
    assert fonts and all(fonts.values()), f"unembedded font found: {fonts}"
    assert all("LiberationSans" in name or "OpenSymbol" in name for name in fonts), fonts

    print(
        {
            "pages": len(reader.pages),
            "page_size_pt": [612, 792],
            "tagged": True,
            "links": len(pdf_links),
            "fonts": fonts,
            "metadata": {"title": metadata.get("/Title"), "author": metadata.get("/Author")},
            "rejection_searches": "pass",
        }
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    args = parser.parse_args()
    validate(args.pdf)


if __name__ == "__main__":
    main()
