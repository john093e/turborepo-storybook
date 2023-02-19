import { useDebounce } from 'use-debounce'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import LoadingDots from '@components/common/loading-dots/LoadingDots'
import toast from 'react-hot-toast'
import { HttpMethod } from '@types'
import type { FormEvent } from 'react'
import { encrypt } from '@twol/utils/auth/crypto'

import AuthLayout from '@components/app/layout/AuthLayout'

import { api, type RouterOutputs } from '@lib/utils/api'

const pageTitle = 'Rejoignez votre compte T-WOL'
const description = 'Rejoignez votre compte T-WOL.'

export default function InviteUser() {
  const [loading, setLoading] = useState(false)

  // Get error message added by next/auth in URL.
  const { query } = useRouter()
  const { error, id } = query

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  // Adding form field
  // email & password
  const [userEmail, setUserEmail] = useState<string>('')
  const [userStatusPasswordSet, setUserStatusPasswordSet] = useState<
    boolean | null
  >(null)
  const [userEmailValid, setUserEmailValid] = useState<boolean | null>(null)
  const [userStatusNameSet, setUserStatusNameSet] = useState<boolean | null>(
    null
  )
  const [userStatusMarketingAccept, setUserStatusMarketingAccept] = useState<
    boolean | null
  >(null)
  const [debouncedUserEmail] = useDebounce(userEmail, 500)
  const [errorFormEmail, setErrorFormEmail] = useState<string | null>(null)

  //verification token
  const [verificationNumber, setVerficationNumber] = useState<string>('')
  const [errorFormValidationNumber, setErrorFormValidationNumber] = useState<
    string | null
  >(null)
  const [debouncedVerficationNumber] = useDebounce(verificationNumber, 500)

  // Form Ref
  const verificationNumberRef = useRef<HTMLInputElement | null>(null)
  const firstNameRef = useRef<HTMLInputElement | null>(null)
  const lastNameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const passwordConfirmationRef = useRef<HTMLInputElement | null>(null)
  const marketingAcceptRef = useRef<HTMLInputElement | null>(null)
  const [stepForm, setStepForm] = useState<string>('one')

  //data to send
  const [firstNameFieldToSend, setFirstNameFieldToSend] = useState<
    string | null
  >(null)
  const [lastNameFieldToSend, setLastNameFieldToSend] = useState<string | null>(
    null
  )
  const [emailFieldToSend, setEmailFieldToSend] = useState<string | null>(null)
  const [passwordFieldToSend, setPasswordFieldToSend] = useState<string | null>(
    null
  )
  const [passwordConfirmationFieldToSend, setPasswordConfirmationFieldToSend] =
    useState<string | null>(null)
  const [marketingAcceptFieldToSend, setMarketingAcceptFieldToSend] = useState<
    boolean | null
  >(null)

  // function check User Already Exist or not ?
  const { mutate: checkInviteUser, isLoading: isLoadingCheckInviteUser } =
    api.inviteUser.checkInviteUser.useMutation({
      onSuccess(data) {
        setEmailFieldToSend(debouncedUserEmail)
        setPasswordFieldToSend(null)
        setPasswordConfirmationFieldToSend(null)
        setFirstNameFieldToSend(null)
        setLastNameFieldToSend(null)
        setErrorFormEmail(null)
        setUserEmailValid(true)
        if (data.passwordSet === true) {
          setUserStatusPasswordSet(true)
        } else {
          setUserStatusPasswordSet(false)
        }

        if (data.firstnameSet === true && data.lastnameSet === true) {
          setUserStatusNameSet(true)
        } else {
          setUserStatusNameSet(false)
        }

        if (data.marketingAccept === true) {
          setUserStatusMarketingAccept(true)
          setMarketingAcceptFieldToSend(true)
        } else {
          setUserStatusMarketingAccept(false)
          setMarketingAcceptFieldToSend(null)
        }
      },
      onError(error) {
        setEmailFieldToSend(null)
        setMarketingAcceptFieldToSend(null)
        setPasswordFieldToSend(null)
        setPasswordConfirmationFieldToSend(null)
        setFirstNameFieldToSend(null)
        setLastNameFieldToSend(null)
        setErrorFormEmail(null)
        setUserEmailValid(false)
        setUserStatusPasswordSet(null)
        setUserStatusNameSet(null)
        setUserStatusMarketingAccept(null)
        toast.error(error.message, {
          position: 'top-right',
        })
      },
    })

  // Check if user email has receive an invitation + exist or not
  useEffect(() => {
    async function checkUserEmail() {
      if (debouncedUserEmail.length > 0) {
        if (
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i.test(
            debouncedUserEmail
          )
        ) {
          checkInviteUser({
            userEmail: debouncedUserEmail,
            inviteToken: id as string,
          })
        }
      } else {
        setEmailFieldToSend(null)
        setMarketingAcceptFieldToSend(null)
        setPasswordFieldToSend(null)
        setPasswordConfirmationFieldToSend(null)
        setFirstNameFieldToSend(null)
        setLastNameFieldToSend(null)
        setErrorFormEmail(null)
        setUserEmailValid(false)
        setUserStatusPasswordSet(null)
        setUserStatusNameSet(null)
        setUserStatusMarketingAccept(null)
      }
    }
    checkUserEmail()
  }, [debouncedUserEmail, id])

  const router = useRouter()

  // function accept invite
  const { mutate: acceptInvite, isLoading: isLoadingAcceptInvite } =
    api.inviteUser.acceptInvite.useMutation({
      onSuccess(data) {
        setLoading(false)
        router.push(`/auth/login`)
      },
      onError(error) {
        setLoading(false)
        toast.error(error.message, {
          position: 'top-right',
        })
      },
    })

  async function acceptInviteHandler(e: FormEvent<HTMLFormElement>) {
    const hashPasswordToSend = encrypt(passwordFieldToSend as string)
    const hashPasswordConfirmationToSend = encrypt(
      passwordConfirmationFieldToSend as string
    )

    acceptInvite({
      firstName: firstNameFieldToSend,
      lastName: lastNameFieldToSend,
      language: 'fr',
      email: emailFieldToSend as string,
      passwordIv: hashPasswordToSend.iv,
      passwordContent: hashPasswordToSend.content,
      passwordConfirmationIv: hashPasswordConfirmationToSend.iv,
      passwordConfirmationContent: hashPasswordConfirmationToSend.content,
      marketingAccept: marketingAcceptFieldToSend,
      verificationNumber: verificationNumberRef.current!.value,
      inviteToken: id as string,
    })
  }

  const handleVerficationNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(/\D/g, '')
    setVerficationNumber(result)
  }

  // function check User Already Exist or not ?
  const { mutate: validateUser, isLoading: isLoadingValidateUser } =
  api.inviteUser.validateUser.useMutation({
    onSuccess(data) {
      setLoading(false)
      setPasswordFieldToSend(passwordRef.current!.value)
      setPasswordConfirmationFieldToSend(
        passwordConfirmationRef.current!.value
      )
      if (userStatusNameSet === false) {
        setFirstNameFieldToSend(firstNameRef.current!.value)
        setLastNameFieldToSend(lastNameRef.current!.value)
      }
      if (marketingAcceptFieldToSend === false) {
        if (marketingAcceptRef.current!.checked) {
          setMarketingAcceptFieldToSend(true)
        } else {
          setMarketingAcceptFieldToSend(false)
        }
      }
      setStepForm('two')
    },
    onError(error) {
      setErrorFormEmail(null)
      setUserEmailValid(false)
      setUserStatusPasswordSet(null)
      setUserStatusNameSet(null)
      setUserStatusMarketingAccept(null)
      setLoading(false)
      router.push(`/join/${id}/?error=emailIssue`)

      toast.error(error.message, {
        position: 'top-right',
      })
    },
  })

  async function verifyEmail() {
    if (userEmail.length > 0) {
      if (
        passwordRef.current!.value !== passwordConfirmationRef.current!.value
      ) {
        setLoading(false)
        toast.error('Les mots de passes ne sont pas similaire')
        return
      }
      const hash = encrypt(passwordRef.current!.value)

      validateUser({
        userEmail:userEmail,
        userPassIv:hash.iv,
        userPassContent:hash.content,
        inviteToken:id as string
      })
    } else {
      setErrorFormEmail(null)
      setUserEmailValid(false)
      setUserStatusPasswordSet(null)
      setUserStatusNameSet(null)
      setUserStatusMarketingAccept(null)
      setLoading(false)
      router.push(`/join/${id}/?error=emailIssue`)
    }
  }

  return (
    <AuthLayout pageTitle={pageTitle} pageDescription={description}>
      <form
        action="#"
        className="mt-8 flex w-full flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault()
          setLoading(true)
          acceptInviteHandler(event)
        }}
      >
        {stepForm !== 'two' && (
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              autoComplete="email"
              name="email"
              required
              placeholder="Email"
              ref={emailRef}
              onInput={() => setUserEmail(emailRef.current!.value)}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
        )}

        {errorFormEmail === null &&
          userStatusNameSet !== true &&
          userEmailValid === true &&
          stepForm !== 'two' && (
            <>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Prénom
                </label>

                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="Prénom"
                  ref={firstNameRef}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Nom de famille"
                  ref={lastNameRef}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            </>
          )}
        {errorFormEmail === null &&
          userEmailValid === true &&
          stepForm !== 'two' && (
            <div className="w-full flex flex-col md:flex-row gap-4">
              <div className="flex flex-col grow">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  autoComplete="off"
                  placeholder="Password"
                  minLength={12}
                  ref={passwordRef}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="flex flex-col grow">
                <label
                  htmlFor="passwordConfirmation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password Confirmation
                </label>

                <input
                  type="password"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  required
                  autoComplete="off"
                  minLength={12}
                  maxLength={200}
                  placeholder="Confirme ton mot de passe"
                  ref={passwordConfirmationRef}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          )}

        {errorFormEmail === null &&
          userEmailValid === true &&
          userStatusMarketingAccept !== true &&
          stepForm !== 'two' && (
            <div className="col-span-6">
              <label htmlFor="marketingAccept" className="flex gap-4">
                <input
                  type="checkbox"
                  id="marketingAccept"
                  name="marketingAccept"
                  ref={marketingAcceptRef}
                  className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                />

                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Je souhaite être tenu informé des événements, des mises à jour
                  du produit et des annonces de la société.
                </span>
              </label>
            </div>
          )}

        {errorFormEmail === null &&
          userEmailValid === true &&
          stepForm !== 'two' && (
            <div className="col-span-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En créant un compte, tu acceptes nos{' '}
                <a
                  href="#"
                  className="text-gray-700 underline dark:text-gray-200"
                >
                  conditions générales d&apos;utilisation
                </a>{' '}
                et notre{' '}
                <a
                  href="#"
                  className="text-gray-700 underline dark:text-gray-200"
                >
                  politique de confidentialité
                </a>
                .
              </p>
            </div>
          )}

        {stepForm === 'two' && (
          <div className="col-span-6">
            <label
              htmlFor="verificationNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Rentre le numéro de validation que nous t&apos;avons envoyé
            </label>

            <input
              type="text"
              id="verificationNumber"
              name="verificationNumber"
              placeholder="Numéro de validation"
              ref={verificationNumberRef}
              value={verificationNumber}
              autoComplete="off"
              onChange={handleVerficationNumber}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
            {errorFormValidationNumber && (
              <p className="text-left text-red-500">
                {errorFormValidationNumber}
              </p>
            )}
          </div>
        )}

        <div className="w-full flex items-center gap-4">
          <div
            className={`${
              errorFormEmail === null &&
              userEmailValid === true &&
              stepForm === 'two'
                ? 'flex grow w-full'
                : 'invisible hidden'
            }`}
          >
            {errorFormEmail === null &&
              userEmailValid === true &&
              stepForm === 'two' && (
                <button
                  type="submit"
                  disabled={loading === true || error === null}
                  className={`${
                    loading || error
                      ? 'cursor-not-allowed bg-gray-600'
                      : 'bg-black'
                  } 
                          inline-block shrink-0 w-full rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white`}
                >
                  {loading ? (
                    <LoadingDots color="#fff" />
                  ) : (
                    'Valider la création du compte'
                  )}
                </button>
              )}
          </div>
          <div
            className={`${
              stepForm !== 'two' ? 'flex grow w-full' : 'invisible hidden'
            }`}
          >
            {errorFormEmail === null &&
              userEmailValid === true &&
              stepForm === 'one' && (
                <button
                  type="button"
                  disabled={loading === true || error === null}
                  onClick={(e) => {
                    e.preventDefault()
                    setLoading(true)
                    verifyEmail()
                  }}
                  className={`${
                    loading || error
                      ? 'cursor-not-allowed bg-gray-600'
                      : 'bg-black'
                  } 
                          inline-block w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white`}
                >
                  {loading ? <LoadingDots color="#fff" /> : 'Créer un compte'}
                </button>
              )}
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}
