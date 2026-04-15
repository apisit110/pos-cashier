'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { User as UserIcon, Lock, LogIn, Loader2 } from 'lucide-react'
import { Login } from '../../application/use-cases/Login'
import { MockAuthRepository } from '../../infrastructure/repositories/MockAuthRepository'
import { Button } from '../../presentation/components/base/Button'
import { 
  InputGroup, 
  Label, 
  InputWrapper, 
  StyledInput, 
  InputIcon 
} from '../../presentation/components/base/Input'
import { 
  Title, 
  Subtitle, 
  ErrorText 
} from '../../presentation/components/base/Typography'
import { 
  AuthContainer, 
  AuthLeft, 
  AuthRight, 
  AuthCard, 
  LogoContainer, 
  StyledLogoImage, 
  LogoText 
} from '../../presentation/components/auth/AuthLayout'

// Initializing layers
const authRepository = new MockAuthRepository()
const loginUseCase = new Login(authRepository)

export default function LoginPage () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const user = await loginUseCase.execute({ username, password })

      if (user !== null) {
        alert(`Welcome back, ${user.username}!`)
        window.location.href = '/'
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContainer>
      <AuthLeft>
        <AuthCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Title>Welcome Back</Title>
            <Subtitle>Enter your credentials to access the portal</Subtitle>
          </div>

          <form 
            onSubmit={handleSubmit} 
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {error !== null && <ErrorText>{error}</ErrorText>}

            <InputGroup>
              <Label htmlFor='username'>Username</Label>
              <InputWrapper>
                <InputIcon>
                  <UserIcon size={18} />
                </InputIcon>
                <StyledInput
                  id='username'
                  type='text'
                  placeholder='Enter your username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading === true}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label htmlFor='password'>Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <StyledInput
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading === true}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <Button
              type='submit'
              disabled={isLoading === true}
            >
              {isLoading === true ? (
                <Loader2 size={18} className='animate-spin' />
              ) : (
                <LogIn size={18} />
              )}
              {isLoading === true ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </AuthCard>
      </AuthLeft>

      <AuthRight>
        <LogoContainer>
          <StyledLogoImage>
            <Image
              src='/lightning-logo.png'
              alt='Lightning Logo'
              width={180}
              height={180}
              priority
            />
          </StyledLogoImage>
          <LogoText>Lightning</LogoText>
        </LogoContainer>
      </AuthRight>
    </AuthContainer>
  )
}
