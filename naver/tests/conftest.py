import pytest


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    # GitHub 서버는 미국에 있으므로 한국어/서울 시간대로 고정
    return {
        **browser_context_args,
        "locale": "ko-KR",
        "timezone_id": "Asia/Seoul",
        "viewport": {"width": 1280, "height": 800},
    }
