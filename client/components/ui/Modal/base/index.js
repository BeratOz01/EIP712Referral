import React, { Fragment } from "react";

// Components
import { Dialog, Transition } from "@headlessui/react";
import { Spinner } from "components/ui/Spinner";

// Icons
import { TiTick } from "react-icons/ti";
import { FaTimes } from "react-icons/fa";

const Modal = ({ show, onHide, loading, error, success }) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onHide}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {loading ? (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 text-gray-900 font-bold tracking-wide montserrat text-center"
                    >
                      Transaction in progress ...
                    </Dialog.Title>
                    <div className="flex w-full h-full p-5 justify-center">
                      <Spinner />
                    </div>
                  </>
                ) : (
                  <>
                    {error ? (
                      <>
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 text-red-500 font-bold tracking-wide montserrat text-center"
                        >
                          Transaction failed
                        </Dialog.Title>
                        <FaTimes
                          className="text-red-500 text-center mx-auto my-0 p-0"
                          size={50}
                        />
                      </>
                    ) : success ? (
                      <>
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 text-green-500 font-bold tracking-wide montserrat text-center"
                        >
                          Transaction success
                        </Dialog.Title>
                        <TiTick
                          className="text-green-500 text-center mx-auto my-0 p-0"
                          size={50}
                        />
                      </>
                    ) : null}
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
