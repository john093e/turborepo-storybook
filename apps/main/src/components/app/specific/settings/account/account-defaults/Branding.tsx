import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  Dropdown,
  Tooltip,
} from "flowbite-react";

import Loader from "@components/common/Loader";

interface PropFormBranding {
  userId: string;
}

export default function Branding({ userId }: PropFormBranding) {
  const router = useRouter();
  //Open Modal Change Login
  const [openModalLogin, setOpenModalLogin] = useState<boolean>(false);
  //Saving new Login

  if (!userId) return <Loader />;
  return (
    <>
      <h3 className="text-gray-800 dark:text-gray-400 text-xl font-medium my-4">
        Branding
      </h3>
      <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
        Set your logo and colors for tools where you can show your branding.
        These settings will help you quickly choose brand options when creating
        public facing content.
      </p>
      <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="my-8 flex flex-col space-y-6 w-full">
        <div className="flex flex-col lg:flex-row justify-between">
          <div>
            <h4 className="text-gray-800 dark:text-gray-400 text-lg font-medium my-4">
              My Brand Kits
            </h4>
            <p className="text-gray-800 dark:text-gray-400 text-sm my-4">
              Manage assets and settings for each of your company&apos;s brands.
            </p>
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
                  onClick={() => setOpenModalLogin(!openModalLogin)}
                >
                  Create a new brand kit
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>

        <div className="w-full flex relative">
          <Card className="w-full mt-6 dark:shadow-xl">
            <div className="items-center flex flex-col sm:flex-row">
              <div className="w-full sm:w-4/5 flex">
                <div className="sm:flex w-16 relative block">
                  <Image
                    src="/static/3D/pencil-case.png"
                    alt="Image en 3D d'un pot de crayon"
                    fill
                    sizes="lg"
                    className="object-contain"
                  />
                </div>
                <div className="pl-0 sm:pl-6 py-0 sm:py-4 relative flex gap-4 items-center">
                  <h5 className="text-lg font-medium tracking-tight text-gray-800 dark:text-white">
                    My brand kit
                  </h5>
                  <Badge color="info">Primary</Badge>
                </div>
              </div>
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
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
