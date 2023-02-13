import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import LoadingDots from "@components/common/loading-dots/LoadingDots";
import toast from "react-hot-toast";
import { HttpMethod } from "@types";
import type { FormEvent } from "react";
import { encrypt } from "@twol/utils/auth/crypto";

import AuthLayout from "@components/app/layout/AuthLayout";

const pageTitle = "Rejoignez votre compte T-WOL";
const description = "Rejoignez votre compte T-WOL.";

export default function InviteUser() {
  const [loading, setLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const { query } = useRouter();
  const { error, id } = query;

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  // Adding form field
  // email & password
  const [userEmail, setUserEmail] = useState<string>("");
  const [userStatusPasswordSet, setUserStatusPasswordSet] = useState<
    boolean | null
  >(null);
  const [userEmailValid, setUserEmailValid] = useState<boolean | null>(null);
  const [userStatusNameSet, setUserStatusNameSet] = useState<boolean | null>(
    null
  );
  const [userStatusMarketingAccept, setUserStatusMarketingAccept] = useState<
    boolean | null
  >(null);
  const [debouncedUserEmail] = useDebounce(userEmail, 500);
  const [errorFormEmail, setErrorFormEmail] = useState<string | null>(null);

  //verification token
  const [verificationNumber, setVerficationNumber] = useState<string>("");
  const [errorFormValidationNumber, setErrorFormValidationNumber] = useState<
    string | null
  >(null);
  const [debouncedVerficationNumber] = useDebounce(verificationNumber, 500);

  // Form Ref
  const verificationNumberRef = useRef<HTMLInputElement | null>(null);
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement | null>(null);
  const marketingAcceptRef = useRef<HTMLInputElement | null>(null);
  const [stepForm, setStepForm] = useState<string>("one");

  //data to send
  const [firstNameFieldToSend, setFirstNameFieldToSend] = useState<
    string | null
  >(null);
  const [lastNameFieldToSend, setLastNameFieldToSend] = useState<string | null>(
    null
  );
  const [emailFieldToSend, setEmailFieldToSend] = useState<string | null>(null);
  const [passwordFieldToSend, setPasswordFieldToSend] = useState<string | null>(
    null
  );
  const [passwordConfirmationFieldToSend, setPasswordConfirmationFieldToSend] =
    useState<string | null>(null);
  const [marketingAcceptFieldToSend, setMarketingAcceptFieldToSend] = useState<
    boolean | null
  >(null);

  // Check if user email has receive an invitation + exist or not
  useEffect(() => {
    async function checkUserEmail() {
      if (debouncedUserEmail.length > 0) {
        const response = await fetch(
          `/api/invite-user/check-invite-user?userEmail=${debouncedUserEmail}&inviteToken=${id}`
        );
        const available = await response.json();
        if (available) {
          if (
            available === "unknown" ||
            available === "unknownOTP" ||
            available === "OTPExpired" ||
            available === "noUserFound"
          ) {
            setEmailFieldToSend(debouncedUserEmail);
            setMarketingAcceptFieldToSend(null);
            setPasswordFieldToSend(null);
            setPasswordConfirmationFieldToSend(null);
            setFirstNameFieldToSend(null);
            setLastNameFieldToSend(null);
            setErrorFormEmail(null);
            setUserEmailValid(false);
            setUserStatusPasswordSet(false);
            setUserStatusNameSet(false);
            setUserStatusMarketingAccept(false);
          } else if (
            available === "email invalid" ||
            available === "token invalid"
          ) {
            setEmailFieldToSend(null);
            setMarketingAcceptFieldToSend(null);
            setPasswordFieldToSend(null);
            setPasswordConfirmationFieldToSend(null);
            setFirstNameFieldToSend(null);
            setLastNameFieldToSend(null);
            setErrorFormEmail("invalid");
            setUserEmailValid(false);
            setUserStatusPasswordSet(null);
            setUserStatusNameSet(null);
            setUserStatusMarketingAccept(null);
          } else if (
            available === "error" ||
            available === "An error occured"
          ) {
            setErrorFormEmail("error");
            setEmailFieldToSend(null);
            setMarketingAcceptFieldToSend(null);
            setPasswordFieldToSend(null);
            setPasswordConfirmationFieldToSend(null);
            setFirstNameFieldToSend(null);
            setLastNameFieldToSend(null);
            toast.error(
              "Une erreur c'est produite avec notre serveur, si cela persiste veuillez contacter T-Wol.com"
            );
            setUserEmailValid(false);
            setUserStatusPasswordSet(null);
            setUserStatusNameSet(null);
            setUserStatusMarketingAccept(null);
          } else {
            setEmailFieldToSend(debouncedUserEmail);
            setPasswordFieldToSend(null);
            setPasswordConfirmationFieldToSend(null);
            setFirstNameFieldToSend(null);
            setLastNameFieldToSend(null);
            setErrorFormEmail(null);
            setUserEmailValid(true);
            if (available.passwordSet === true) {
              setUserStatusPasswordSet(true);
            } else {
              setUserStatusPasswordSet(false);
            }

            if (
              available.firstnameSet === true &&
              available.lastnameSet === true
            ) {
              setUserStatusNameSet(true);
            } else {
              setUserStatusNameSet(false);
            }

            if (available.marketingAccept === true) {
              setUserStatusMarketingAccept(true);
              setMarketingAcceptFieldToSend(true);
            } else {
              setUserStatusMarketingAccept(false);
              setMarketingAcceptFieldToSend(null);
            }
          }
        } else {
          setEmailFieldToSend(null);
          setMarketingAcceptFieldToSend(null);
          setPasswordFieldToSend(null);
          setPasswordConfirmationFieldToSend(null);
          setFirstNameFieldToSend(null);
          setLastNameFieldToSend(null);
          setUserEmailValid(false);
          setErrorFormEmail(null);
          setUserStatusPasswordSet(null);
          setUserStatusNameSet(null);
          setUserStatusMarketingAccept(null);
        }
      } else {
        setEmailFieldToSend(null);
        setMarketingAcceptFieldToSend(null);
        setPasswordFieldToSend(null);
        setPasswordConfirmationFieldToSend(null);
        setFirstNameFieldToSend(null);
        setLastNameFieldToSend(null);
        setErrorFormEmail(null);
        setUserEmailValid(false);
        setUserStatusPasswordSet(null);
        setUserStatusNameSet(null);
        setUserStatusMarketingAccept(null);
      }
    }
    checkUserEmail();
  }, [debouncedUserEmail, id]);

  const router = useRouter();

  async function acceptInvite(e: FormEvent<HTMLFormElement>) {
    const hashPasswordToSend = encrypt(passwordFieldToSend as string);
    const hashPasswordConfirmationToSend = encrypt(
      passwordConfirmationFieldToSend as string
    );

    const res = await fetch("/api/invite-user/", {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstNameFieldToSend,
        lastName: lastNameFieldToSend,
        language: "fr",
        email: emailFieldToSend,
        passwordIv: hashPasswordToSend.iv,
        passwordContent: hashPasswordToSend.content,
        passwordConfirmationIv: hashPasswordConfirmationToSend.iv,
        passwordConfirmationContent: hashPasswordConfirmationToSend.content,
        marketingAccept: marketingAcceptFieldToSend,
        verificationNumber: verificationNumberRef.current!.value,
        inviteToken: id,
      }),
    });

    if (res.ok) {
      setLoading(false);
      const data = await res.json();
      if (data === "unknownOTP") {
        toast.error("Le code est invalide.");
        return;
      } else if (data === "unknownUser") {
        toast.error(
          "Aucun utilisateur avec cette adresse email n'a été trouvé."
        );
        return;
      } else if (data === "given_verificationNumber") {
        toast.error("Le format du code est invalide.");
        return;
      } else if (data === "given_inviteToken") {
        toast.error("Le format du code de l'invitation n'est pas valide.");
        return;
      } else if (data === "unknownCheckInviteOTP") {
        toast.error("Nous n'avons trouvé aucune invitation pour cette email.");
        return;
      } else if (data === "checkInviteOTPExpired") {
        toast.error(
          "L'invitation à rejoindre le compte est expiré veuillez prendre contact avec l'administrateur du ccompte pour qu'il vous ré-envoie une invitation."
        );
        return;
      } else if (data === "wrongPassword") {
        toast.error(
          "Le mot de passe que tu as rentré n'est pas le mot de passe que tu utilises en temps normal."
        );
        return;
      } else if (data === "LanguageError") {
        toast.error("Le format de la langue est incorrect.");
        return;
      } else if (data === "Password format invalid") {
        toast.error("Le format des mots de passe n'est pas valide");
        return;
      } else if (data === "OTPExpired") {
        toast.error("Le code est expiré.");
        return;
      } else if (data === "email invalid") {
        toast.error("Le format de l'email est invalide.");
        return;
      } else if (data === "firstname invalid") {
        toast.error("Le format du prénom est invalide.");
        return;
      } else if (data === "lastname invalid") {
        toast.error("Le format du nom de famille est invalide.");
        return;
      } else if (data === "alreadyActivated") {
        toast.error("L'organisme caritatif est déjà activé.");
        return;
      } else if (data === "invalidPassword") {
        toast.error("Les mots de passe ne sont pas similaire.");
        return;
      } else if (data === "invalidMarketingValue") {
        toast.error(
          "Le format de la confirmation d'inscription à la newsletter n'est pas correct."
        );
        return;
      } else if (data === "An error occured") {
        toast.error(
          "Une erreur c'est produite lors de la création du compte. Veuillez prendre contact avec T-WOL.com."
        );
        return;
      } else {
        router.push(`/`);
      }
    } else {
      toast.error(
        "Une erreur c'est produite lors de la connexion avec notre serveur, si cela persiste veuillez contacter T-Wol.com"
      );
      setLoading(false);
      console.log(res);
    }
  }

  const handleVerficationNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(/\D/g, "");
    setVerficationNumber(result);
  };

  async function verifyEmail() {
    if (userEmail.length > 0) {
      if (
        passwordRef.current!.value !== passwordConfirmationRef.current!.value
      ) {
        setLoading(false);
        toast.error("Les mots de passes ne sont pas similaire");
        return;
      }
      const hash = encrypt(passwordRef.current!.value);

      const verifyEmailFetch = await fetch(
        `/api/invite-user/validate-user?userEmail=${userEmail}&userPassIv=${hash.iv}&userPassContent=${hash.content}&inviteToken=${id}`
      );
      const verifyEmailResult = await verifyEmailFetch.json();

      if (verifyEmailResult) {
        setLoading(false);
        if (verifyEmailResult === "email invalid") {
          toast.error("Le format de l'email est invalide.");
          return;
        } else if (verifyEmailResult === "token invalid") {
          toast.error("Le format de l'invitation est invalide.");
          return;
        } else if (verifyEmailResult === "Password format invalid") {
          toast.error("Le format du mot de passe est invalide.");
          return;
        } else if (
          verifyEmailResult === "unknownOTP" ||
          verifyEmailResult === "unknown"
        ) {
          toast.error("Nous n'avons pas trouvé d'invitation qui correspond.");
          return;
        } else if (verifyEmailResult === "wrongPassword") {
          toast.error(
            "Le mot de passe que tu as rentré n'est pas le mot de passe que tu utilises en temps normal."
          );
          return;
        } else if (verifyEmailResult === "OTPExpired") {
          toast.error(
            "L'invitation à rejoindre le compte est expiré veuillez prendre contact avec l'administrateur du ccompte pour qu'il vous ré-envoie une invitation."
          );
          return;
        } else if (verifyEmailResult === "tokenNotSaved") {
          toast.error(
            "un problème est survenue lors de la sauvegarde du token."
          );
          setErrorFormEmail(null);
          setUserEmailValid(false);
          setUserStatusPasswordSet(null);
          setUserStatusNameSet(null);
          setUserStatusMarketingAccept(null);
          setLoading(false);
          router.push(`/join/${id}/?error=emailIssue`);
          return;
        } else if (verifyEmailResult === "email not send") {
          toast.error(
            "Un problème est survenu lors de l'envoie de l'email de validation de l'identité contenant le code de validation."
          );
          return;
        } else if (verifyEmailResult === "allGood") {
          setPasswordFieldToSend(passwordRef.current!.value);
          setPasswordConfirmationFieldToSend(
            passwordConfirmationRef.current!.value
          );
          if (userStatusNameSet === false) {
            setFirstNameFieldToSend(firstNameRef.current!.value);
            setLastNameFieldToSend(lastNameRef.current!.value);
          }
          if (marketingAcceptFieldToSend === false) {
            if (marketingAcceptRef.current!.checked) {
              setMarketingAcceptFieldToSend(true);
            } else {
              setMarketingAcceptFieldToSend(false);
            }
          }
          setStepForm("two");
        } else {
          toast.error(
            "Une erreur c'est produite lors de l'envoie du code auprès de votre adresse email. Si cela persiste veuillez prendre contact avec T-WOL.com."
          );
          return;
        }
      } else {
        setLoading(false);
        toast.error(
          "Une erreur c'est produite lors de la connexion avec notre serveur, si cela persiste veuillez contacter T-WOL.com"
        );
      }
    } else {
      setErrorFormEmail(null);
      setUserEmailValid(false);
      setUserStatusPasswordSet(null);
      setUserStatusNameSet(null);
      setUserStatusMarketingAccept(null);
      setLoading(false);
      router.push(`/join/${id}/?error=emailIssue`);
    }
  }

  return (
    <AuthLayout pageTitle={pageTitle} pageDescription={description}>
      <form
        action="#"
        className="mt-8 flex w-full flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          setLoading(true);
          acceptInvite(event);
        }}
      >
        {stepForm !== "two" && (
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
          stepForm !== "two" && (
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
          stepForm !== "two" && (
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
          stepForm !== "two" && (
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
                  Je souhaite être tenu informé des événements, des
                  mises à jour du produit et des annonces de la société.
                </span>
              </label>
            </div>
          )}

        {errorFormEmail === null &&
          userEmailValid === true &&
          stepForm !== "two" && (
            <div className="col-span-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En créant un compte, tu acceptes nos{" "}
                <a
                  href="#"
                  className="text-gray-700 underline dark:text-gray-200"
                >
                  conditions générales d&apos;utilisation
                </a>{" "}
                et notre{" "}
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

        {stepForm === "two" && (
          <div className="col-span-6">
            <label
              htmlFor="verificationNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Rentre le numéro de validation que nous t&apos;avons
              envoyé
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
            className={`${errorFormEmail === null &&
                userEmailValid === true &&
                stepForm === "two"
                ? "flex grow w-full"
                : "invisible hidden"
              }`}
          >
            {errorFormEmail === null &&
              userEmailValid === true &&
              stepForm === "two" && (
                <button
                  type="submit"
                  disabled={loading === true || error === null}
                  className={`${loading || error
                      ? "cursor-not-allowed bg-gray-600"
                      : "bg-black"
                    } 
                          inline-block shrink-0 w-full rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white`}
                >
                  {loading ? (
                    <LoadingDots color="#fff" />
                  ) : (
                    "Valider la création du compte"
                  )}
                </button>
              )}
          </div>
          <div
            className={`${stepForm !== "two"
                ? "flex grow w-full"
                : "invisible hidden"
              }`}
          >
            {errorFormEmail === null &&
              userEmailValid === true &&
              stepForm === "one" && (
                <button
                  type="button"
                  disabled={loading === true || error === null}
                  onClick={(e) => {
                    e.preventDefault();
                    setLoading(true);
                    verifyEmail();
                  }}
                  className={`${loading || error
                      ? "cursor-not-allowed bg-gray-600"
                      : "bg-black"
                    } 
                          inline-block w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white`}
                >
                  {loading ? (
                    <LoadingDots color="#fff" />
                  ) : (
                    "Créer un compte"
                  )}
                </button>
              )}
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
