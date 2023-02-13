import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";

import { Button, Label, Modal, TextInput } from "flowbite-react";

import { HttpMethod } from "@types";

interface PropForm {
  name: string;
  id: string;
  userId: string;
  closeProcess: () => void;
  finishProcess: () => void;
}
type DeletFormValues = {
  toValidate: string;
};
export default function PermissionSetsDeleteModal({
  name,
  id,
  userId,
  closeProcess,
  finishProcess,
}: PropForm) {
  const [showModal, setShowModal] = useState<boolean>(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      closeProcess();
    }, 1000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DeletFormValues>();

  const [toValidateIsValid, setToValidateIsValid] = useState<boolean>(true);
  const [toValidate, setToValidate] = useState<string>("");
  const [debouncedCharityNumber] = useDebounce(toValidate, 500);
  const handleToValidateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value;
    setToValidate(result);
  };

  useEffect(() => {
    if (debouncedCharityNumber === name) {
      setToValidateIsValid(false);
    } else {
      setToValidateIsValid(true);
    }
  }, [debouncedCharityNumber, name]);

  const [loading, setLoading] = useState<boolean>(false);
  const [resetPermissionSetsSuccess, setResetPermissionSetsSuccess] = useState<string | null>();
  const [resetPermissionSetsError, setResetPermissionSetsError] = useState<string | null>();
  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await fetch(
        `/api/settings/account/users-and-teams/permission-sets?userId=${userId}&id=${id}`,
        {
          method: HttpMethod.DELETE,
        }
      ).then((res) => {
        setLoading(false);

        if (res.ok) {
          setResetPermissionSetsSuccess("C'est officiel ce set de permission a été supprimé ");
          setLoading(false);
          setResetPermissionSetsError("");
          setTimeout(() => {
            setShowModal(false);
            finishProcess();
          }, 2000);
        } else {
          setLoading(false);
          setResetPermissionSetsError("An error occured");
          setResetPermissionSetsSuccess(null);
        }
      });
    } catch (error) {
      setLoading(false);
      setResetPermissionSetsError("An error occured");
      setResetPermissionSetsSuccess(null);
    }
  });
  return (
    <div>
      <Modal
        show={showModal}
        size="lg"
        popup={true}
        onClose={loading ? () => null : handleCloseModal}
        className=""
      >
        {!resetPermissionSetsSuccess ? (
          <Modal.Header className="flex items-center !pl-4">
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Delete this Permission Set?
            </span>
          </Modal.Header>
        ) : (
          <Modal.Header className="flex items-center !pl-4" />
        )}
        <Modal.Body className="!p-0">
          {!resetPermissionSetsSuccess ? (
            <div className="bg-orange-100 dark:bg-gray-600 px-6 py-4 border-solid border-t-2 border-orange-200 dark:border-gray-500">
              <p className="text-sm font-thin text-orange-400">
                Unexpected bad things can happen if you don’t read this!
              </p>
            </div>
          ) : null}

          <div className="px-4 py-4 flex flex-col gap-4">
            {!resetPermissionSetsSuccess ? (
              <>
                <p className="text-base font-thin text-gray-500 dark:text-gray-400">
                  You&apos;re about to delete 1 Permission Set. This action{" "}
                  <b className="text-black font-medium dark:text-gray-200">
                    can&apos;t be undone
                  </b>. This will not change any access users have to your account.
                </p>
                <p className="text-base font-thin text-gray-500 dark:text-gray-400">
                  Permission Set Name:{" "}
                  <b className="text-black font-medium dark:text-gray-200">
                    {name}
                  </b>
                </p>
                <form
                  action="#"
                  className="mt-0 flex w-full flex-col gap-4"
                  onSubmit={onSubmit}
                >
                  <div>
                    <Label htmlFor="toValidate">
                      Please type in the name of the permission set to confirm.
                    </Label>
                    <TextInput
                      type="text"
                      value={toValidate}
                      {...register("toValidate", {
                        required: true,
                        onChange: handleToValidateChange,
                        pattern:
                          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(([',. -][a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ])?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]*)*$/,
                      })}
                    />
                  </div>
                  <div className="flex justify-center w-full">
                    <Button
                      disabled={loading || toValidateIsValid}
                      className="w-full"
                      type="submit"
                      color="failure"
                    >
                      I understand, please delete this permission set
                    </Button>
                  </div>
                </form>
              </>
            ) : null}
            {resetPermissionSetsError ? (
              <div className="mt-1 text-sm font-normal text-red-700 dark:text-red-200">
                <p>{resetPermissionSetsError}</p>
              </div>
            ) : null}
            {resetPermissionSetsSuccess ? (
              <div className="text-base font-thin text-gray-500 dark:text-gray-400">
                <p>{resetPermissionSetsSuccess}</p>
              </div>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
