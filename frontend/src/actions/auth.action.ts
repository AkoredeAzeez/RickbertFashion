// Mock login/register functions for easy replacement
export async function mockLogin(email: string, password: string): Promise<{ userId: string }> {
  await new Promise(res => setTimeout(res, 500))
  if (!email || !password) throw new Error('Missing credentials')
  // Replace with real API call
  return { userId: 'mock-user-id' }
}

export async function mockRegister(email: string, password: string): Promise<{ userId: string }> {
  await new Promise(res => setTimeout(res, 500))
  if (!email || !password) throw new Error('Missing credentials')
  // Replace with real API call
  return { userId: 'mock-user-id' }
}
