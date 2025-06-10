'use client';

import { CircularProgress, Card, CardBody, CardFooter, Chip } from "@heroui/react";

export default function LoadingCard({ text }) {
  return (
    <Card className="w-[240px] h-[240px] border-none mx-auto">
      <CardBody className="justify-center items-center pb-0 ">
        <CircularProgress aria-label="Loading..." size="lg" />
      </CardBody>
      <CardFooter className="justify-center items-center pt-0">
        <Chip
          classNames={{
            content: "text-black",
          }}
        >
          {text}
        </Chip>
      </CardFooter>
    </Card>
  );
}
