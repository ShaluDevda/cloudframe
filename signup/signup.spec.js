const { test, expect } = require('@playwright/test');
const { SignupPage } = require('../pages/signupPage');
const { json } = require('stream/consumers');

let signupPage;
test.describe('Sign Up Page Tests', () => {
  
    test.beforeEach(async ({ page }) => {
        signupPage = new SignupPage(page);
        await signupPage.goto();
    });

    test('Sign up with valid credentials', async ({ page }) => {
        await signupPage.signup('testuser', 'testuser@example.com', 'Password123');

        // Wait for and validate the post-login URL
        await expect(page).toHaveURL('https://demo.realworld.show/#/');
        const current = page.url(); // returns a string

        // Check that the Global Feed is visible
        await expect(page.locator('text=Global Feed')).toBeVisible();

        // Ensure there is at least one article preview on the feed
        const previews = await page.locator('.article-preview').count();
        expect(previews).toBeGreaterThan(0);
    });


    test('Sign up button should be enabled when all fields are filled', async () => {
        await signupPage.usernameInput.fill('shalu');
        await signupPage.emailInput.fill('devdashalu88@gmail.com');
        await signupPage.passwordInput.fill('securePassword123');

        const isEnabled = await signupPage.isSignupButtonEnabled();
        expect(isEnabled).toBe(true);
    });

    test('Sign up button should be disabled when any field is empty', async () => {
        const testData = [
            { username: '', email: 'devdashalu88@gmail.com', password: 'securePassword123' },
            { username: 'shalu', email: '', password: 'securePassword123' },
            { username: 'shalu', email: 'devdashalu88@gmail.com', password: '' },
        ];

        for (const data of testData) {
            await signupPage.goto(); // Reset page for each iteration
            await signupPage.usernameInput.fill(data.username);
            await signupPage.emailInput.fill(data.email);
            await signupPage.passwordInput.fill(data.password);
            const isEnabled = await signupPage.isSignupButtonEnabled();
            expect(isEnabled).toBe(false);
        }
    });
    test('Should show error for invalid email format', async () => {
        await signupPage.signup('shalu', 'invalidemail', 'Password123');
        const errors = await signupPage.page.locator('.error-messages li').allTextContents();
        expect(errors).toContain('email is invalid');
    });

    test('Should show error for short password', async () => {
        await signupPage.signup('shalu', 'shalu@example.com', '123');
        const errors = await signupPage.page.locator('.error-messages li').allTextContents();
        expect(errors).toContain('password is too short');
    });
    //  Successful Signup with API Response
    test('Sign up should return 201 and include token in response', async ({ page }) => {
        const [response] = await Promise.all([
            page.waitForResponse(resp =>
                resp.url().includes('/api/users') && resp.request().method() === 'POST'
            ),
            signupPage.signup('testuser2', 'testuser2@example.com', 'Password123')
        ]);

        expect(response.status()).toBe(201);
        const body = await response.json();
        console.log(body);
        expect(body.user).toHaveProperty('token');
        expect(body.user.email).toBe('testuser2@example.com');
    });



});
