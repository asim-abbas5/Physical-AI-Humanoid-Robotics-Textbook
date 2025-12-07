#!/usr/bin/env python3
"""
Readability Checker Script
Validates Flesch-Kincaid readability scores for MDX content
"""

import re
import sys
from pathlib import Path

try:
    import textstat
except ImportError:
    print("❌ textstat not installed. Run: pip install textstat")
    sys.exit(1)

class MDXReadabilityChecker:
    """Check Flesch-Kincaid readability of MDX content"""

    @staticmethod
    def extract_prose(mdx_content: str) -> str:
        """Extract prose text from MDX, removing code blocks and markup"""
        # Remove frontmatter
        content = re.sub(r'^---\n.*?\n---\n', '', mdx_content, flags=re.DOTALL)

        # Remove code blocks
        content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)

        # Remove inline code
        content = re.sub(r'`[^`]+`', '', content)

        # Remove JSX/HTML tags
        content = re.sub(r'<[^>]+>', '', content)

        # Remove markdown links but keep text
        content = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', content)

        # Remove markdown image syntax
        content = re.sub(r'!\[([^\]]*)\]\([^\)]+\)', '', content)

        # Remove markdown headers
        content = re.sub(r'#+\s+', '', content)

        # Remove list markers
        content = re.sub(r'^\s*[-*+]\s+', '', content, flags=re.MULTILINE)

        # Remove numbered lists
        content = re.sub(r'^\s*\d+\.\s+', '', content, flags=re.MULTILINE)

        return content.strip()

    @staticmethod
    def check_file(mdx_file: Path, min_grade=8, max_grade=12) -> dict:
        """Analyze readability of a single file"""
        content = mdx_file.read_text(encoding='utf-8')
        prose = MDXReadabilityChecker.extract_prose(content)

        if len(prose) < 100:  # Skip files with minimal content
            return {'skip': True}

        fk_grade = textstat.flesch_kincaid_grade(prose)
        word_count = len(prose.split())
        sentence_count = textstat.sentence_count(prose)

        status = 'pass' if min_grade <= fk_grade <= max_grade else 'fail'

        return {
            'skip': False,
            'file': mdx_file,
            'word_count': word_count,
            'sentence_count': sentence_count,
            'fk_grade': round(fk_grade, 1),
            'status': status,
            'reading_ease': round(textstat.flesch_reading_ease(prose), 1)
        }

def main():
    """Main readability checking function"""
    docs_dir = Path("docs")
    if not docs_dir.exists():
        print("❌ docs/ directory not found")
        sys.exit(1)

    print("📖 Checking readability scores (Target: Grade 8-12)...\n")

    results = []
    skipped = 0

    for mdx_file in docs_dir.rglob("*.{md,mdx}"):
        # Skip index files (often just navigation)
        if mdx_file.name in ["intro.md", "_category_.json"]:
            skipped += 1
            continue

        result = MDXReadabilityChecker.check_file(mdx_file)

        if result['skip']:
            skipped += 1
            continue

        results.append(result)

    # Print results
    print(f"{'File':<60} {'Words':<8} {'FK Grade':<10} {'Status'}")
    print("=" * 90)

    failures = []
    for r in sorted(results, key=lambda x: x['file'].name):
        status_icon = "✅" if r['status'] == 'pass' else "❌"
        file_name = str(r['file'].relative_to(docs_dir))[:55]

        print(f"{file_name:<60} {r['word_count']:<8} {r['fk_grade']:<10} {status_icon}")

        if r['status'] == 'fail':
            failures.append(r)

    # Summary
    print("\n" + "=" * 90)
    print(f"📊 Summary")
    print(f"   Files checked: {len(results)}")
    print(f"   Files skipped: {skipped}")
    print(f"   Passed: {len(results) - len(failures)}")
    print(f"   Failed: {len(failures)}\n")

    if failures:
        print("❌ Files outside Grade 8-12 range:\n")
        for f in failures:
            print(f"   {f['file'].relative_to(docs_dir)}")
            print(f"      FK Grade: {f['fk_grade']} (target: 8.0-12.0)")
            print(f"      Reading Ease: {f['reading_ease']}")
            print(f"      Suggestion: {'Simplify language' if f['fk_grade'] > 12 else 'Add complexity'}\n")

        sys.exit(1)
    else:
        print("✅ All files meet readability requirements!\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
