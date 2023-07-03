import { SignUp } from "@clerk/nextjs";
import { Flex } from "@mantine/core";

export default function Page() {
  return (
    <Flex sx={{ height: "100vh" }} align="center" justify="center">
      <SignUp />
    </Flex>
  );
}
