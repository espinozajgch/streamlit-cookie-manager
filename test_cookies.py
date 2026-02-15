import streamlit as st

from cookie_manager import cookie_delete, cookie_get, cookie_set

st.title("Test Cookie Manager")

cookie_name = st.text_input("Cookie name", "MY_COOKIE")
cookie_value = st.text_input("Cookie value", "cookie123")

col1, col2, col3 = st.columns(3)

with col1:
    if st.button("SET"):
        resp = cookie_set(cookie_name, cookie_value, days=1, cookieSecure=False)
        st.write(resp)

with col2:
    if st.button("GET"):
        resp = cookie_get(cookie_name)
        st.write(resp)

with col3:
    if st.button("DELETE"):
        resp = cookie_delete(cookie_name, cookieSecure=False)
        st.write(resp)