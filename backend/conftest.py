#!/usr/bin/env python3
"""
pytest configuration for CI/CD
"""

import os
import sys
import pytest

# Check if running in CI environment
CI_ENVIRONMENT = os.getenv('CI', 'false').lower() == 'true'

def pytest_configure(config):
    """Configure pytest for CI"""
    if CI_ENVIRONMENT:
        # Skip tests that require database connection in CI
        config.addinivalue_line(
            "markers", "skip_ci: Skip tests that require database in CI"
        )

def pytest_collection_modifyitems(config, items):
    """Modify test collection for CI"""
    if CI_ENVIRONMENT:
        # In CI, only run CI tests
        items[:] = [item for item in items if "test_ci" in item.nodeid]
    else:
        # Locally, run all tests except integration tests if services not available
        try:
            import pymysql
            pymysql.connect(host='localhost', port=3306, user='root', password='')
            # MySQL available, keep all tests
        except:
            # MySQL not available, skip integration tests
            items[:] = [item for item in items if "test_integration" not in item.nodeid]
