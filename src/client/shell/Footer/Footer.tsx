import { Badge, Box, Flex } from '@twilio-paste/core';
import GitHubButton from "react-github-btn";
import { SettingsMenu } from './SettingsMenu';

export const Footer: React.FC = (): React.ReactElement => {
  return (
    <Box padding={'space60'} width={'100%'}>
      <Flex width={'100%'} hAlignContent={'between'} vAlignContent={'bottom'}>
        <Badge as="span" variant="neutral_counter">v1.0.0</Badge>
        <SettingsMenu />
        <GitHubButton
          href="https://github.com/deeleman/shoom-chat"
          data-color-scheme={`no-preference: light; light: light; dark: dark;`}
          data-show-count="true"
          aria-label="Star deeleman/shoom-chat on GitHub"
        >
          Star
        </GitHubButton>
      </Flex>
    </Box>
  );
}