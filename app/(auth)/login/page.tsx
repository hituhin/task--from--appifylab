'use client'

import { Suspense, useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.css'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please log in.')
    }
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam === 'CredentialsSignin'
        ? 'Invalid email or password. Please try again.'
        : 'An error occurred. Please try again.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setIsLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else if (result?.ok) {
        router.push('/feed')
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.shapeOne}>
        <img src="/assets/images/shape1.svg" alt="" className={styles.shapeImg} />
        <img src="/assets/images/dark_shape.svg" alt="" className={styles.darkShape} />
      </div>
      <div className={styles.shapeTwo}>
        <img src="/assets/images/shape2.svg" alt="" className={styles.shapeImg} />
        <img src="/assets/images/dark_shape1.svg" alt="" className={styles.dimShape} />
      </div>
      <div className={styles.shapeThree}>
        <img src="/assets/images/shape3.svg" alt="" className={styles.shapeImg} />
        <img src="/assets/images/dark_shape2.svg" alt="" className={styles.dimShape} />
      </div>

      <div className={styles.loginWrap}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className={styles.leftSide}>
                <div className={styles.leftImage}>
                  <img src="/assets/images/login.png" alt="Login Illustration" className={styles.leftImg} />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className={styles.content}>
                <div className={styles.logoWrap}>
                  <img src="/assets/images/logo.svg" alt="Buddy Script" className={styles.logo} />
                </div>
                <p className={styles.tagline}>Welcome back</p>
                <h4 className={styles.heading}>Login to your account</h4>

                <button type="button" className={styles.googleBtn}>
                  <img src="/assets/images/google.svg" alt="Google" className={styles.googleIcon} />
                  <span>Or sign-in with google</span>
                </button>

                <div className={styles.divider}><span>Or</span></div>

                {successMessage && (
                  <div style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '14px' }}>
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className={styles.fieldWrap}>
                        <label className={styles.label}>Email</label>
                        <input type="email" className={`form-control ${styles.input}`} value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className={styles.fieldWrap}>
                        <label className={styles.label}>Password</label>
                        <input type="password" className={`form-control ${styles.input}`} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className={`form-check ${styles.checkWrap}`}>
                        <input className={`form-check-input ${styles.check}`} type="radio" name="flexRadioDefault" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                        <label className={`form-check-label ${styles.checkLabel}`} htmlFor="rememberMe">Remember me</label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className={styles.forgotWrap}>
                        <p className={styles.forgotText} style={{ cursor: 'pointer' }}>Forgot password?</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className={styles.btnWrap}>
                        <button type="submit" className={styles.submitBtn} disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                          {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                              Logging in...
                            </span>
                          ) : 'Login now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="row">
                  <div className="col-xl-12">
                    <div className={styles.footer}>
                      <p className={styles.footerText}>
                        Dont have an account?{' '}
                        <Link href="/register">Create New Account</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
