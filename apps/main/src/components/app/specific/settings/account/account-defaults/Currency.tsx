import { useRouter } from "next/router";
import { useState } from "react";

import {
  Badge,
  Button,
  Dropdown,
  Table,
  Tooltip,
} from "flowbite-react";

import Loader from "@components/common/Loader";

interface PropForm {
  userId: string;
}

export default function Currency({ userId }: PropForm) {
  const router = useRouter();
  //Open Modal Change Login
  const [openModalLogin, setOpenModalLogin] = useState(false);
  //Saving new Login

  if (!userId) return <Loader />;

  return (
    <>
      <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
        These defaults will be used for deals and properties.
      </p>
      <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="my-8 flex flex-col space-y-6 w-full">
        <div className="flex flex-col lg:flex-row justify-between">
          <div>
            <h3 className="text-gray-800 dark:text-gray-400 text-xl font-medium my-4">
              Currencies
            </h3>
          </div>
          <div className="flex jusify-center items-center">
            <Tooltip
              className="text-xs font-light max-w-xs shadow"
              content="You've reached the Brand Kit limit for your account."
            >
              {" "}
              <div>
                <Button
                  size="md"
                  color="dark"
                  onClick={() => setOpenModalLogin(!openModalLogin)}
                >
                  Add currency
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>

        <div className="w-full relative">
          <Table hoverable={true} className="w-full">
            <Table.Head>
              <Table.HeadCell>NAME</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
              <Table.HeadCell>Exchange Rate</Table.HeadCell>
              <Table.HeadCell>Format</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  euros €
                </Table.Cell>
                <Table.Cell>
                  <div className="w-full sm:w-1/5 mt-2 sm:mt-0 flex center justify-start sm:justify-end items-center">
                    <Dropdown
                      arrowIcon={true}
                      placement="bottom-end"
                      label="Actions"
                      color="gray"
                      size="sm"
                      className="w-48 rounded-none"
                    >
                      <Dropdown.Item>Editer</Dropdown.Item>
                      <Dropdown.Item>Supprimer</Dropdown.Item>
                    </Dropdown>
                  </div>
                </Table.Cell>
                <Table.Cell><Badge color="info">Company currency</Badge></Table.Cell>
                <Table.Cell>123 456,78 €</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}
