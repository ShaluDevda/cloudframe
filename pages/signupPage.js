class SignupPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('//input[@placeholder="Username"]');
    this.emailInput = page.locator('//input[@placeholder="Email"]');
    this.passwordInput = page.locator('//input[@placeholder="Password"]');
    this.signupButton = page.locator('button:has-text("Sign up")');
  }

  async goto() {
    await this.page.goto('https://demo.realworld.show/#/register');
  }

  async signup(username, email, password) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signupButton.click();
    // wait for network to be idle so redirects / page updates finish
    await this.page.waitForLoadState('networkidle');
  }

  async isSignupButtonEnabled() {
    return await this.signupButton.isEnabled();
  }

  
}

// Export using CommonJS so tests using `require()` can load this file
export { SignupPage };
