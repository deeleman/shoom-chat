import { Heading } from "@twilio-paste/core/Heading";
import { Flex } from "@twilio-paste/core/flex";
import { ThemeSwitch } from "./ThemeSwitch";

export const Header: React.FC = (): React.ReactElement => {
  return (
    <Flex hAlignContent={'between'} vAlignContent={'center'} width={'100%'} padding={'space80'}>
      <Heading as="h1" variant="heading10" marginBottom="space0">Shoom</Heading>
      <ThemeSwitch />
    </Flex>
  );
};
