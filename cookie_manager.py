import streamlit.components.v1 as components

from src.auth_system import auth_config

if auth_config.SERVER_ENV == "prod":
    _cookie_component = components.declare_component(
        "cookie_manager",
        url=auth_config.COMPONENT_DOMAIN
    )
else:
    _cookie_component = components.declare_component(
        name="cookie_manager",
        url="http://localhost:3001",  # usando modo development
    )

def cookie_set(name: str, value: str, days: int = 7, key: str | None = None, **kwargs):
    return _cookie_component(
        action="set",
        name=name,
        value=value,
        days=days,
        key=key or f"cookie_set__{name}",
        **kwargs
    )

def cookie_get(name: str, key: str | None = None, **kwargs):
    return _cookie_component(
        action="get",
        name=name,
        key=key or f"cookie_get__{name}",
        **kwargs
    )

def cookie_delete(name: str, key: str | None = None, **kwargs):
    return _cookie_component(
        action="delete",
        name=name,
        key=key or f"cookie_delete__{name}",
        **kwargs
    )