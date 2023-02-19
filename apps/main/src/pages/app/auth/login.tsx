import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { encrypt } from '@twol/utils/auth/crypto'

import LoadingDots from '@components/common/loading-dots/LoadingDots'

import { UilEye, UilEyeSlash } from '@iconscout/react-unicons'

import AuthLayout from '@components/app/layout/AuthLayout'

import { api, type RouterOutputs } from '@lib/utils/api'

const pageTitle = 'Connexion'
const pageDescription =
  'Connecte toi à T-WOL pour gérer les dons et les donateurs.'
const MINIMUM_TIMEOUT_FOR_ACTIVITY = 850

const EMAIL_INVALID_ERROR_MESSAGE = "Le format de l'email est invalide."
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Invalid Credentials'
const EMAIL_VERIFICATION_ERROR_MESSAGE =
  "Une erreur est survenue lors de l'envoie du code de verification"
const PASSWORD_FORMAT_ERROR_MESSAGE = 'Le format du mot de passe est incorrect'
const TOKEN_SAVE_ERROR_MESSAGE =
  'un problème est survenue lors de la sauvegarde du token'
const UNEXPECTED_ERROR_MESSAGE =
  "Une erreur c'est produite lors de l'envoie du code auprès de votre adresse email. Si cela persiste veuillez prendre contact avec T-WOL.com."
const SERVER_CONNECTION_ERROR_MESSAGE =
  "Une erreur c'est produite lors de la connexion avec notre serveur, si cela persiste veuillez contacter T-WOL.com"
const EMPTY_EMAIL_ERROR_MESSAGE = 'Tu dois rentrer ton email.'
const EMPTY_PASSWORD_ERROR_MESSAGE = 'Tu dois rentrer ton mot de passe.'

type LoginFormValues = {
  verificationNumber: string
  csrfToken: string
  email: string
  password: string
}

export default function Login() {
  const [loading, setLoading] = useState(false)
  // Get error message added by next/auth in URL.
  const { query } = useRouter()
  const { error } = query
  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])
  // Get router
  const router = useRouter()
  // Register the form
  const { register, handleSubmit, getValues, setValue } =
    useForm<LoginFormValues>()

  // function validate user
  const { mutate: validateLoginUser, isLoading } =
    api.auth.validateLoginUser.useMutation({
      onSuccess(data) {
        setLoading(false)
        setStepForm('two')
      },
      onError(error) {
        setLoading(false)
        toast.error(error.message, {
          position: 'top-right',
        })
      },
    })

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)

    // Encrypt password before sending to server
    const hashPasswordToSend = encrypt(getValues('password'))

    try {
      await signIn('admin-login', {
        callbackUrl: '/',
        email: data.email,
        passwordIV: hashPasswordToSend.iv,
        passwordContent: hashPasswordToSend.content,
        verificationNumber: data.verificationNumber,
      })

      // Wait a minimum amount of time before setting loading to false to
      // provide feedback to the user that the form is being submitted
      setTimeout(() => {
        setLoading(false)
      }, MINIMUM_TIMEOUT_FOR_ACTIVITY)
    } catch (error) {
      console.error(error)
      //   setError(error)
      setLoading(false)
    }
  })

  const [stepForm, setStepForm] = useState<string>('one')

  const [showPass, setShowPass] = useState<boolean>(false)

  const handleVerficationNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters from input value
    const result = e.target.value.replace(/\D/g, '')

    // Set the value of the "verificationNumber" field in the form
    setValue('verificationNumber', result)
  }

  const verifyEmail = () => {
    if (getValues('email').length === 0) {
      setLoading(false)
      toast.error(EMPTY_EMAIL_ERROR_MESSAGE)
      return
    }

    if (getValues('password') === null) {
      setLoading(false)
      toast.error(EMPTY_PASSWORD_ERROR_MESSAGE)
      return
    }

    const hash = encrypt(getValues('password'))

    validateLoginUser({
      userEmail: getValues('email'),
      userPassIv: hash.iv,
      userPassContent: hash.content,
    })
  }
  const [isButtonDisabledValue, setIsButtonDisabledValue] =
    useState<boolean>(true)

  const isButtonDisabled = () => {
    const { email, password } = getValues()
    return setIsButtonDisabledValue(!email || !password)
  }
  return (
    <AuthLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <form
        action="#"
        className="mt-8 flex w-full flex-col gap-4"
        onSubmit={onSubmit}
      >
        {stepForm !== 'two' && (
          <div className="w-full flex flex-col">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: true,
                onChange: () => isButtonDisabled(),
                pattern:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        )}
        {stepForm !== 'two' && (
          <div className="w-full flex flex-col relative">
            <div className="w-full justify-between items-end flex flex-row relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="block text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={!showPass ? 'password' : 'text'}
                autoComplete="off"
                minLength={12}
                required
                {...register('password', {
                  required: true,
                  onChange: () => isButtonDisabled(),
                })}
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-xs text-gray-400 dark:text-gray-700 cursor-pointer leading-5"
                onMouseDown={() => setShowPass(true)}
                onMouseUp={() => setShowPass(false)}
              >
                {showPass ? (
                  <UilEyeSlash className="h-5 mt-1" />
                ) : (
                  <UilEye className="h-5 mt-1" />
                )}
              </span>
            </div>
          </div>
        )}
        {stepForm === 'two' && (
          <div className="w-full flex flex-col">
            <label
              htmlFor="verificationNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Rentre le numéro de validation que nous t&apos;avons envoyé
            </label>

            <input
              type="text"
              autoComplete="off"
              id="verificationNumber"
              placeholder="Numéro de validation"
              {...register('verificationNumber')}
              onChange={handleVerficationNumber}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        )}

        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex flex-col">
            {stepForm === 'two' && (
              <button
                disabled={loading}
                type="submit"
                className={`${
                  loading ? 'cursor-not-allowed bg-gray-600' : 'bg-black'
                } inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white`}
              >
                {loading ? (
                  <LoadingDots color="#fff" />
                ) : (
                  'Valider la connexion'
                )}
              </button>
            )}
          </div>
          <div className="w-full flex flex-col">
            {stepForm === 'one' && (
              <button
                type="button"
                disabled={
                  loading === true || error === null || isButtonDisabledValue
                }
                onClick={(e) => {
                  e.preventDefault()
                  setLoading(true)
                  verifyEmail()
                }}
                className={`${
                  loading || error || isButtonDisabledValue
                    ? 'cursor-not-allowed bg-gray-600'
                    : 'bg-black'
                } inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white`}
              >
                {loading ? <LoadingDots color="#fff" /> : 'Connexion'}
              </button>
            )}
          </div>
        </div>
      </form>
      {stepForm !== 'two' && (
        <>
          <div className="inline-flex my-4 justify-center relative items-center w-full">
            <hr className="my-8 w-64 h-px bg-gray-200 border-0 dark:bg-gray-700" />
            <span className="absolute left-1/2 px-3 font-medium text-gray-900 bg-white -translate-x-1/2 dark:text-white dark:bg-gray-900">
              Ou avec
            </span>
          </div>
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-4">
              <button
                disabled={loading}
                onClick={() => {
                  setLoading(true)
                  signIn('google', { callbackUrl: '/login' })
                }}
                className={`${
                  loading ? 'cursor-not-allowed bg-gray-600' : 'bg-black'
                } inline-flex justify-center items-center w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white`}
              >
                {loading ? (
                  <LoadingDots color="#fff" />
                ) : (
                  <svg
                    className="w-6 h-6 relative block group-hover:animate-wiggle"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center gap-4 my-6">
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                Ton organisme n&apos;a pas encore de compte ?{' '}
                <Link
                  href={`/auth/register`}
                  passHref
                  className="text-gray-700 underline dark:text-gray-200"
                >
                  Inscrit la&nbsp;!
                </Link>
              </p>
            </div>
          </div>
        </>
      )}
    </AuthLayout>
  )
}
