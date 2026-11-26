import os
import re

import pytest
from playwright.sync_api import Page, expect

# Actions 수동 실행 시 FORCE_FAIL=1 이면 일부러 실패시켜 스크린샷/trace 확인 실습
FORCE_FAIL = os.getenv("FORCE_FAIL") == "1"


def test_메인에서_검색하면_결과_페이지로_이동한다(page: Page):
    page.goto("https://www.naver.com")

    search_box = page.locator("#query")
    expect(search_box).to_be_visible()
    search_box.fill("플레이라이트")
    search_box.press("Enter")

    expect(page).to_have_url(re.compile(r"search\.naver\.com/search\.naver\?.*query="))
    # 결과 페이지 상단 검색창에 검색어가 유지되어야 함
    expect(page.locator("#nx_query")).to_have_value("플레이라이트")


@pytest.mark.parametrize("keyword", ["Playwright", "GitHub Actions"])
def test_검색_결과에_키워드가_포함된다(page: Page, keyword: str):
    page.goto(f"https://search.naver.com/search.naver?query={keyword}")

    expected = "이건절대안나올문자열" if FORCE_FAIL else keyword
    expect(page.locator("#main_pack")).to_contain_text(expected, ignore_case=True)
