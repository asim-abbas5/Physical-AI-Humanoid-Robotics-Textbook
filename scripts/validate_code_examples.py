#!/usr/bin/env python3
"""
Code Example Validation Script
Validates Python code blocks in MDX files for syntax and optionally executes them
"""

import ast
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import List, Tuple

class CodeBlockExtractor:
    """Extract code blocks from MDX files"""

    @staticmethod
    def extract_python_blocks(mdx_file: Path) -> List[Tuple[str, dict, int]]:
        """Extract Python code blocks with metadata and line numbers"""
        content = mdx_file.read_text(encoding='utf-8')
        pattern = r'```python(?P<meta>.*?)\n(?P<code>.*?)\n```'
        matches = re.finditer(pattern, content, re.DOTALL)

        blocks = []
        for match in matches:
            meta = match.group('meta').strip()
            code = match.group('code')
            line_number = content[:match.start()].count('\n') + 1
            metadata = {
                'runnable': 'runnable' in meta,
                'line': line_number
            }
            blocks.append((code, metadata, line_number))

        return blocks

class PythonCodeValidator:
    """Validate Python code blocks"""

    @staticmethod
    def check_syntax(code: str) -> Tuple[bool, str]:
        """Check if code has valid Python syntax"""
        try:
            ast.parse(code)
            return True, "OK"
        except SyntaxError as e:
            return False, f"Syntax error at line {e.lineno}: {e.msg}"

    @staticmethod
    def execute_code(code: str, timeout: int = 5) -> Tuple[bool, str]:
        """Execute code and return success status"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_file = f.name

        try:
            result = subprocess.run(
                [sys.executable, temp_file],
                capture_output=True,
                timeout=timeout,
                text=True
            )
            if result.returncode == 0:
                return True, "Executed successfully"
            else:
                return False, f"Execution failed:\n{result.stderr}"
        except subprocess.TimeoutExpired:
            return False, f"Execution timeout ({timeout}s)"
        except Exception as e:
            return False, f"Execution error: {e}"
        finally:
            Path(temp_file).unlink(missing_ok=True)

def main():
    """Main validation function"""
    docs_dir = Path("docs")
    if not docs_dir.exists():
        print("❌ docs/ directory not found")
        sys.exit(1)

    print("🔍 Validating Python code examples...\n")

    all_valid = True
    total_blocks = 0
    total_files = 0
    errors = []

    for mdx_file in docs_dir.rglob("*.mdx"):
        total_files += 1
        blocks = CodeBlockExtractor.extract_python_blocks(mdx_file)

        if not blocks:
            continue

        file_has_errors = False

        for idx, (code, metadata, line_num) in enumerate(blocks):
            total_blocks += 1

            # Always check syntax
            syntax_ok, syntax_msg = PythonCodeValidator.check_syntax(code)

            if not syntax_ok:
                all_valid = False
                file_has_errors = True
                errors.append({
                    'file': str(mdx_file),
                    'block': idx + 1,
                    'line': line_num,
                    'error': syntax_msg
                })
                continue

            # Execute if marked as runnable
            if metadata.get('runnable'):
                exec_ok, exec_msg = PythonCodeValidator.execute_code(code)
                if not exec_ok:
                    all_valid = False
                    file_has_errors = True
                    errors.append({
                        'file': str(mdx_file),
                        'block': idx + 1,
                        'line': line_num,
                        'error': exec_msg
                    })

    # Print results
    print(f"📊 Validation Summary")
    print(f"   Files scanned: {total_files}")
    print(f"   Code blocks found: {total_blocks}\n")

    if errors:
        print(f"❌ Found {len(errors)} error(s):\n")
        for error in errors:
            print(f"📄 {error['file']}")
            print(f"   Block {error['block']} (line {error['line']})")
            print(f"   {error['error']}\n")
        sys.exit(1)
    else:
        print("✅ All Python code examples are valid!\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
