// Minimal seed data. global-setup creates it before the tests.
// Spec: specs/register-user.spec.yaml (R0002 S001)
export const existingUser = {
  name: 'Existing User',
  email: 'already_taken@example.com',
  password: 'SecurePassword123!',
};

export const seedUsers = [existingUser];
