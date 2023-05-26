import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from core.models import Project


@pytest.fixture()
def login_client():
    User = get_user_model()
    User.objects.create_superuser("username-test", "email-test", "password-test")
    client = APIClient()
    client.login(username="username-test", password="password-test")
    return client


@pytest.fixture()
def project():
    return Project.objects.create(name="Test-project")
