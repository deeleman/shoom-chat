import { Flex, Heading } from "@twilio-paste/core";
import { ThemeSwitch } from "./ThemeSwitch";

export const Header: React.FC = (): React.ReactElement => {
  return (
    <Flex hAlignContent={'between'} vAlignContent={'center'} width={'100%'} padding={'space80'}>
      <Heading as="h1" variant="heading10" marginBottom="space0">
        Shoom
      </Heading>
      <ThemeSwitch />
    </Flex>
  );
};
