'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './register.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', repeatPassword: '' })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.firstName.trim())                               errors.firstName = 'First name is required'
    if (!formData.lastName.trim())                                errors.lastName = 'Last name is required'
    if (!formData.email)                                          errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))               errors.email = 'Please enter a valid email address'
    if (!formData.password)                                       errors.password = 'Password is required'
    else if (formData.password.length < 6)                        errors.password = 'Password must be at least 6 characters'
    if (!formData.repeatPassword)                                 errors.repeatPassword = 'Please confirm your password'
    else if (formData.password !== formData.repeatPassword)       errors.repeatPassword = 'Passwords do not match'
    if (!agreedToTerms)                                           errors.terms = 'You must agree to the terms & conditions'
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setFieldErrors(validationErrors); return }
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password }),
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Registration failed. Please try again.'); return }
      router.push('/login?registered=true')
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fieldError = (key: string) =>
    fieldErrors[key] ? <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{fieldErrors[key]}</div> : null

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

      <div className={styles.regWrap}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className={styles.rightSide}>
                <div className={styles.illustration}>
                  <img src="/assets/images/registration.png" alt="Registration Illustration" />
                </div>
                <div className={styles.illustrationDark}>
                  <img src="/assets/images/registration1.png" alt="Registration Illustration Dark" />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className={styles.content}>
                <div className={styles.logoWrap}>
                  <img src="/assets/images/logo.svg" alt="Buddy Script" className={styles.logo} />
                </div>
                <p className={styles.tagline}>Get Started Now</p>
                <h4 className={styles.heading}>Registration</h4>

                <button type="button" className={styles.googleBtn}>
                  <img src="/assets/images/google.svg" alt="Google" className={styles.googleIcon} />
                  <span>Register with google</span>
                </button>

                <div className={styles.divider}><span>Or</span></div>

                {error && (
                  <div style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className={styles.fieldWrap}>
                        <label className={styles.label}>First Name</label>
                        <input type="text" name="firstName" className={`form-control ${styles.input}${fieldErrors.firstName ? ' is-invalid' : ''}`} value={formData.firstName} onChange={handleChange} autoComplete="given-name" />
                        {fieldError('firstName')}
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className={styles.fieldWrap}>
                        <label className={styles.label}>Last Name</label>
                        <input type="text" name="lastName" className={`form-control ${styles.input}${fieldErrors.lastName ? ' is-invalid' : ''}`} value={formData.lastName} onChange={handleChange} autoComplete="family-name" />
                        {fieldError('lastName')}
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className={styles.fieldWrap}>
                        <label className={styles.label}>Email</label>
                        <input type="email" name="email" className={`form-control ${styles.input}${fieldErrors.email ? ' is-invalid' : ''}`} value={formData.email} onChange={handleChange} autoComplete="email" />
                        {fieldError('email')}
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className={styles.fieldWrap}>
                        <label className={styles.label}>Password</label>
                        <input type="password" name="password" className={`form-control ${styles.input}${fieldErrors.password ? ' is-invalid' : ''}`} value={formData.password} onChange={handleChange} autoComplete="new-password" />
                        {fieldError('password')}
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className={styles.fieldWrap}>
                        <label className={styles.label}>Repeat Password</label>
                        <input type="password" name="repeatPassword" className={`form-control ${styles.input}${fieldErrors.repeatPassword ? ' is-invalid' : ''}`} value={formData.repeatPassword} onChange={handleChange} autoComplete="new-password" />
                        {fieldError('repeatPassword')}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className={`form-check ${styles.checkWrap}`}>
                        <input className={`form-check-input ${styles.check}`} type="radio" name="flexRadioDefault" id="agreeTerms" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} />
                        <label className={`form-check-label ${styles.checkLabel}`} htmlFor="agreeTerms">
                          I agree to terms &amp; conditions
                        </label>
                      </div>
                      {fieldError('terms')}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className={styles.btnWrap}>
                        <button type="submit" className={styles.submitBtn} disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                          {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                              Creating account...
                            </span>
                          ) : 'Register now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="row">
                  <div className="col-xl-12">
                    <div className={styles.footer}>
                      <p className={styles.footerText}>
                        Already have an account?{' '}
                        <Link href="/login">Login</Link>
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
