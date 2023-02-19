import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { encrypt } from '@twol/utils/auth/crypto'
import LoadingDots from '@components/common/loading-dots/LoadingDots'
import AuthLayout from '@components/app/layout/AuthLayout'
import { UilEye, UilEyeSlash } from '@iconscout/react-unicons'
import { api, type RouterOutputs } from '@lib/utils/api'

const pageTitle = 'Reset your password'
const description = 'Reset your T-WOL password.'

type ResetFormValues = {
  password: string
}
export default function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<
    string | null
  >()
  const [resetPasswordError, setResetPasswordError] = useState<string | null>()

  const [showPass, setShowPass] = useState<boolean>(false)

  const { query } = useRouter()
  const token = query.token as string
  const email = query.email as string
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetFormValues>()

  // function validate user
  const { mutate: resetPassword, isLoading } =
    api.forgotPassword.resetPassword.useMutation({
      onSuccess(data) {
        setResetPasswordSuccess(
          "C'est officiel ton mot de passe à été Pimpé 🔑"
        )
        setLoading(false)
        setTimeout(() => {
          router.push('/auth/login')
        }, 4000)
        setResetPasswordError('')
      },
      onError(error) {
        setLoading(false)
        setResetPasswordError('An error occured')
        setResetPasswordSuccess(null)
        toast.error(error.message, {
          position: 'top-right',
        })
      },
    })

  const onSubmit = handleSubmit(async (data) => {
    if (resetPasswordSuccess) {
      return
    }
    setLoading(true)

    const hash = encrypt(data.password)
    resetPassword({
      token: token,
      email: email,
      passwordIv: hash.iv,
      passwordContent: hash.content,
    })
  })

  return (
    <AuthLayout pageTitle={pageTitle} pageDescription={description}>
      {email && token ? (
        <>
          <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">
            Reset Password
          </h1>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Please enter your new password
          </p>
          <form
            action="#"
            className="mt-8 flex w-full flex-col gap-4"
            onSubmit={onSubmit}
          >
            <div className="w-full flex flex-col">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={!showPass ? 'password' : 'text'}
                  {...register('password', {
                    required: true,
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,25}$/,
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
              {errors.password && (
                <div className="mt-1 text-sm font-normal text-red-700 dark:text-red-200">
                  <p>Ce mot de passe n&apos;est pas correct</p>
                </div>
              )}
            </div>
            <div className="w-full flex flex-col items-center gap-4">
              <div className="w-full flex flex-col">
                {!resetPasswordSuccess ? (
                  <button
                    disabled={loading || !isValid}
                    type="submit"
                    className={`${
                      loading || !isValid
                        ? 'cursor-not-allowed bg-gray-600'
                        : 'bg-black'
                    } inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white`}
                  >
                    {!loading ? (
                      'Reset'
                    ) : (
                      <>
                        Processing <LoadingDots color="#fff" />
                      </>
                    )}
                  </button>
                ) : null}
                {resetPasswordError ? (
                  <div className="mt-1 text-sm font-normal text-red-700 dark:text-red-200">
                    <p>{resetPasswordError}</p>
                  </div>
                ) : null}
                {resetPasswordSuccess ? (
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    <p>{resetPasswordSuccess}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </form>
        </>
      ) : (
        <p>The page you&apos;re trying to get to isn&apos;t available</p>
      )}
    </AuthLayout>
  )
}
