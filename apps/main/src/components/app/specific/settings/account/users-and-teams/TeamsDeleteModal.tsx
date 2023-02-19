import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast'

import { Button, Label, Modal, TextInput } from "flowbite-react";

import { api, type RouterOutputs } from '@lib/utils/api'

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
export default function TeamsDeleteModal({
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
  const [resetTeamsSuccess, setResetTeamsSuccess] = useState<string | null>();
  const [resetTeamsError, setResetTeamsError] = useState<string | null>();


  const {
    mutate: deleteTeamsSettings,
    isLoading: isLoadingDeleteTeamsSettings,
  } =
    api.adminSettingsAccountUsersAndTeamsTeams.deleteTeamsSettings.useMutation(
      {
        async onSuccess(data) {
          setResetTeamsSuccess("C'est officiel cette Team a été supprimé ");
          setLoading(false);
          setResetTeamsError("");
          setTimeout(() => {
            setShowModal(false);
            finishProcess();
          }, 2000);
          toast.success(`Teams deleted`, {
            position: 'top-right',
          })
        },
        onError(error) {
          setLoading(false);
          setResetTeamsError("An error occured");
          setResetTeamsSuccess(null);
          toast.error(error.message, {
            position: 'top-right',
          })
        },
      }
    )
  const onSubmit = handleSubmit(async (data) => {
      setLoading(true);
      deleteTeamsSettings({
          userId: userId,
          id:id,
      })
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
        {!resetTeamsSuccess ? (
          <Modal.Header className="flex items-center !pl-4">
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Are you sure ?
            </span>
          </Modal.Header>
        ) : (
          <Modal.Header className="flex items-center !pl-4" />
        )}
        <Modal.Body className="!p-0">
          {!resetTeamsSuccess ? (
            <div className="bg-orange-100 dark:bg-gray-600 px-6 py-4 border-solid border-t-2 border-orange-200 dark:border-gray-500">
              <p className="text-sm font-thin text-orange-400">
                Unexpected bad things can happen if you don’t read this!
              </p>
            </div>
          ) : null}

          <div className="px-4 py-4 flex flex-col gap-4">
            {!resetTeamsSuccess ? (
              <>
                <p className="text-base font-thin text-gray-500 dark:text-gray-400">
                  This action{" "}
                  <b className="text-black font-medium dark:text-gray-200">
                    CANNOT
                  </b>{" "}
                  be undone. This will permanently delete the team{" "}
                  <b className="text-black font-medium dark:text-gray-200">
                    {name}
                  </b>{" "}
                  files, report, issues and comments, and remove all
                  collaborator assosiations.
                </p>
                <form
                  action="#"
                  className="mt-8 flex w-full flex-col gap-4"
                  onSubmit={onSubmit}
                >
                  <div>
                    <Label htmlFor="toValidate">
                      Please type in the name of the team to confirm.
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
                      I understand, please delete this team
                    </Button>
                  </div>
                </form>
              </>
            ) : null}
            {resetTeamsError ? (
              <div className="mt-1 text-sm font-normal text-red-700 dark:text-red-200">
                <p>{resetTeamsError}</p>
              </div>
            ) : null}
            {resetTeamsSuccess ? (
              <div className="text-base font-thin text-gray-500 dark:text-gray-400">
                <p>{resetTeamsSuccess}</p>
              </div>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
