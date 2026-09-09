#!/usr/bin/env bash
# =============================================================================
# smoke-test.sh — Production smoke test for GeneticMedicine on GitHub Pages
#
# Usage:
#   ./scripts/smoke-test.sh [BASE_URL]
#
# Defaults to the production URL when no argument is supplied:
#   https://prerna2434.github.io/Prerna-shirsath/
#
# Exit codes:
#   0 — all checks passed
#   1 — one or more checks failed
# =============================================================================

set -euo pipefail

SITE_URL="${1:-https://prerna2434.github.io/Prerna-shirsath/}"
BASE_ORIGIN="${SITE_URL%/Prerna-shirsath/*}"
# Derive origin robustly from any supplied URL
BASE_ORIGIN=$(echo "$SITE_URL" | grep -oE 'https?://[^/]+')

PASS=0
FAIL=0
TMP_DIR=$(mktemp -d)
INDEX_FILE="$TMP_DIR/index.html"
JS_FILE="$TMP_DIR/main.js"
CSS_FILE="$TMP_DIR/main.css"

# Colour helpers (gracefully degraded when not a TTY)
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "${GREEN}  ✓ PASS${NC}  $*"; PASS=$((PASS + 1)); }
fail() { echo -e "${RED}  ✗ FAIL${NC}  $*"; FAIL=$((FAIL + 1)); }
info() { echo -e "${YELLOW}  →${NC}  $*"; }

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

echo ""
echo "========================================================"
echo "  GeneticMedicine — Production Smoke Test"
echo "  Target: $SITE_URL"
echo "========================================================"
echo ""

# ------------------------------------------------------------
# 1. Index page fetches successfully (HTTP 200)
# ------------------------------------------------------------
info "Fetching index page …"
HTTP_STATUS=$(curl --silent --write-out "%{http_code}" --location \
  --retry 3 --retry-all-errors --max-time 30 \
  "$SITE_URL" --output "$INDEX_FILE")

if [ "$HTTP_STATUS" -eq 200 ]; then
  ok "Index page returned HTTP $HTTP_STATUS"
else
  fail "Index page returned HTTP $HTTP_STATUS (expected 200)"
fi

# ------------------------------------------------------------
# 2. Root div is present
# ------------------------------------------------------------
if grep -q '<div id="root"></div>' "$INDEX_FILE"; then
  ok "React mount point <div id=\"root\"> found"
else
  fail "React mount point <div id=\"root\"> NOT found"
fi

# ------------------------------------------------------------
# 3. Page title contains brand name
# ------------------------------------------------------------
if grep -q '<title>GeneticMedicine' "$INDEX_FILE"; then
  ok "Page title contains 'GeneticMedicine'"
else
  fail "Page title does NOT contain 'GeneticMedicine'"
fi

# ------------------------------------------------------------
# 4. Viewport meta tag present (mobile-responsive)
# ------------------------------------------------------------
if grep -q 'name="viewport"' "$INDEX_FILE"; then
  ok "Viewport meta tag is present"
else
  fail "Viewport meta tag is MISSING"
fi

# ------------------------------------------------------------
# 5. Open Graph meta tags present
# ------------------------------------------------------------
if grep -q 'property="og:title"' "$INDEX_FILE" && \
   grep -q 'property="og:description"' "$INDEX_FILE"; then
  ok "Open Graph meta tags (og:title, og:description) are present"
else
  fail "One or more Open Graph meta tags are MISSING"
fi

# ------------------------------------------------------------
# 6. JavaScript asset is referenced and loads
# ------------------------------------------------------------
JS_PATH=$(grep -oE 'src="/[^"]+\.js"' "$INDEX_FILE" | head -n 1 | cut -d'"' -f2)
if [ -n "$JS_PATH" ]; then
  info "JS asset path: $JS_PATH"
  JS_STATUS=$(curl --silent --write-out "%{http_code}" --location \
    --max-time 30 "${BASE_ORIGIN}${JS_PATH}" --output "$JS_FILE")
  if [ "$JS_STATUS" -eq 200 ]; then
    ok "JS asset returned HTTP $JS_STATUS"
    # Sanity-check: bundle references the React root
    if grep -q "root" "$JS_FILE"; then
      ok "JS bundle contains expected app content"
    else
      fail "JS bundle does NOT contain expected app content"
    fi
  else
    fail "JS asset returned HTTP $JS_STATUS (expected 200)"
  fi
else
  fail "No JS asset <script src=…> found in index.html"
fi

# ------------------------------------------------------------
# 7. CSS asset is referenced and loads
# ------------------------------------------------------------
CSS_PATH=$(grep -oE 'href="/[^"]+\.css"' "$INDEX_FILE" | head -n 1 | cut -d'"' -f2)
if [ -n "$CSS_PATH" ]; then
  info "CSS asset path: $CSS_PATH"
  CSS_STATUS=$(curl --silent --write-out "%{http_code}" --location \
    --max-time 30 "${BASE_ORIGIN}${CSS_PATH}" --output "$CSS_FILE")
  if [ "$CSS_STATUS" -eq 200 ]; then
    ok "CSS asset returned HTTP $CSS_STATUS"
    # Sanity-check: TailwindCSS utility output is present
    if grep -q "background" "$CSS_FILE"; then
      ok "CSS bundle contains expected TailwindCSS output"
    else
      fail "CSS bundle does NOT contain expected TailwindCSS output"
    fi
  else
    fail "CSS asset returned HTTP $CSS_STATUS (expected 200)"
  fi
else
  fail "No CSS asset <link href=…> found in index.html"
fi

# ------------------------------------------------------------
# 8. Google Fonts preconnect hints present
# ------------------------------------------------------------
if grep -q 'fonts.googleapis.com' "$INDEX_FILE"; then
  ok "Google Fonts preconnect hint is present"
else
  fail "Google Fonts preconnect hint is MISSING"
fi

# ------------------------------------------------------------
# Summary
# ------------------------------------------------------------
echo ""
echo "========================================================"
TOTAL=$((PASS + FAIL))
echo "  Results: $PASS/$TOTAL checks passed"
if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}  ✅ All smoke checks PASSED${NC}"
else
  echo -e "${RED}  ❌ $FAIL smoke check(s) FAILED${NC}"
fi
echo "========================================================"
echo ""

[ "$FAIL" -eq 0 ]
