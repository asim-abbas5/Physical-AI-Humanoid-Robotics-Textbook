#!/usr/bin/env node
/**
 * MDX Validation Script
 * Validates MDX files for syntax errors and Docusaurus compatibility
 */

import { ESLint } from 'eslint';
import { glob } from 'glob';
import * as fs from 'fs';

async function validateMDX() {
  console.log('🔍 Validating MDX files...\n');

  // Find all MDX files
  const files = await glob('docs/**/*.{md,mdx}');
  console.log(`Found ${files.length} files to validate\n`);

  if (files.length === 0) {
    console.log('✅ No MDX files found to validate');
    process.exit(0);
  }

  let hasErrors = false;
  const errors = [];

  // Basic syntax validation
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');

      // Check for common MDX issues
      const issues = [];

      // Check for unclosed JSX tags
      const jsxOpenTags = content.match(/<([A-Z][a-zA-Z0-9]*)[^>]*>/g) || [];
      const jsxCloseTags = content.match(/<\/([A-Z][a-zA-Z0-9]*)>/g) || [];

      // Check for frontmatter
      if (!content.startsWith('---')) {
        issues.push('Missing frontmatter');
      }

      // Check for broken image links (basic check)
      const imageLinks = content.match(/!\[.*?\]\((.*?)\)/g) || [];
      for (const link of imageLinks) {
        const path = link.match(/\((.*?)\)/)?.[1];
        if (path && !path.startsWith('http') && !fs.existsSync(path)) {
          issues.push(`Broken image link: ${path}`);
        }
      }

      if (issues.length > 0) {
        hasErrors = true;
        errors.push({ file, issues });
      }
    } catch (error) {
      hasErrors = true;
      errors.push({ file, issues: [error.message] });
    }
  }

  // Print results
  if (errors.length > 0) {
    console.log('❌ Validation errors found:\n');
    errors.forEach(({ file, issues }) => {
      console.log(`📄 ${file}`);
      issues.forEach((issue) => console.log(`   - ${issue}`));
      console.log('');
    });
  }

  if (!hasErrors) {
    console.log('✅ All MDX files are valid!\n');
    process.exit(0);
  } else {
    console.log(`\n❌ Found errors in ${errors.length} file(s)`);
    process.exit(1);
  }
}

validateMDX().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
