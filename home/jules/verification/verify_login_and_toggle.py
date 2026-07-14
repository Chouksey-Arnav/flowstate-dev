import os
from playwright.sync_api import sync_playwright, expect

def main():
    print("Starting Playwright verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # Create output dir if needed
        os.makedirs("home/jules/verification", exist_ok=True)

        # 1. Go to signup page
        print("Navigating to signup page...")
        page.goto("http://localhost:3000/signup")
        page.wait_for_timeout(1000)

        # Fill in signup details
        print("Filling out signup details...")
        page.fill("#signup-username", "testuser_verif")
        page.fill("#signup-password", "super_secure_pass123")
        page.fill("#signup-confirm-password", "super_secure_pass123")

        # Capture signup screenshot before toggling visibility
        page.screenshot(path="home/jules/verification/signup_filled.png")

        # Toggle password visibility on signup page using "i" button next to password
        print("Toggling password visibility...")
        password_toggle = page.locator("button[aria-label='Show password']").first
        password_toggle.click()
        page.wait_for_timeout(500)

        # Check if type became text
        password_input_type = page.locator("#signup-password").get_attribute("type")
        print(f"Password input type after clicking toggle: {password_input_type}")
        assert password_input_type == "text", "Password input type did not change to text!"

        # Take a screenshot showing visible password
        page.screenshot(path="home/jules/verification/signup_visible_password.png")

        # Submit signup form
        print("Submitting signup form...")
        page.click("button[type='submit']")
        page.wait_for_timeout(2000)

        # Should redirect to dashboard
        current_url = page.url
        print(f"Current URL after signup submission: {current_url}")
        assert "/dashboard" in current_url, "Did not successfully redirect to dashboard after signup!"

        # Capture dashboard screenshot to verify session is active
        page.screenshot(path="home/jules/verification/dashboard_after_signup.png")

        # Let's log out to test login flow
        print("Logging out...")
        # Navigate to settings to log out
        page.goto("http://localhost:3000/settings")
        page.wait_for_timeout(1000)
        page.screenshot(path="home/jules/verification/settings_page.png")

        logout_btn = page.get_by_role("button", name="Log out")
        if logout_btn.count() > 0:
            logout_btn.click()
            page.wait_for_timeout(1500)
            print(f"URL after clicking logout: {page.url}")
            assert "/login" in page.url, "Logout did not redirect back to login page!"
        else:
            # Fallback clear cookies and navigate to login
            context.clear_cookies()
            page.goto("http://localhost:3000/login")
            page.wait_for_timeout(1000)

        # We are on login page, let's login with the newly created account!
        print("Testing log in with the new account...")
        page.fill("#login-username", "testuser_verif")
        page.fill("#login-password", "super_secure_pass123")

        # Toggle password visibility on login page
        login_password_toggle = page.locator("button[aria-label='Show password']")
        login_password_toggle.click()
        page.wait_for_timeout(500)

        login_password_input_type = page.locator("#login-password").get_attribute("type")
        print(f"Login password input type after clicking toggle: {login_password_input_type}")
        assert login_password_input_type == "text", "Login password input type did not change to text!"

        # Capture login page with revealed password screenshot
        page.screenshot(path="home/jules/verification/login_revealed.png")

        # Submit login form
        print("Submitting login form...")
        page.click("button[type='submit']")
        page.wait_for_timeout(2000)

        print(f"Final URL after login: {page.url}")
        assert "/dashboard" in page.url, "Did not successfully log in and redirect to dashboard!"

        # Capture final logged-in dashboard screenshot
        page.screenshot(path="home/jules/verification/dashboard_after_login.png")

        print("All verification steps completed successfully!")
        browser.close()

if __name__ == "__main__":
    main()
