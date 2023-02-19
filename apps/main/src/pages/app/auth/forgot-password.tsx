import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import LoadingDots from '@components/common/loading-dots/LoadingDots'

import AuthLayout from '@components/app/layout/AuthLayout'

import { api, type RouterOutputs } from '@lib/utils/api'

const pageTitle = 'Connexion'
const description = 'Connecte toi à T-WOL pour gérer les dons et les donateurs.'

type ForgotFormValues = {
  email: string
}

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState<string | null>()
  const [resetError, setResetError] = useState<string | null>()

  // function validate user
  const { mutate: requestReset, isLoading } =
    api.forgotPassword.requestReset.useMutation({
      onSuccess(data) {
        if (data === "allGood") {
          setLoading(false);
          setResetError(null);
          setResetSuccess(
            "Si ton compte existe, tu trouveras un email avec ton lien magique pour modifier ton mot de passe."
          );
        } 
      },
      onError(error) {
        setLoading(false);
        setResetError("An error occured");
        setResetSuccess(null);
        toast.error(error.message, {
          position: 'top-right',
        })
      },
    })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotFormValues>()

  const onSubmit = handleSubmit(async (data) => {
    if (resetSuccess) {
      return
    }
    setLoading(true)
    requestReset({
      email: data.email,
    })
  })

  return (
    <AuthLayout pageTitle={pageTitle} pageDescription={description}>
      <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">
        Forgot Password
      </h1>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
        You are not alone. We’ve all been here at some point.
      </p>
      <form
        action="#"
        className="mt-8 flex w-full flex-col gap-4"
        onSubmit={onSubmit}
      >
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
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
          {errors.email && (
            <div className="mt-1 text-sm font-normal text-red-700 dark:text-red-200">
              <p>Cette addresse email n&apos;est pas correct</p>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex flex-col">
            {!resetSuccess ? (
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
                  'Get secure link'
                ) : (
                  <>
                    Sending <LoadingDots color="#fff" />
                  </>
                )}
              </button>
            ) : null}
            {resetError ? (
              <div className="mt-1 text-sm font-normal text-red-700 dark:text-red-200">
                <p>{resetError}</p>
              </div>
            ) : null}
            {resetSuccess ? (
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                <p>{resetSuccess}</p>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}
