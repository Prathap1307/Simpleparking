import React from "react";
import { Alert, Button } from "@heroui/react";

const CustomDangerAlert = ({
  title = "Danger",
  message,
  button1Label,
  button2Label,
  onButton1Click,
  onButton2Click,
}) => {
  return (
    <Alert
      color="danger"
      variant="faded"
      title={title}
      classNames={{
        base: [
          "bg-default-50 dark:bg-background shadow-sm",
          "border-1 border-default-200 dark:border-default-100",
          "relative before:content-[''] before:absolute before:z-10",
          "before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1",
          "rounded-l-none border-l-0",
          "before:bg-danger",
        ].join(" "),
        mainWrapper: "pt-1",
        iconWrapper: "dark:bg-transparent",
      }}
    >
      <p className="text-sm text-default-700 mb-3">{message}</p>
      <div className="flex items-center gap-2">
        <Button
          className="bg-background text-default-700 font-medium border-1 shadow-small"
          size="sm"
          variant="bordered"
          onClick={onButton1Click}
        >
          {button1Label}
        </Button>
        <Button
          className="text-default-500 font-medium underline underline-offset-4"
          size="sm"
          variant="light"
          onClick={onButton2Click}
        >
          {button2Label}
        </Button>
      </div>
    </Alert>
  );
};

export default CustomDangerAlert;
