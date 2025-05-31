import { memo, type PropsWithChildren } from "react";
import { Flex } from '@twilio-paste/flex';
import { Backdrop } from './Backdrop';
import { Header } from './Header';
import { Footer } from './Footer';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Backdrop>
      <Flex width={'100%'} height={'100vh'} vertical>
        <Header />
        <Flex grow vAlignContent={'center'} hAlignContent={'center'}>
          {children}
        </Flex>
        <Footer />
      </Flex>
    </Backdrop>
  );
};

export default memo(Layout);
